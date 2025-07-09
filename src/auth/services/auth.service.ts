import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput, LoginUserInput } from '../dtos/auth.dto';
import { UserService } from 'src/user/services/user.service';
import { PasswordService } from 'src/common/services/password.service';
import { UserDocument } from 'src/user/entities/user.schema';
import { RegisterResponse } from '../response/register-response';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TokenService } from 'src/common/services/token.service';
import { Request, Response } from 'express';
import { LoginResponse } from '../response/login-response';
import { JwtPayload } from 'jsonwebtoken';
import { RefreshTokenResponse } from '../response/refresh-token-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async refreshAccessToken(
    req: Request,
    res: Response,
  ): Promise<RefreshTokenResponse> {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken)
      throw new BadRequestException('Refresh token is missing');
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);
    if (!decoded) throw new BadRequestException('Invalid refresh token');
    const value = await this.cacheManager.get(`refresh-token:${decoded.jti}`);
    if (!value) throw new BadRequestException('Refresh token not found');

    const { token, jti: accessTokenJti } =
      this.tokenService.generateAccessToken({
        sub: decoded.sub,
        email: decoded.email,
      });

    await this.cacheManager.set(
      `access-token:${accessTokenJti}`,
      token,
      15 * 60,
    );

    return {
      message: 'Access token refreshed successfully',
      accessToken: token,
    };
  }

  async validateToken(token: string) {
    const decoded = this.tokenService.verifyAccessToken(token);
    const value = await this.cacheManager.get(`access-token:${decoded.jti}`);
    console.log(`the value from the cache is: ${value}`);
  }

  async login(input: LoginUserInput, res: Response): Promise<LoginResponse> {
    const user: UserDocument | null = await this.userService.findOneByEmail(
      input.email,
    );
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid: boolean = await this.passwordService.comparePassword(
      input.password,
      user.password,
    );
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const payload = {
      sub: user._id as string,
      email: user.email,
    };

    const { token: accessToken, jti: accessJti } =
      this.tokenService.generateAccessToken(payload);
    const { token: refreshToken, jti: refreshJti } =
      this.tokenService.generateRefreshToken(payload);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
    });

    try {
      await this.cacheManager.set(
        `access-token:${accessJti}`,
        accessToken,
        15 * 60,
      );
      console.log(`Successfully set access token: access-token:${accessJti}`);

      const fetchData = await this.cacheManager.get(`bishal`);
      console.log(`Fetched data from cache: ${fetchData}`);
    } catch (error) {
      console.error('Error setting access token:', error);
    }
    await this.cacheManager.set(
      `refresh-token:${refreshJti}`,
      refreshToken,
      7 * 24 * 60 * 60,
    );

    return {
      message: 'Login successful',
      accessToken,
    };
  }

  async register(input: CreateUserInput): Promise<RegisterResponse> {
    const user: UserDocument | null = await this.userService.findOneByEmail(
      input.email,
    );
    if (user) throw new ConflictException('User already exists');
    const password: string = await this.passwordService.hashPassword(
      input.password,
    );

    const createdUser = await this.userService.createUser({
      ...input,
      password,
    });
    return {
      user: createdUser,
      message: 'User registration successfully',
    };
  }
}

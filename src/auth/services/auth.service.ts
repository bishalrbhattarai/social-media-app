import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput, LoginUserInput } from '../dtos/auth.dto';
import { UserService } from 'src/user/services/user.service';
import { PasswordService } from 'src/common/services/password.service';
import { RegisterResponse } from '../response/register-response';
import { TokenService } from 'src/common/services/token.service';
import { Request, Response } from 'express';
import { LoginResponse } from '../response/login-response';
import { RefreshTokenResponse } from '../response/refresh-token-response';
import { CacheService } from 'src/common/services/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
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

    const value = await this.cacheService.get<string>(
      `refresh-token:${decoded.jti}`,
    );
    if (!value) throw new BadRequestException('Refresh token not found');

    const { token, jti: accessTokenJti } =
      this.tokenService.generateAccessToken({
        sub: decoded.sub,
        email: decoded.email,
      });

    await this.cacheService.set(
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
    const value = await this.cacheService.get(`access-token:${decoded.jti}`);
    console.log(`the value from the cache is: ${value}`);
  }

  async login(input: LoginUserInput, res: Response): Promise<LoginResponse> {
    const user = await this.userService.findOneByEmail(input.email);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await this.passwordService.comparePassword(
      input.password,
      user.password,
    );
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const payload = { sub: user._id as string, email: user.email, isEmailVerified: user.isEmailVerified };
    const { token: accessToken, jti: accessJti } =
      this.tokenService.generateAccessToken(payload);
    const { token: refreshToken, jti: refreshJti } =
      this.tokenService.generateRefreshToken(payload);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
    });

    await this.cacheService.set(
      `access-token:${accessJti}`,
      accessToken,
      15 * 60,
    );
    await this.cacheService.set(
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
    const user = await this.userService.findOneByEmail(input.email);
    if (user) throw new ConflictException('User already exists');

    const password = await this.passwordService.hashPassword(input.password);
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

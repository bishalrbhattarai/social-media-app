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
import { LogoutResponse } from '../response/logout-response';
import { EmailVerificationJobService } from 'src/job/email-verification.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailVerificationResponse } from '../response/email-verification-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
    private readonly emailVerificationJobService: EmailVerificationJobService,
  ) {}

  async verifyEmailToken(req: Request): Promise<EmailVerificationResponse> {
    const token = req.headers['email-verification-token'];
    if (!token) throw new BadRequestException('Token is missing');
    const _id = await this.cacheService.get<string>(
      `email-verification:${token}`,
    );
    if (!_id) throw new BadRequestException('Invalid email-verification-token');
    const user = await this.userService.findOneById(_id);
    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified) throw new BadRequestException('Email already verified');
    user.isEmailVerified = true;
    await user.save();
    await this.cacheService.del(`email-verification:${token}`);
    return {
      message: 'Email verified successfully',
    };
  }

  async logout(req: Request, res: Response): Promise<LogoutResponse> {
    const headers = req.headers.authorization?.split(' ')[1];
    console.log(`the headers are: ${headers}`);
    if (!headers) throw new BadRequestException('Token is missing');
    const accessTokenPayload = this.tokenService.verifyAccessToken(headers);
    if (!accessTokenPayload)
      throw new BadRequestException('Invalid access token');
    const value = await this.cacheService.get(
      `access-token:${accessTokenPayload.jti}`,
    );
    if (!value) throw new BadRequestException('Access token not found');
    await this.cacheService.del(`access-token:${accessTokenPayload.jti}`);
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken)
      throw new BadRequestException('Refresh token is missing');
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);
    if (!decoded) throw new BadRequestException('Invalid refresh token');
    const refreshTokenValue = await this.cacheService.get(
      `refresh-token:${decoded.jti}`,
    );
    if (!refreshTokenValue)
      throw new BadRequestException('Refresh token not found');
    await this.cacheService.del(`refresh-token:${decoded.jti}`);

    return {
      message: 'Logged out successfully',
    };
  }

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
  }

  async login(input: LoginUserInput, res: Response): Promise<LoginResponse> {
    const user = await this.userService.findOneByEmail(input.email);
    if (!user) throw new NotFoundException('User not found');

    await this.passwordService.comparePassword(input.password, user.password);

    const payload = {
      sub: user._id as string,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };

    const { accessToken, accessTokenJti, refreshToken, refreshTokenJti } =
      this.tokenService.generateAccessAndRefreshTokens(payload);

    this.setRefreshTokenCookie(res, refreshToken);

    await this.cacheService.setAccessAndRefreshTokens(
      accessTokenJti,
      refreshTokenJti,
      accessToken,
      refreshToken,
    );
    return {
      message: 'Login successful',
      accessToken,
    };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async register(input: CreateUserInput): Promise<RegisterResponse> {
    const user = await this.userService.findOneByEmail(input.email);
    if (user) throw new ConflictException('User already exists');

    const password = await this.passwordService.hashPassword(input.password);
    const createdUser = await this.userService.createUser({
      ...input,
      password,
    });

    if (!createdUser) throw new BadRequestException('User registration failed');
    const token = uuidv4();

    await this.cacheService.set(
      `email-verification:${token}`,
      createdUser._id,
      30 * 60 * 1000,
    );
    this.emailVerificationJobService.addJob(createdUser.email, token);
    return {
      user: createdUser,
      message: 'User registration successfully',
    };
  }
}

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
import { Response } from 'express';
import { LoginResponse } from '../response/login-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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

    await this.cacheManager.set(
      `access-token:${accessJti}`,
      accessToken,
      15 * 60,
    ); // 15 mins
    await this.cacheManager.set(
      `refresh-token:${refreshJti}`,
      refreshToken,
      7 * 24 * 60 * 60,
    ); // 7 days

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

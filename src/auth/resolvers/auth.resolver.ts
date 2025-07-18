import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ChangePasswordInput,
  CreateUserInput,
  LoginUserInput,
} from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { RegisterResponse } from '../response/register-response';
import { LoginResponse } from '../response/login-response';
import { Request, Response } from 'express';
import { RefreshTokenResponse } from '../response/refresh-token-response';
import { LogoutResponse } from '../response/logout-response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { EmailVerificationResponse } from '../response/email-verification-response';
import { UserType } from 'src/user/entities/user.entity';
import { ChangePasswordResponse } from '../response/change-password-response';
import { ForgotPasswordResponse } from '../response/forgot-password-response';

export interface User {
  _id: string;
  email: string;
}

export interface GqlContext {
  req: Request & { user?: User };
  res: Response;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  verifyResetPasswordToken(
    @Context() { req }: GqlContext,
    @Args('newPassword') newPassword: string,
  ) {
    return this.authService.verifyResetPasswordToken(req, newPassword);
  }

  @Query(() => UserType)
  @UseGuards(AuthGuard)
  myProfile(@CurrentUser() user: User): Promise<UserType> {
    return this.authService.myProfile(user);
  }

  @Mutation(() => ForgotPasswordResponse)
  forgotPassword(
    @Args('email') email: string,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.sendForgotPasswordEmail(email);
  }

  @Mutation(() => EmailVerificationResponse)
  generateEmailVerificationToken(
    @Args('email') email: string,
  ): Promise<EmailVerificationResponse> {
    return this.authService.generateEmailVerificationToken(email);
  }

  @Mutation(() => ChangePasswordResponse)
  @UseGuards(AuthGuard)
  changePassword(
    @Args('input') input: ChangePasswordInput,
    @CurrentUser() user: User,
  ): Promise<ChangePasswordResponse> {
    return this.authService.changePassword(
      user,
      input.currentPassword,
      input.newPassword,
    );
  }

  @Mutation(() => EmailVerificationResponse)
  verifyEmailToken(
    @Context() { req }: GqlContext,
  ): Promise<EmailVerificationResponse> {
    console.log('From verifyEmailToken mutation');
    return this.authService.verifyEmailToken(req);
  }

  @Mutation(() => RegisterResponse)
  register(@Args('input') input: CreateUserInput): Promise<RegisterResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => RefreshTokenResponse)
  refreshAccessToken(
    @Context() { req, res }: GqlContext,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshAccessToken(req, res);
  }

  @Mutation(() => LogoutResponse)
  async logout(@Context() { req, res }: GqlContext): Promise<LogoutResponse> {
    await this.authService.logout(req, res);
    return { message: 'Logged out successfully' };
  }

  @Mutation(() => LoginResponse)
  login(
    @Args('input') input: LoginUserInput,
    @Context() { res }: GqlContext,
  ): Promise<LoginResponse> {
    return this.authService.login(input, res);
  }
}

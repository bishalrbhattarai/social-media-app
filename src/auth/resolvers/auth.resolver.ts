import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, LoginUserInput } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { RegisterResponse } from '../response/register-response';
import { LoginResponse } from '../response/login-response';
import { Request, Response } from 'express';
import { RefreshTokenResponse } from '../response/refresh-token-response';
import { LogoutResponse } from '../response/logout-response';

export interface GqlContext {
  req: Request;
  res: Response;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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

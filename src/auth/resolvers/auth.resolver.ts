import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput, LoginUserInput } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { RegisterResponse } from '../response/register-response';
import { LoginResponse } from '../response/login-response';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  register(@Args('input') input: CreateUserInput): Promise<RegisterResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponse)
  login(
    @Args('input') input: LoginUserInput,
    @Context() { res }: { res: Response },
  ): Promise<LoginResponse> {
    return this.authService.login(input, res);
  }
}

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { RegisterResponse } from '../response/register-response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  register(@Args('input') input: CreateUserInput): Promise<RegisterResponse> {
    return this.authService.register(input);
  }
}

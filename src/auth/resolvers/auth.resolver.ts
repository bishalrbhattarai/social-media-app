import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  register(@Args('input') input: CreateUserInput) {
    return this.authService.register(input);
  }
}

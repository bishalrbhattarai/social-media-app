import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  check(): string {
    return 'User resolver is working!';
  }
}

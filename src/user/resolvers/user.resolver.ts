import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  check() {
    return 'User resolver is working!';
  }
}

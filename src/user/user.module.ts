import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  providers: [UserResolver, UserService],
})
export class UserModule {}

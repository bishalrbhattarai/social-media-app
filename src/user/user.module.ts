import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}

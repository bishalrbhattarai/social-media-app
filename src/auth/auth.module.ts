import { Module } from '@nestjs/common';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';
import { JobModule } from 'src/job/job.module';

@Module({
  imports: [UserModule, JobModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}

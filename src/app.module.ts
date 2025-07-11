import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GraphqlModule } from './graphql/graphql.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { AuthGuard } from './common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from './email/email.module';
import { JobModule } from './job/job.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RedisCacheModule,
    GraphqlModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    EmailModule,
    JobModule,
    PostModule,
  ],
})
export class AppModule {}

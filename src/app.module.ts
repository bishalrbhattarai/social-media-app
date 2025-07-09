import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GraphqlModule } from './graphql/graphql.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RedisCacheModule,
    GraphqlModule,
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}

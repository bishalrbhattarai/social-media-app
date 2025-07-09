import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GraphqlModule,UserModule],
})
export class AppModule {}

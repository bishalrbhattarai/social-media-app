import { Global, Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  imports: [JwtModule.register({ global: true })],
  providers: [PasswordService, TokenService, CacheService],
  exports: [PasswordService, TokenService, CacheService],
})
export class CommonModule {}

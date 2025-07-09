import { Global, Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({ global: true })],
  providers: [PasswordService, TokenService],
  exports: [PasswordService, TokenService],
})
export class CommonModule {}

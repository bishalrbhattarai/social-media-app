import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

export interface JwtPayload {
  sub: string;
  email: string;
}
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: JwtPayload) {
    const accessTokenJti = uuidv4();
    const token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: 'your-access-token-secret',
      jwtid: accessTokenJti,
    });
    return { token, jti: accessTokenJti };
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: 'your-access-token-secret',
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshTokenJti = uuidv4();
    const token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: 'your-refresh-token-secret',
      jwtid: refreshTokenJti,
    });
    return { token, jti: refreshTokenJti };
  }
}

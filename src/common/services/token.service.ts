import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  isEmailVerified?: boolean;
  exp?: number;
  jti?: string;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessAndRefreshTokens(payload: JwtPayload) {
    const { token: accessToken, jti: accessTokenJti } =
      this.generateAccessToken(payload);
    const { token: refreshToken, jti: refreshTokenJti } =
      this.generateRefreshToken(payload);

    return {
      accessToken,
      accessTokenJti,
      refreshToken,
      refreshTokenJti,
    };
  }

  generateAccessToken(payload: JwtPayload) {
    const accessTokenJti = uuidv4();
    const token = this.jwtService.sign(payload, {
      expiresIn: '20h',
      secret: 'your-access-token-secret',
      jwtid: accessTokenJti,
    });
    return { token, jti: accessTokenJti };
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwtService.verify(token, {
      secret: 'your-access-token-secret',
    }); 
  }

  verifyRefreshToken(token: string): JwtPayload {
    return this.jwtService.verify(token, {
      secret: 'your-refresh-token-secret',
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

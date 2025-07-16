import { Injectable } from '@nestjs/common';
import { TokenService } from 'src/common/services/token.service';
import { CacheService } from 'src/common/services/cache.service';

export interface WebSocketUser {
  _id: string;
  sub: string;
  email: string;
  isEmailVerified: boolean;
  jti: string;
}

@Injectable()
export class WebSocketAuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
  ) {}

  async validateConnection(connectionParams: any): Promise<WebSocketUser> {
    // Extract authorization token
    const authHeader = connectionParams?.authorization || 
                      connectionParams?.Authorization;
    
    if (!authHeader) {
      throw new Error('Authorization token is required');
    }

    // Handle both string and other types
    const authHeaderStr = typeof authHeader === 'string' ? authHeader : String(authHeader);
    
    // Remove 'Bearer ' prefix if present
    const token = authHeaderStr.replace('Bearer ', '').trim();
    
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    // Verify the JWT token
    let payload;
    try {
      payload = this.tokenService.verifyAccessToken(token);
    } catch (error) {
      throw new Error(`Invalid or expired token: ${error.message}`);
    }

    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Check if email is verified
    if (!payload.isEmailVerified) {
      throw new Error('Email is not verified');
    }

    // Check token in cache (same as AuthGuard)
    const cacheValue = await this.cacheService.get<string>(
      `access-token:${payload.jti}`,
    );

    if (!cacheValue) {
      throw new Error('Unauthorized User - Token not in cache');
    }

    if (cacheValue !== token) {
      throw new Error('Unauthorized User - Token mismatch');
    }

    
    return { ...payload, _id: payload.sub };
  }
}

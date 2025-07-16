import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from 'src/auth/resolvers/auth.resolver';
import { TokenService } from '../services/token.service';
import { CacheService } from '../services/cache.service';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<GqlContext>().req;
    const token = request.headers['authorization']?.split(' ')[1];
    // const token = request.headers['authorization'];

    if (!token) throw new UnauthorizedException('Token is Missing');
    const payload = this.tokenService.verifyAccessToken(token);
    if (!payload) throw new UnauthorizedException('Invalid Token');

    if (!payload.isEmailVerified)
      throw new ForbiddenError('Email is not verified');

    const cacheValue = await this.cacheService.get<string>(
      `access-token:${payload.jti}`,
    );

    if (!cacheValue) throw new UnauthorizedException('Unauthorized User');

    if (cacheValue !== token)
      throw new UnauthorizedException('Unauthorized User');
    request.user = { ...payload, _id: payload.sub };
    return true;
  }
}

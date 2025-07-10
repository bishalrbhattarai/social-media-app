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
    console.log(token);
    if (!token) throw new UnauthorizedException('Token is Missing');
    const payload = this.tokenService.verifyAccessToken(token);
    console.log(`Inside the AuthGuard`);
    console.log(payload);
    if (!payload) throw new UnauthorizedException('Invalid Token');
    const cacheValue = await this.cacheService.get<string>(
      `access-token:${payload.jti}`,
    );
    console.log(`access-token:${payload.jti}`);

    if (!cacheValue) throw new UnauthorizedException('Unauthorized User yo chai value na huda');
    if (cacheValue !== token)
      throw new UnauthorizedException('Unauthorized User yo chai cache value == token check gareko');
    request.user = { ...payload, _id: payload.sub };
    console.log(request.user);
    return true;
  }
}

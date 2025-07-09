import { Global, Module, OnModuleInit } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule implements OnModuleInit {
  onModuleInit() {
    console.log('RedisCacheModule initialized with Redis store');
  }
}

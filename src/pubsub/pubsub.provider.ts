import { Provider } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

// You can configure Redis options from env later
const redisOptions: Redis.RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
};

export const PUB_SUB = 'PUB_SUB'; // injection token

export const PubSubProvider: Provider = {
  provide: PUB_SUB,
  useFactory: () => {
    return new RedisPubSub({
      publisher: new Redis(redisOptions),
      subscriber: new Redis(redisOptions),
    });
  },
};

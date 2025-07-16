import { Provider } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

const redisOptions: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
};

export const PUB_SUB = 'PUB_SUB'; 

export const PubSubProvider: Provider = {
  provide: PUB_SUB,
  useFactory: () => {
    return new RedisPubSub({
      publisher: new Redis(redisOptions),
      subscriber: new Redis(redisOptions),
    });
  },
};

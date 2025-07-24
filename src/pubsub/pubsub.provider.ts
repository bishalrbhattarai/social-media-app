import { Provider } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

const HOST = '127.0.0.1';
const PORT = 6379;

const redisOptions: RedisOptions = {
  host: HOST,
  port: PORT,
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

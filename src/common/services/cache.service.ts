import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setAccessAndRefreshTokens(
    accessJti: string,
    refreshJti: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    await this.cacheManager.set(
      `access-token:${accessJti}`,
      accessToken,
      15 * 60 * 1000,
    );

    await this.cacheManager.set(
      `refresh-token:${refreshJti}`,
      refreshToken,
      7 * 24 * 60 * 60 * 1000,
    );
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      console.log(`Cache SET: ${key}`);
    } catch (error) {
      console.error(`Failed to set cache for key: ${key}`, error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const result = await this.cacheManager.get<T>(key);
      console.log(`Cache GET: ${key}`);
      return result;
    } catch (error) {
      console.error(`Failed to get cache for key: ${key}`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      console.log(`Cache DEL: ${key}`);
    } catch (error) {
      console.error(`Failed to delete cache key: ${key}`, error);
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
//import type { RedisClientType } from 'redis';

export type RedisClientConnection = ReturnType<typeof createClient>;

@Injectable()
export class RedisService {
  client: RedisClientConnection;
  constructor() {
    try {
      this.client = createClient()
          .on('connect', () => {console.log('Successfully connected to redis')})
          .on('error', (err) => {console.error('Error connecting to redis', err)});
      this.client.connect();
    } catch(err) {
      console.log(err);
    }
  }

  async getKey(key: string): Promise<string | null> {
    if(!key) return null;
    let data: string = null;
    try {
      data = await this.client.get(key);
    } catch (error) {
      console.log(error);
    }
    return data;
  }

  async setKey(key: string, data: string, ttl: number = 0): Promise<boolean> {
    try {
      await this.client.set(key, data);
      if (ttl === 0) {
        // default to one day expiry
        this.client.expire(key, 3600 * 24);
      } else {
        this.client.expire(key, ttl);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [AuthService, RedisService],
  controllers: [AuthController],
})
export class AuthModule {}

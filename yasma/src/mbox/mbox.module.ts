import { Module } from '@nestjs/common';
import { MboxService } from './mbox.service';
import { AuthService } from '../auth/auth.service';
import { MboxController } from './mbox.controller';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [AuthModule, RedisModule],
  providers: [MboxService, AuthService, RedisService],
  controllers: [MboxController],
})
export class MboxModule {}

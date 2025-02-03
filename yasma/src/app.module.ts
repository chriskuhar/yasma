import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { MboxModule } from './mbox/mbox.module';
import { MboxService } from './mbox/mbox.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [ConfigModule.forRoot(), MboxModule, AuthModule, RedisModule],
  controllers: [AppController],
  providers: [AppService, AuthService, MboxService, RedisService],
})
export class AppModule {}

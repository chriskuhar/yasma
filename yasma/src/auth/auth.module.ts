import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';
import { UserDbService } from '../mongo/userdb.service';
import { UserDbModule } from '../mongo/userdb.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDbSchema } from '../mongo/schemas/userdb.schema';

@Module({
  imports: [
    RedisModule,
    UserDbModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserDbSchema }]),
  ],
  providers: [AuthService, RedisService, UserDbService],
  controllers: [AuthController],
})
export class AuthModule {}

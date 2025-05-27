import { Module } from '@nestjs/common';
import { MboxService } from './mbox.service';
import { AuthService } from '../auth/auth.service';
import { MboxController } from './mbox.controller';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { UserDbService } from '../mongo/userdb.service';
import { UserDbModule } from '../mongo/userdb.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDbSchema } from '../mongo/schemas/userdb.schema';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    AuthModule,
    RedisModule,
    UserDbModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserDbSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [MboxService, AuthService, RedisService, UserDbService],
  controllers: [MboxController],
})
export class MboxModule {}

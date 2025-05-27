import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { MboxModule } from './mbox/mbox.module';
import { MboxService } from './mbox/mbox.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { UserDbModule } from './mongo/userdb.module';
import { UserDbService } from './mongo/userdb.service';
import { User, UserDbSchema } from './mongo/schemas/userdb.schema';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';

const mongoAdmin = process.env.MONGO_ADMIN ?? 'admin';
const mongoPassword = process.env.MONGO_PASSWORD ?? 'codecoffee99';
const mongoHostname = process.env.MONGO_HOSTNAME ?? 'localhost';
const mongoPort = process.env.MONGO_PORT ?? '27017';
const mongoDBName = process.env.MONGO_DB_NAME ?? 'yasma';
const mongoUrl = `mongodb://${mongoAdmin}:${mongoPassword}@${mongoHostname}:${mongoPort}/${mongoDBName}?authSource=admin`;
console.log(`XDEBUG mongoUrl = ${mongoUrl}`);

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    MongooseModule.forFeature([{ name: User.name, schema: UserDbSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    MboxModule,
    AuthModule,
    RedisModule,
    UserDbModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    MboxService,
    RedisService,
    UserDbService,
  ],
})
export class AppModule {}

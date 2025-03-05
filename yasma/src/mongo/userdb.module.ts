import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDbSchema } from './schemas/userdb.schema';

import { UserDbService } from './userdb.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserDbSchema }]),
  ],
  providers: [UserDbService],
})
export class UserDbModule {}

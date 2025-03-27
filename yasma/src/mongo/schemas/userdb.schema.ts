
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}

export const UserDbSchema = SchemaFactory.createForClass(User);

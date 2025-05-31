import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserSchema } from './schemas/userdb.schema';
import { Result } from '../types/result';
import { UserAuth } from '../types/auth';
import { User } from '../types/user';

@Injectable()
export class UserDbService {
  constructor(@InjectModel(UserSchema.name) private userModel: Model<User>) {}

  async create(createUser: User): Promise<Result> {
    let data: unknown = null;
    let errorMessage: string = '';
    try {
      const createdUser = new this.userModel(createUser);
      const createUserResult: UserAuth = await createdUser.save();
      const { email, firstName, lastName } = createUserResult;
      data = { email, firstName, lastName };
    } catch (error) {
      if (
        error?.errorResponse?.errmsg &&
        error?.errorResponse?.errmsg.includes('duplicate key error')
      ) {
        errorMessage = 'User already exists';
      } else {
        errorMessage =
          error?.errorResponse?.errmsg ?? 'Unknown error creating user';
      }
    }
    return { data, errorMessage };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Key: refresh key
  async putUserRefreshKey(email: string, token: string): Promise<unknown> {
    const result = false;
    try {
      const doc: unknown = await this.userModel
        .findOne({ email: email })
        .exec();
      if (doc) {
        // update doc
        //doc.refreshToken = token;
      } else {
        // create doc
        const userDoc: User = {
          email: email,
          refreshToken: token,
        };
        const createdUser = new this.userModel(userDoc);
        const createUserResult: UserAuth = await createdUser.save();
        //const { email, firstName, lastName } = createUserResult;
        console.log(createUserResult);
      }
      console.log(doc);
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  // get user
  async getUser(email: string): Promise<User> {
    let user: User | null = null;
    try {
      user = await this.userModel.findOne({ email: email }).exec();
    } catch (error) {
      console.log(error);
    }
    return user;
  }
  // get refresh token from email address
  async getRefreshTokenFromEmail(email: string): Promise<string> {
    let refreshToken: string = '';
    try {
      const user: User = await this.userModel.findOne({ email: email }).exec();
      if (user && user.refreshToken) {
        refreshToken = user.refreshToken;
      }
    } catch (error) {
      console.log(error);
    }
    return refreshToken;
  }
}

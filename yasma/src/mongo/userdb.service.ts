import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/userdb.schema';
import { CreateUserDbDto } from './dto/create-userdb.dto';
import { Result } from '../types/result';
import { UserAuth } from "../types/auth";

@Injectable()
export class UserDbService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDbDto): Promise<Result> {
    let data: unknown = null;
    let errorMessage: string = '';
    try {
      const createdUser = new this.userModel(createUserDto);
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
}

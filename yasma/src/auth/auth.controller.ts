import {BadRequestException, Body, Controller, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthI } from '../types/auth';
import { LoginDto, UserDto } from './auth.dto';
import { ApiResult } from '../types/apiResult';
import {Result} from "../types/result";

@Controller('/api')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
  ) {}

  @Post('/auth')
  async getAuth(
      @Body() loginDto: LoginDto,
  ): Promise<AuthI> {
    if (loginDto.email) {
      return await this.authService.getAuth(loginDto.email);
    } else {
      return new Promise<AuthI>((resolve) => {
        resolve({ error: 'Email Required' });
      });
    }
  }

  @Post('/auth/signup')
  async addUser(@Body() userDto: UserDto): Promise<ApiResult> {
    if (userDto.email && userDto.password) {
      const result: Result = await this.authService.addUser(userDto);
      if(result?.errorMessage) {
        throw new BadRequestException(result.errorMessage);
      }
      return { data: result.data };
    } else {
      throw new BadRequestException('Bad Request');
    }
  }
}

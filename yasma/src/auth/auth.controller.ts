import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthI } from '../types/auth';
import { LoginDto } from "./auth.dto";

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
}

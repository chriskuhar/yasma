import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthI } from '../types/auth';

@Controller('/api')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
  ) {}

  @Post('/auth')
  async getAuth(): Promise<AuthI> {
    return await this.authService.getAuth();
  }
}

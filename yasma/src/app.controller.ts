import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller('/api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/testRedisKey')
  async getTestRedisKey(
    @Req() req: Request,
  ): Promise<string> {
    if(req?.headers['authorization']) {
      const authHeader: string = req.headers['authorization'];
      const bits: string[] = authHeader.split(' ');
      let token: string | null = null;
      if (bits.length > 1) {
        token = bits[1];
      }
      return JSON.parse(await this.authService.testRedisKey(token));
    }
    return JSON.stringify({ error: 'Error in finding key value' });
  }
}

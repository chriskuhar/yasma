import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req, UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthI } from '../types/auth';
import {
  LoginDto,
  UserDto,
  GoogleAuthRedirectDto,
  ValidateCodeDto,
} from './auth.dto';
import { ApiResult } from '../types/apiResult';
import { Result } from '../types/result';
import { JwtService } from '@nestjs/jwt';

@Controller('/api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/auth')
  async getAuth(@Body() loginDto: LoginDto): Promise<AuthI> {
    if (loginDto.email) {
      return await this.authService.getAuth(loginDto.email);
    } else {
      return new Promise<AuthI>((resolve) => {
        resolve({ error: 'Email Required' });
      });
    }
  }

  @Post('/auth/google-redirect')
  async getGoogleAuthRedirect(
    @Body() googleAuthRedirectDto: GoogleAuthRedirectDto,
  ): Promise<AuthI> {
    if (googleAuthRedirectDto.email && googleAuthRedirectDto.url) {
      return await this.authService.authenticateFromGoogleRedirect(
        googleAuthRedirectDto.email,
        googleAuthRedirectDto.url,
      );
    } else {
      return new Promise<AuthI>((resolve) => {
        resolve({ error: 'Email Required' });
      });
    }
  }
  @Post('/auth/signup')
  async addUser(@Body() userDto: UserDto): Promise<ApiResult> {
    if (userDto.email && userDto.password) {
      const result: Result = await this.authService.addUser({ ...userDto });
      if(result?.errorMessage) {
        throw new BadRequestException(result.errorMessage);
      }
      return { data: result.data };
    } else {
      throw new BadRequestException('Bad Request');
    }
  }

  // authenticate user locally
  // return google API redirect URL and JWT containing users email
  @Post('/google-auth')
  async getGoogleAuth(@Body() loginDto: LoginDto): Promise<AuthI> {
    if (loginDto.email && loginDto.password) {
      // validate the email...
      if (!this.authService.checkLocalAuth(loginDto.email, loginDto.password)) {
        throw new UnauthorizedException();
      }
      const url = await this.authService.getGoogleAuthURL();
      const token = this.jwtService.sign(
        { email: loginDto.email },
        { expiresIn: '12h', secret: process.env.JWT_SECRET },
      );
      return { data: { url, token } };
    } else {
      throw new BadRequestException('Bad Request');
    }
  }

  @Post('/google-validate-code')
  async postGoogleCodeAuth(
    @Body() loginDto: ValidateCodeDto,
    @Req() req: Request,
  ): Promise<{ data: string } | AuthI> {
    if (loginDto.code) {
      const email = req['userContext']['email'];
      const uuid = await this.authService.authenticateCode(
        loginDto.code,
        email,
      );
      const token = this.jwtService.sign(
        { email: email, uuid: uuid },
        { expiresIn: '12h', secret: process.env.JWT_SECRET },
      );
      return { data: { token } };
    } else {
      return new Promise<AuthI>((resolve) => {
        resolve({ error: 'Email Required' });
      });
    }
  }
}

// jwt.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  jwtService: JwtService = new JwtService();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    // Example of extracting a value from token manually (in real use, use a service like JwtService)
    if (token) {
      // Save token or parsed values to request
      const tokenDecoded = this.jwtService.decode(token);
      const uuid = tokenDecoded.uuid;
      const email = tokenDecoded.email;
      request.userContext = {
        jwt: token,
        uuid: uuid,
        email: email,
      };
    }

    return next.handle();
  }
}

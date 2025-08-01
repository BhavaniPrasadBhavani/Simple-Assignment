import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueryJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Get token from query parameter
    const token = request.query.token;
    
    if (!token) {
      console.log('No token in query parameter');
      return false;
    }

    try {
      // Verify the token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      // Attach user info to request
      request.user = payload;
      console.log('Token verified for user:', payload.sub);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return false;
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  getHealth() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'AI Component Generator API',
      cors: 'enabled'
    };
  }

  @Public()
  @Get('cors-test')
  corsTest() {
    return {
      message: 'CORS is working!',
      timestamp: new Date().toISOString(),
      allowedOrigins: [
        'https://simple-assignment-kappa.vercel.app',
        'https://simple-assignment-crooffv89.vercel.app',
        'http://localhost:3000'
      ]
    };
  }
}

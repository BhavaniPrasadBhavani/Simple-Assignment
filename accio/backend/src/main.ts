import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// Polyfill for crypto if not available
if (!globalThis.crypto) {
  globalThis.crypto = require('crypto').webcrypto || require('crypto');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL', 'http://localhost:3000'),
      'http://localhost:3000',
      // Your actual Vercel domain
      'https://simple-assignment-kappa.vercel.app',
      // Your old domain (in case it's still needed)
      'https://simple-assignment-crooffv89.vercel.app',
      // Allow any vercel app subdomain for future deployments
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/simple-assignment.*\.vercel\.app$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    optionsSuccessStatus: 200, // For legacy browser support
  });

  // Log CORS configuration for debugging
  console.log('🌐 CORS enabled for origins:', [
    'https://simple-assignment-kappa.vercel.app',
    'http://localhost:3000'
  ]);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = configService.get('PORT', 3001);
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📡 API endpoints available at: http://localhost:${port}/api`);
  console.log(`🌐 CORS enabled for Vercel domain: https://simple-assignment-kappa.vercel.app`);
}
bootstrap();

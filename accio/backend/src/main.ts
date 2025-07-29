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
  
  // Enable CORS with explicit configuration
  app.enableCors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3000',
        'https://simple-assignment-kappa.vercel.app',
        'https://simple-assignment-crooffv89.vercel.app',
      ];
      
      // Check if the origin is in the allowed list or matches vercel pattern
      if (allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        console.log('❌ CORS rejected origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'Origin', 
      'X-Requested-With',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 200, // For legacy browser support
    preflightContinue: false,
  });

  // Log CORS configuration for debugging
  console.log('🌐 CORS enabled for origins:', [
    'https://simple-assignment-kappa.vercel.app',
    'http://localhost:3000'
  ]);

  // Add request logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
    if (req.method === 'OPTIONS') {
      console.log('🔄 Preflight request detected');
    }
    next();
  });

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

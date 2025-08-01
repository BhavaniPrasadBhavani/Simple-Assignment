import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
  Res,
  BadRequestException,
  SetMetadata,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'ai' };
  }

  @Get('stream/:sessionId')
  async streamComponent(
    @Param('sessionId') sessionId: string,
    @Query('prompt') prompt: string,
    @Query('token') token: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    if (!prompt) {
      throw new BadRequestException('Prompt is required');
    }

    if (!token) {
      console.log('No token provided in query parameter');
      throw new BadRequestException('Authentication token is required');
    }

    console.log('Token received, attempting verification...');

    // Verify the JWT token manually since EventSource can't send headers
    let userId: string;
    try {
      const decoded = this.jwtService.verify(token);
      userId = decoded.sub;
      console.log('Token verified successfully for user:', userId);
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ error: 'Invalid authentication token' });
      return;
    }

    try {
      const stream = await this.aiService.streamComponentGeneration(
        sessionId,
        userId,
        prompt,
      );

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error('Streaming error:', error);
      res.status(500).json({ error: 'Streaming failed' });
    }
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateComponent(
    @Body() body: { sessionId: string; prompt: string },
    @Request() req: any,
  ) {
    const { sessionId, prompt } = body;
    const userId = req.user.sub;

    if (!prompt) {
      throw new BadRequestException('Prompt is required');
    }

    try {
      const stream = await this.aiService.streamComponentGeneration(
        sessionId,
        userId,
        prompt,
      );

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
      }

      const extractedCode = this.aiService.extractCodeFromResponse(fullResponse);
      
      return {
        response: fullResponse,
        tsx: extractedCode.tsx,
        css: extractedCode.css,
      };
    } catch (error) {
      console.error('Generation error:', error);
      throw new BadRequestException('Failed to generate component');
    }
  }
}

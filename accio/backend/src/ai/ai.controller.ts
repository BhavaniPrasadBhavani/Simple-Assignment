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
}

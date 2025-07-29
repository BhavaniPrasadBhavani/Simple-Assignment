import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Request() req, @Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(req.user.id, createSessionDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.sessionsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.sessionsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
    @Request() req,
  ) {
    return this.sessionsService.update(id, req.user.id, updateSessionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.sessionsService.remove(id, req.user.id);
    return { message: 'Session deleted successfully' };
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const zipBuffer = await this.sessionsService.generateDownload(id, req.user.id);
    
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="component-${id}.zip"`,
      'Content-Length': zipBuffer.length,
    });
    
    res.send(zipBuffer);
  }
}

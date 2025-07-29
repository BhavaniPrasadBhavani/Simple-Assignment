import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import * as JSZip from 'jszip';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async create(userId: string, createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create({
      user_id: userId,
      name: createSessionDto.name || 'New Session',
      chat_history: [],
      generated_code: { tsx: '', css: '' },
    });

    return this.sessionRepository.save(session);
  }

  async findAllByUser(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { user_id: userId },
      select: ['id', 'name', 'created_at', 'updated_at'],
      order: { updated_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async update(id: string, userId: string, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const session = await this.findOne(id, userId);

    // Update fields
    if (updateSessionDto.name !== undefined) {
      session.name = updateSessionDto.name;
    }
    if (updateSessionDto.chat_history !== undefined) {
      session.chat_history = updateSessionDto.chat_history;
    }
    if (updateSessionDto.generated_code !== undefined) {
      session.generated_code = updateSessionDto.generated_code;
    }
    if (updateSessionDto.ui_editor_state !== undefined) {
      session.ui_editor_state = updateSessionDto.ui_editor_state;
    }

    return this.sessionRepository.save(session);
  }

  async remove(id: string, userId: string): Promise<void> {
    const session = await this.findOne(id, userId);
    await this.sessionRepository.remove(session);
  }

  async generateDownload(id: string, userId: string): Promise<Buffer> {
    const session = await this.findOne(id, userId);
    
    const zip = new JSZip();
    
    // Add component file
    if (session.generated_code.tsx) {
      zip.file('component.tsx', session.generated_code.tsx);
    }
    
    // Add styles file
    if (session.generated_code.css) {
      zip.file('styles.css', session.generated_code.css);
    }
    
    // Add README with session info
    const readme = `# Generated Component - ${session.name}

Generated on: ${session.updated_at.toISOString()}

## Files
- component.tsx: React component code
- styles.css: Component styles

## Usage
Import the component and styles in your React application.
`;
    
    zip.file('README.md', readme);
    
    return zip.generateAsync({ type: 'nodebuffer' });
  }
}

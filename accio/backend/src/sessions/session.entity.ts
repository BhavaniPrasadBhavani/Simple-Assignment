import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface GeneratedCode {
  tsx: string;
  css: string;
}

export interface UIEditorState {
  selectedElement?: string;
  props?: Record<string, any>;
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ length: 255, default: 'New Session' })
  name: string;

  @Column({ type: 'jsonb', default: [] })
  chat_history: ChatMessage[];

  @Column({ type: 'jsonb', default: { tsx: '', css: '' } })
  generated_code: GeneratedCode;

  @Column({ type: 'jsonb', nullable: true })
  ui_editor_state: UIEditorState | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

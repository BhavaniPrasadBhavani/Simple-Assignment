import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ChatMessage, GeneratedCode, UIEditorState } from '../session.entity';

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  chat_history?: ChatMessage[];

  @IsOptional()
  @IsObject()
  generated_code?: GeneratedCode;

  @IsOptional()
  @IsObject()
  ui_editor_state?: UIEditorState;
}

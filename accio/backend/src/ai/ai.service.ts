import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { SessionsService } from '../sessions/sessions.service';
import { ChatMessage } from '../sessions/session.entity';

@Injectable()
export class AiService {
  constructor(
    private configService: ConfigService,
    private sessionsService: SessionsService,
  ) {}

  async streamComponentGeneration(
    sessionId: string,
    userId: string,
    prompt: string,
  ) {
    const session = await this.sessionsService.findOne(sessionId, userId);

    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert React component generator that creates live, interactive components. Generate clean, modern React components optimized for live preview.

Guidelines:
1. Always return both TSX and CSS code
2. Use functional components with React hooks (useState, useEffect, etc.)
3. Create interactive components with real functionality (buttons that work, forms that validate, etc.)
4. Include proper TypeScript types
5. Use semantic HTML elements with good accessibility
6. Create responsive, visually appealing designs
7. Use simple, clean CSS without external dependencies
8. Make components self-contained and interactive
9. Add hover effects, animations, and state changes
10. Use standard HTML attributes and events for maximum compatibility

IMPORTANT: Create functional, interactive components that will work in a live preview environment. Keep JSX simple and avoid complex nested expressions.

Format your response as:
\`\`\`tsx
import React, { useState } from 'react';

const ComponentName: React.FC = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div className="component-container">
      <h2>Component Title</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Click me!</button>
    </div>
  );
};

export default ComponentName;
\`\`\`

\`\`\`css
.component-container {
  padding: 2rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.component-container:hover {
  transform: translateY(-5px);
}

.component-container h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.component-container button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.component-container button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}
\`\`\`

Focus on creating components that are both visually impressive and functionally interactive for the best live preview experience. Keep the JSX structure simple and readable.`,
      },
      ...session.chat_history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: prompt,
      },
    ];

    const apiKey = this.configService.get<string>('LLM_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('LLM API key not configured');
    }

    // Create OpenRouter client
    const openrouter = createOpenAI({
      apiKey: apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });

    // Stream response from OpenRouter's Mixtral model
    const result = await streamText({
      model: openrouter('mistralai/mixtral-8x7b-instruct'),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    return result.textStream;
  }

  extractCodeFromResponse(response: string): { tsx: string; css: string } {
    const tsxMatch = response.match(/```tsx\n([\s\S]*?)\n```/);
    const cssMatch = response.match(/```css\n([\s\S]*?)\n```/);

    return {
      tsx: tsxMatch ? tsxMatch[1].trim() : '',
      css: cssMatch ? cssMatch[1].trim() : '',
    };
  }
}

# GitHub Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is an AI-driven component generator with a NestJS backend and Next.js frontend. The application allows users to:
- Generate React components through conversational AI
- Preview components in a secure sandboxed environment
- Edit and refine components iteratively
- Save sessions with persistent state

## Architecture Guidelines
- **Backend**: NestJS with TypeScript, PostgreSQL, Redis
- **Frontend**: Next.js with TypeScript, Tailwind CSS, Zustand for state management
- **Security**: JWT authentication, sandboxed component rendering
- **Real-time**: Server-Sent Events for streaming AI responses

## Coding Standards
- Use TypeScript strict mode
- Follow functional programming patterns where possible
- Implement proper error handling and validation
- Use modular architecture with clear separation of concerns
- Prioritize security, especially for user-generated content
- Implement comprehensive logging and monitoring

## Database Schema
- Users table with UUID primary keys
- Sessions table with JSONB for flexible data storage
- Foreign key relationships with CASCADE delete

## State Management
- Zustand for global application state
- React Context for component-scoped state injection
- Proper separation between UI state and business logic

## Security Considerations
- All sensitive routes protected with JWT guards
- Component rendering in sandboxed iframes
- Input validation and sanitization
- CORS configuration for cross-origin requests

# AI Component Generator

A comprehensive AI-driven component generator that allows developers to create React components through natural conversation. Built with NestJS backend, Next.js frontend, and integrated with OpenAI for intelligent code generation.

## 🏗️ Architecture Overview

### Frontend (Next.js 15.4.4)
- **Framework**: Next.js with App Router and TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Real-time Communication**: Server-Sent Events (SSE)
- **Component Preview**: Sandboxed iframe rendering
- **Authentication**: JWT token-based with protected routes

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport strategies
- **AI Integration**: OpenAI SDK with streaming
- **Caching**: Redis (optional, for production)
- **File Handling**: JSZip for component downloads

### Database Schema
- **Users**: UUID, email, password (bcrypt hashed)
- **Sessions**: JSONB fields for chat history, generated code, and UI state
- **Relationships**: Foreign key constraints with cascade delete

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- OpenAI API key
- Redis (optional, for production caching)

### Environment Setup

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_components"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Server Configuration
PORT=3001
NODE_ENV="development"

# CORS (adjust for production)
CORS_ORIGIN="http://localhost:3000"

# Optional: Redis (for production caching)
REDIS_URL="redis://localhost:6379"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="AI Component Generator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb ai_components

   # Run database migrations (in backend directory)
   npm run migration:run
   ```

3. **Start Development Servers**
   ```bash
   # Start backend (in backend directory)
   npm run start:dev

   # Start frontend (in root directory)
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🔧 Development Workflow

### Project Structure
```
ai-component-generator/
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and store
│   └── types/            # TypeScript definitions
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── sessions/     # Session management
│   │   ├── ai/          # AI integration
│   │   └── users/       # User management
│   └── dist/            # Compiled output
└── docs/                # Documentation
```

### Key Features

#### 🤖 AI-Powered Generation
- Natural language component descriptions
- Real-time streaming responses
- Context-aware code generation
- TypeScript and Tailwind CSS support

#### 💬 Interactive Chat Interface
- Persistent conversation history
- Real-time message streaming
- Component preview updates
- Session management

#### 👁️ Live Component Preview
- Sandboxed iframe rendering
- Secure component execution
- Real-time preview updates
- Error boundary handling

#### 📝 Code Editor Integration
- Syntax highlighting
- Real-time editing
- Download as ZIP file
- TypeScript support

#### 🔐 Authentication & Security
- JWT-based authentication
- Protected routes
- Secure API endpoints
- Input validation and sanitization

## 🔨 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Sessions
- `GET /sessions` - List user sessions (protected)
- `POST /sessions` - Create new session (protected)
- `GET /sessions/:id` - Get session details (protected)
- `PUT /sessions/:id` - Update session (protected)
- `DELETE /sessions/:id` - Delete session (protected)

### AI Generation
- `POST /ai/stream-generate` - Stream component generation (protected)

## 🧪 Testing

### Frontend Testing
```bash
# Run Jest tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests (Playwright)
npm run test:e2e
```

### Backend Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

### Production Environment Variables

#### Backend
```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
OPENAI_API_KEY="your-openai-api-key"
CORS_ORIGIN="https://your-frontend-domain.com"
REDIS_URL="your-redis-url"
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Deployment Options

#### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway/Heroku (Backend)
```bash
# Add buildpack (if using Heroku)
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main
```

#### Docker Deployment
```dockerfile
# Dockerfile example for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## 🎯 Performance Optimizations

### Frontend
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- Client-side caching with Zustand persistence
- Debounced API calls for real-time features

### Backend
- Database connection pooling
- Redis caching for frequent queries
- Streaming responses for AI generation
- Request rate limiting
- Compression middleware

## 🔍 Monitoring & Debugging

### Development Tools
- TypeScript strict mode
- ESLint and Prettier configuration
- Husky pre-commit hooks
- VS Code debugging configuration

### Production Monitoring
- Application performance monitoring (APM)
- Error tracking (Sentry integration ready)
- Database query optimization
- API response time monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for the GPT API
- NestJS and Next.js teams for excellent frameworks
- TypeORM for database abstraction
- Tailwind CSS for styling utilities

## 📞 Support

For support, email support@yourcompany.com or join our Discord community.

---

Built with ❤️ by [Your Name/Company]

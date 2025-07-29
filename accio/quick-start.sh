#!/bin/bash

# Quick Start Script for AI Component Generator
echo "🚀 AI Component Generator - Quick Start"
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   Download from: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all
echo "✅ Dependencies installed!"
echo ""

# Check for environment files
if [ ! -f ".env.local" ]; then
    echo "⚠️  Frontend .env.local not found. Please create it with:"
    echo "   NEXT_PUBLIC_API_URL=http://localhost:3001"
    echo ""
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env not found. Please create backend/.env with:"
    echo "   DATABASE_URL=postgresql://username:password@localhost:5432/ai_components"
    echo "   JWT_SECRET=your-super-secret-jwt-key"
    echo "   OPENAI_API_KEY=your-openai-api-key"
    echo "   PORT=3001"
    echo "   CORS_ORIGIN=http://localhost:3000"
    echo ""
fi

# Database setup instructions
echo "🗄️  Database Setup Instructions:"
echo "   1. Create PostgreSQL database: createdb ai_components"
echo "   2. Update DATABASE_URL in backend/.env"
echo "   3. Run migrations: cd backend && npm run migration:run"
echo ""

# Start instructions
echo "🎯 To start the application:"
echo "   npm run dev:full    # Start both frontend and backend"
echo "   npm run dev         # Start frontend only"
echo "   npm run dev:backend # Start backend only"
echo ""

echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""

echo "📚 For detailed setup instructions, see README.md"
echo "🎉 Happy coding!"

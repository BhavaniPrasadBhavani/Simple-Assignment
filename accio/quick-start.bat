@echo off
echo 🚀 AI Component Generator - Quick Start
echo =======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL first.
    echo    Download from: https://www.postgresql.org/download/
    echo.
)

echo ✅ Prerequisites check passed!
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all
echo ✅ Dependencies installed!
echo.

REM Check for environment files
if not exist ".env.local" (
    echo ⚠️  Frontend .env.local not found. Please create it with:
    echo    NEXT_PUBLIC_API_URL=http://localhost:3001
    echo.
)

if not exist "backend\.env" (
    echo ⚠️  Backend .env not found. Please create backend\.env with:
    echo    DATABASE_URL=postgresql://username:password@localhost:5432/ai_components
    echo    JWT_SECRET=your-super-secret-jwt-key
    echo    OPENAI_API_KEY=your-openai-api-key
    echo    PORT=3001
    echo    CORS_ORIGIN=http://localhost:3000
    echo.
)

REM Database setup instructions
echo 🗄️  Database Setup Instructions:
echo    1. Create PostgreSQL database: createdb ai_components
echo    2. Update DATABASE_URL in backend\.env
echo    3. Run migrations: cd backend && npm run migration:run
echo.

REM Start instructions
echo 🎯 To start the application:
echo    npm run dev:full    # Start both frontend and backend
echo    npm run dev         # Start frontend only
echo    npm run dev:backend # Start backend only
echo.

echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.

echo 📚 For detailed setup instructions, see README.md
echo 🎉 Happy coding!
pause

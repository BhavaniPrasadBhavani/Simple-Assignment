@echo off
echo 🚀 Accio Deployment Script - Neon + Vercel
echo ==========================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project root directory.
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo 🔍 Running build test...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🌐 Ready for deployment to Vercel!
    echo.
    echo 📋 Pre-deployment checklist:
    echo   ✅ Neon database is set up and accessible
    echo   ✅ Environment variables are ready (.env.local)
    echo   ✅ Code is pushed to GitHub (recommended)
    echo.
    echo 🚀 Deploy to Vercel:
    echo   Option 1 - Via GitHub (Recommended):
    echo     1. Go to vercel.com
    echo     2. Import your GitHub repository
    echo     3. Add environment variables in Vercel dashboard
    echo     4. Deploy!
    echo.
    echo   Option 2 - Via CLI:
    echo     1. Run: npm install -g vercel
    echo     2. Run: vercel login
    echo     3. Run: vercel
    echo     4. Add environment variables: vercel env add
    echo.
    echo 📝 Don't forget to add these environment variables in Vercel:
    echo   - DATABASE_URL (your Neon connection string)
    echo   - JWT_SECRET
    echo   - OPENAI_API_KEY (if using AI features)
    echo   - NEXTAUTH_SECRET (if using authentication)
    echo.
    echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
) else (
    echo ❌ Build failed. Please fix the errors before deploying.
    exit /b 1
)

#!/bin/bash

echo "🚀 Accio Deployment Script"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Running build test..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Ready for deployment!"
    echo ""
    echo "For Vercel:"
    echo "  1. Run: npm install -g vercel"
    echo "  2. Run: vercel login"
    echo "  3. Run: vercel"
    echo ""
    echo "For Netlify:"
    echo "  1. Run: npm install -g netlify-cli"
    echo "  2. Run: netlify login"
    echo "  3. Run: netlify deploy"
    echo ""
    echo "📝 Don't forget to:"
    echo "  - Set up environment variables"
    echo "  - Deploy your backend separately"
    echo "  - Update API endpoints in your config"
else
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

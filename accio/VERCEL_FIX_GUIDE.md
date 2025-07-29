# 🚨 VERCEL DEPLOYMENT FIX GUIDE

## Problem
Your app is failing on login/registration because:
1. The frontend is trying to connect to `localhost:3001` (your local backend)
2. The backend is not deployed anywhere
3. Environment variables are not set in Vercel

## SOLUTION - Step by Step Fix

### Step 1: Deploy Your Backend First

You need to deploy your NestJS backend. Choose one of these free options:

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" > "Deploy from GitHub repo"
4. Select your repository
5. Choose the `backend` folder
6. Add environment variables in Railway:
   - `DATABASE_URL` = your Neon database URL
   - `JWT_SECRET` = a secure random string (32+ characters)
   - `OPENAI_API_KEY` = your OpenAI API key
7. Deploy and copy the generated URL (e.g., `https://backend-production-xxxx.up.railway.app`)

#### Option B: Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub
3. Create a new "Web Service"
4. Select your repository, set root directory to `backend`
5. Add the same environment variables
6. Deploy and copy the URL

### Step 2: Update Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add these variables:

```
NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app/api
DATABASE_URL = your_neon_database_connection_string
JWT_SECRET = your_secure_jwt_secret
OPENAI_API_KEY = your_openai_api_key
```

**CRITICAL**: Replace `https://your-backend-url.railway.app/api` with your actual deployed backend URL + `/api`

### Step 3: Redeploy Your Frontend

After adding environment variables:
1. Go to Vercel Deployments tab
2. Click "Redeploy" on your latest deployment
3. Wait for the new deployment to complete

### Step 4: Test

1. Visit your Vercel app URL
2. Try creating a new account
3. Try logging in

## Quick Fix for Testing (Temporary)

If you want to test immediately without deploying backend:

1. In Vercel environment variables, set:
   ```
   NEXT_PUBLIC_API_URL = https://jsonplaceholder.typicode.com
   ```
2. This will show the error more clearly

## Environment Variables You Need

### For Vercel (Frontend):
- `NEXT_PUBLIC_API_URL` - Your deployed backend URL + /api
- `OPENAI_API_KEY` - Your OpenAI API key (if using AI features)

### For Railway/Render (Backend):
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `JWT_SECRET` - A secure random string (32+ characters)
- `OPENAI_API_KEY` - Your OpenAI API key
- `PORT` - Usually set automatically by the platform

## Common Issues:

1. **CORS Error**: Add your Vercel domain to backend CORS settings
2. **Database Connection**: Make sure your Neon database allows connections
3. **API Key**: Verify your OpenAI API key is valid and has credits

Need help with any of these steps? Let me know!

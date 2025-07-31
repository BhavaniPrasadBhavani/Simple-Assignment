@echo off
echo Testing Railway Backend Auth Endpoints
echo ========================================
echo.
echo Make sure you have set these Railway environment variables:
echo - DATABASE_URL=postgresql://neondb_owner:npg_wx1UKS4GJRVH@ep-twilight-sunset-a1n5tx08-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require^&channel_binding=require
echo - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
echo - JWT_EXPIRES_IN=24h
echo - NODE_ENV=production
echo - PORT=3001
echo.
echo ========================================
echo.

echo 1. Testing Health Endpoint...
curl -X GET "https://simple-assignment-production.up.railway.app/api/health" -H "Accept: application/json"
echo.
echo.

echo 2. Testing User Registration...
curl -X POST "https://simple-assignment-production.up.railway.app/api/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo 3. Testing User Login...
curl -X POST "https://simple-assignment-production.up.railway.app/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo ========================================
echo Tests completed!
echo If you see 502 errors, check Railway logs and environment variables.
pause

#!/usr/bin/env node

/**
 * Test script for Railway backend authentication endpoints
 * Run this after setting up environment variables in Railway
 */

const BASE_URL = 'https://simple-assignment-production.up.railway.app/api';

async function testEndpoint(method, endpoint, data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`\n🔥 Testing ${method} ${endpoint}`);
    console.log(`URL: ${url}`);
    if (data) console.log(`Data:`, JSON.stringify(data, null, 2));

    const response = await fetch(url, options);
    const result = await response.text();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response:`, result);
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return { error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing Railway Backend Endpoints\n');
  console.log('Make sure you have set these Railway environment variables:');
  console.log('- DATABASE_URL');
  console.log('- JWT_SECRET');
  console.log('- JWT_EXPIRES_IN');
  console.log('- NODE_ENV=production');
  console.log('- PORT=3001');
  console.log('\n' + '='.repeat(50));

  // Test 1: Health check
  await testEndpoint('GET', '/health');

  // Test 2: Register new user
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };
  
  await testEndpoint('POST', '/auth/register', testUser);

  // Test 3: Login with the same user
  await testEndpoint('POST', '/auth/login', testUser);

  console.log('\n' + '='.repeat(50));
  console.log('✅ Tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch');
  console.log('Alternative: Use curl commands instead');
  process.exit(1);
}

runTests().catch(console.error);

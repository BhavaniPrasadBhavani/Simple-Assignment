// Debug script to test backend connectivity
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testConnection() {
  console.log('🔍 Testing backend connectivity...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   Backend is not running on port 3001');
      return;
    }
  }

  // Test 2: CORS preflight
  try {
    console.log('\n2. Testing CORS configuration...');
    const corsResponse = await axios.options(`${API_BASE_URL}/health`);
    console.log('✅ CORS check passed');
  } catch (error) {
    console.log('⚠️  CORS preflight failed:', error.message);
  }

  // Test 3: SSE endpoint accessibility
  try {
    console.log('\n3. Testing SSE endpoint accessibility...');
    const sseResponse = await axios.get(`${API_BASE_URL}/ai/stream/test-session`, {
      params: { prompt: 'test', token: 'invalid-token' },
      timeout: 5000,
      validateStatus: () => true // Accept any status code
    });
    
    if (sseResponse.status === 400) {
      console.log('✅ SSE endpoint is reachable (returns expected 400 for invalid token)');
    } else {
      console.log('⚠️  SSE endpoint returned unexpected status:', sseResponse.status);
    }
  } catch (error) {
    console.log('❌ SSE endpoint test failed:', error.message);
  }

  console.log('\n🔍 Diagnosis complete!');
  console.log('\nNext steps:');
  console.log('1. Ensure backend is running: cd backend && npm run start:dev');
  console.log('2. Ensure frontend is running: npm run dev');
  console.log('3. Check browser console for detailed error messages');
  console.log('4. Verify you are logged in with a valid token');
}

testConnection().catch(console.error);

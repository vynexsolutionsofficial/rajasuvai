import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';
const TEST_EMAIL = `rajasuvai_test_${Date.now()}@gmail.com`; // More realistic domain
const TEST_PASSWORD = 'Password123!';

async function testAuth() {
  console.log('--- Testing Backend Authentication ---');

  // 1. Register
  console.log('1. Registering new user...');
  const regRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: TEST_EMAIL, 
      password: TEST_PASSWORD,
      phone: '1234567890',
      address: '123 Spice Lane'
    })
  });
  const regData = await regRes.json();
  console.log('Register Response:', regData);

  // 2. Login
  console.log('\n2. Logging in...');
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('Login Response:', loginData.message);

  // 3. Test Protected Admin Route (Expect 403 because role is 'customer' by default)
  console.log('\n3. Accessing Admin Stats (Expecting 403 Forbidden)...');
  const adminRes = await fetch(`${API_URL}/admin/stats`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const adminData = await adminRes.json();
  console.log('Admin Response:', adminRes.status, adminData);

  console.log('\n--- Auth Test Completed ---');
}

testAuth();

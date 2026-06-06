const http = require('http');

const API_BASE = 'http://localhost:5000/api/v1/auth';
const email = `testuser_${Date.now()}@example.com`;
const password = 'Password@123';

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody) });
        } catch {
          resolve({ status: res.statusCode, data: resBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- Auth API Tests ---');
  let accessToken, refreshToken;

  try {
    // 1. Register
    console.log('\n[1] Register API...');
    const registerRes = await request('POST', '/register', {
      firstName: 'Test',
      lastName: 'User',
      email: email,
      password: password,
      confirmPassword: password
    });
    console.log('Status:', registerRes.status);
    if (registerRes.status === 201 && registerRes.data.success) {
      console.log('Register SUCCESS');
    } else {
      console.log('Register FAILED', registerRes.data);
      return;
    }

    // 2. Login
    console.log('\n[2] Login API...');
    const loginRes = await request('POST', '/login', {
      email: email,
      password: password
    });
    console.log('Status:', loginRes.status);
    if (loginRes.status === 200 && loginRes.data.success) {
      console.log('Login SUCCESS');
      accessToken = loginRes.data.data.accessToken;
      refreshToken = loginRes.data.data.refreshToken;
    } else {
      console.log('Login FAILED', loginRes.data);
      return;
    }

    // 3. Me (Get Current User)
    console.log('\n[3] Get Current User API...');
    const meRes = await request('GET', '/me', null, accessToken);
    console.log('Status:', meRes.status);
    if (meRes.status === 200 && meRes.data.success && meRes.data.data.user.email === email) {
      console.log('Get Current User SUCCESS');
    } else {
      console.log('Get Current User FAILED', meRes.data);
      return;
    }

    // 4. Refresh Token
    console.log('\n[4] Refresh Token API...');
    const refreshRes = await request('POST', '/refresh', { refreshToken });
    console.log('Status:', refreshRes.status);
    if (refreshRes.status === 200 && refreshRes.data.success) {
      console.log('Refresh Token SUCCESS');
      accessToken = refreshRes.data.data.accessToken;
      refreshToken = refreshRes.data.data.refreshToken;
    } else {
      console.log('Refresh Token FAILED', refreshRes.data);
      return;
    }

    // 5. Logout
    console.log('\n[5] Logout API...');
    const logoutRes = await request('POST', '/logout', { refreshToken }, accessToken);
    console.log('Status:', logoutRes.status);
    if (logoutRes.status === 200 && logoutRes.data.success) {
      console.log('Logout SUCCESS');
    } else {
      console.log('Logout FAILED', logoutRes.data);
      return;
    }

    console.log('\n✅ All tests passed successfully!');

  } catch (err) {
    console.error('Test script error:', err);
  }
}

runTests();

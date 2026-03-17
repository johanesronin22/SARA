import axios from 'axios';
import fs from 'fs';

async function verifyAuth() {
    const baseURL = 'http://localhost:3001/api/auth';
    const testUser = {
        name: 'Backend Verifier',
        email: `test_${Date.now()}@sara.com`,
        password: 'SecurePassword123!'
    };

    try {
        console.log('1. Attempting Signup...');
        const signupRes = await axios.post(`${baseURL}/signup`, testUser);
        console.log('   Signup Status:', signupRes.data.success ? 'SUCCESS' : 'FAILED');

        console.log('2. Attempting Login with same credentials...');
        const loginRes = await axios.post(`${baseURL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('   Login Status:', loginRes.data.success ? 'SUCCESS' : 'FAILED');
        console.log('   User returned:', loginRes.data.user.name);

        console.log('3. Attempting Login with WRONG password...');
        try {
            await axios.post(`${baseURL}/login`, {
                email: testUser.email,
                password: 'WrongPassword'
            });
            console.log('   Error: Login should have failed but succeeded.');
        } catch (e) {
            console.log('   Login correctly rejected with error:', e.response?.data?.error);
        }

        console.log('4. Checking database persistence...');
        const dbContent = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
        const userInDb = dbContent.users.find(u => u.email === testUser.email);
        if (userInDb) {
            console.log('   User found in users.json!');
            console.log('   Password hashed:', userInDb.password !== testUser.password ? 'YES' : 'NO');
        } else {
            console.log('   User NOT found in database file.');
        }

    } catch (err) {
        console.error('Test failed:', err.response?.data || err.message);
    }
}

verifyAuth();

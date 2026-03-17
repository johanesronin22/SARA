import axios from 'axios';

const test = async () => {
    try {
        console.log('--- Testing Signup ---');
        const signupRes = await axios.post('http://localhost:3001/api/auth/signup', {
            name: 'API Tester',
            email: 'api@test.com',
            password: 'Password123!'
        });
        console.log('Signup Result:', signupRes.data);

        console.log('\n--- Testing Login (Correct) ---');
        const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'api@test.com',
            password: 'Password123!'
        });
        console.log('Login Result:', loginRes.data);

        console.log('\n--- Testing Login (Incorrect Password) ---');
        try {
            await axios.post('http://localhost:3001/api/auth/login', {
                email: 'api@test.com',
                password: 'wrong'
            });
        } catch (e) {
            console.log('Login Error (Expected):', e.response?.data?.error || e.message);
        }

        console.log('\n--- Testing Duplicate Signup ---');
        try {
            await axios.post('http://localhost:3001/api/auth/signup', {
                name: 'API Tester',
                email: 'api@test.com',
                password: 'Password123!'
            });
        } catch (e) {
            console.log('Signup Error (Expected):', e.response?.data?.error || e.message);
        }

    } catch (err) {
        console.error('Test failed:', err.response?.data || err.message);
    }
};

test();

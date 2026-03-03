const axios = require('axios');

const test = async () => {
    try {
        console.log('Sending signup request...');
        const res = await axios.post('http://localhost:5000/api/auth/signup', {
            name: "Test User",
            email: `test${Date.now()}@example.com`,
            password: "password123",
            rollNumber: "ROLL123",
            department: "IT",
            phoneNumber: "1234567890"
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Failure:', err.message);
        if (err.response) console.error('Status:', err.response.status, 'Data:', err.response.data);
    }
};

test();

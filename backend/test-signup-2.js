const axios = require('axios');

const testSignup = async () => {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/signup', {
            name: "Test User " + Date.now(),
            email: "test" + Date.now() + "@example.com",
            password: "password123",
            rollNumber: "ROLL" + Date.now(),
            department: "CS",
            phoneNumber: "9876543210"
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error Status:', err.response?.status);
        console.error('Error Body:', err.response?.data);
    }
};

testSignup();

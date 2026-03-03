const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
let studentToken = '';
let adminToken = '';
let studentId = '';
let applicationId = '';
let routeId = '';

const log = (step, data) => {
    console.log(`\n--- [${step}] ---`);
    if (data) console.log(data);
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const runTests = async () => {
    try {
        // 1. ADMIN LOGIN
        log('Admin Login');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@gmail.com',
            password: 'admin123'
        });
        adminToken = adminLogin.data.token;
        log('Admin Login Success');

        await delay(1000);

        // 2. CREATE ROUTE (Admin)
        log('Create Route');
        const newRoute = await axios.post(`${API_URL}/routes`, {
            routeName: 'Express Test Route ' + Date.now(),
            stops: [
                { stopName: 'Point A', time: '8:00 AM' },
                { stopName: 'Point B', time: '8:30 AM' }
            ],
            pricing: { monthly: 500, semester: 2500, yearly: 4500 }
        }, { headers: { 'x-auth-token': adminToken } });
        routeId = newRoute.data._id;
        log('Route Created', routeId);

        await delay(1000);

        // 3. STUDENT SIGNUP
        log('Student Signup');
        const studentEmail = `student_${Date.now()}@example.com`;
        const signup = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Test Student',
            email: studentEmail,
            password: 'password123',
            rollNumber: 'ROLL' + Date.now(),
            department: 'AI',
            phoneNumber: '9999999999'
        });
        studentToken = signup.data.token;
        studentId = signup.data.user.id;
        log('Student Signup Success', studentId);

        await delay(1000);

        // 4. APPLY FOR BUS PASS (Student)
        log('Apply for Bus Pass');
        const form = new FormData();
        form.append('route', routeId);
        form.append('stop', 'Point A');
        form.append('passType', 'monthly');

        const idPath = path.join(__dirname, 'mock-id.txt');
        const feePath = path.join(__dirname, 'mock-fee.txt');
        const addrPath = path.join(__dirname, 'mock-address.txt');

        form.append('idCard', fs.createReadStream(idPath));
        form.append('feeReceipt', fs.createReadStream(feePath));
        form.append('addressProof', fs.createReadStream(addrPath));

        const apply = await axios.post(`${API_URL}/bus-pass/apply`, form, {
            headers: {
                ...form.getHeaders(),
                'x-auth-token': studentToken
            }
        });
        applicationId = apply.data._id;
        log('Application Submitted', applicationId);

        await delay(1000);

        // 5. GET STATUS (Student)
        log('Check Status (Student)');
        const status = await axios.get(`${API_URL}/bus-pass/my-pass`, {
            headers: { 'x-auth-token': studentToken }
        });
        log('Status Fetched', status.data?.status || 'No status');

        // 6. VIEW ALL APPLICATIONS (Admin)
        log('View All Applications (Admin)');
        const allApps = await axios.get(`${API_URL}/bus-pass/applications`, {
            headers: { 'x-auth-token': adminToken }
        });
        log('Applications Listed', allApps.data.length);

        // 7. APPROVE APPLICATION (Admin)
        log('Approve Application');
        const decision = await axios.put(`${API_URL}/bus-pass/decision/${applicationId}`, {
            status: 'approved',
            remarks: 'Verified by AI and Manual check',
            validFrom: '2026-02-01',
            validUntil: '2026-03-01'
        }, { headers: { 'x-auth-token': adminToken } });
        log('Application Approved', decision.data.nfcTagId);

        // 8. RENEWAL REQUEST (Student)
        log('Request Renewal');
        const renew = await axios.post(`${API_URL}/bus-pass/renew/${applicationId}`, {
            newPassType: 'semester'
        }, { headers: { 'x-auth-token': studentToken } });
        log('Renewal Requested', renew.data.msg);

        // 9. DASHBOARD STATS (Admin)
        log('Fetch Dashboard Stats');
        const stats = await axios.get(`${API_URL}/admin/stats`, {
            headers: { 'x-auth-token': adminToken }
        });
        log('Stats Received', stats.data.totalApplications);

        // 10. AUDIT LOGS (Admin)
        log('Fetch Audit Logs');
        const logs = await axios.get(`${API_URL}/admin/audit-logs`, {
            headers: { 'x-auth-token': adminToken }
        });
        log('Audit Logs Received', logs.data.length);

        // 11. VERIFY NFC (Public/Guard)
        log('Verify NFC');
        const verify = await axios.get(`${API_URL}/nfc/verify/${decision.data.nfcTagId}`);
        log('NFC Verified', verify.data.valid);

        // 12. BLACKLIST PASS (Admin)
        log('Blacklist Pass');
        const blacklist = await axios.put(`${API_URL}/admin/blacklist/${applicationId}`, {
            remarks: 'Misuse detected'
        }, { headers: { 'x-auth-token': adminToken } });
        log('Pass Blacklisted', blacklist.data.msg);

        console.log('\n✅ ALL API TESTS COMPLETED SUCCESSFULLY!');
    } catch (err) {
        console.error('\n❌ TEST FAILED');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
        process.exit(1);
    }
};

runTests();

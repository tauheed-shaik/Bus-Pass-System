const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Student Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, rollNumber, department, phoneNumber } = req.body;
        console.log('Signup attempt for:', email);

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password, rollNumber, department, phoneNumber, role: 'student' });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Login (Student & Admin)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if it's admin login
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ id: 'admin-id', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: { id: 'admin-id', name: 'Administrator', email: process.env.ADMIN_EMAIL, role: 'admin' } });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

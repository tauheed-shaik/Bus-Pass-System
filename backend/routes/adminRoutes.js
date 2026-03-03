const express = require('express');
const router = express.Router();
const BusPass = require('../models/BusPass');
const User = require('../models/User');
const Route = require('../models/Route');
const { auth, adminOnly } = require('../middleware/auth');

// Dashboard Stats
router.get('/stats', auth, adminOnly, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalApplications = await BusPass.countDocuments();
        const approvedPasses = await BusPass.countDocuments({ status: 'approved' });
        const pendingPasses = await BusPass.countDocuments({ status: 'pending' });
        const totalRoutes = await Route.countDocuments();

        res.json({
            totalStudents,
            totalApplications,
            approvedPasses,
            pendingPasses,
            totalRoutes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all students
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get Audit Logs
router.get('/audit-logs', auth, adminOnly, async (req, res) => {
    try {
        const AuditLog = require('../models/AuditLog');
        const logs = await AuditLog.find().populate('adminId', 'name email').sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Blacklist/Block a pass
router.put('/blacklist/:id', auth, adminOnly, async (req, res) => {
    try {
        const pass = await BusPass.findById(req.params.id);
        if (!pass) return res.status(404).json({ msg: 'Pass not found' });

        pass.status = 'blacklisted';
        pass.adminRemarks = req.body.remarks || 'Blacklisted by administrator';
        await pass.save();

        res.json({ msg: 'Pass blacklisted successfully', pass });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get Report Data for Export
router.get('/reports', auth, adminOnly, async (req, res) => {
    try {
        const reportType = req.query.type || 'applications';
        let data;
        if (reportType === 'applications') {
            data = await BusPass.find().populate('student', 'name email').populate('applicationDetails.route', 'routeName');
        } else if (reportType === 'renewals') {
            data = await BusPass.find({ 'renewalHistory.0': { $exists: true } }).populate('student', 'name email');
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

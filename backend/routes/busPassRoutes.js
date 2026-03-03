const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const BusPass = require('../models/BusPass');
const { auth, adminOnly } = require('../middleware/auth');
const { callGrokAI } = require('../utils/aiService');
const QRCode = require('qrcode');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Apply for bus pass
router.post('/apply', auth, upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'feeReceipt', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 }
]), async (req, res) => {
    try {
        const { route, stop, passType } = req.body;
        const documents = {
            idCard: req.files['idCard'] ? req.files['idCard'][0].path : '',
            feeReceipt: req.files['feeReceipt'] ? req.files['feeReceipt'][0].path : '',
            addressProof: req.files['addressProof'] ? req.files['addressProof'][0].path : ''
        };

        const newPass = new BusPass({
            student: req.user.id,
            applicationDetails: { route, stop, passType, documents }
        });

        // Proactive AI Summary
        const prompt = `Student with ID ${req.user.id} applied for ${passType} pass on route ${route}. Review application and flag missing documents or inconsistencies.`;
        newPass.aiSummary = await callGrokAI(prompt);

        await newPass.save();
        res.json(newPass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get student's pass status
router.get('/my-pass', auth, async (req, res) => {
    try {
        const pass = await BusPass.findOne({ student: req.user.id }).populate('applicationDetails.route').sort({ createdAt: -1 });
        res.json(pass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all applications
router.get('/applications', auth, adminOnly, async (req, res) => {
    try {
        const apps = await BusPass.find().populate('student').populate('applicationDetails.route');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Approve/Reject application
router.put('/decision/:id', auth, adminOnly, async (req, res) => {
    try {
        const { status, remarks, validFrom, validUntil } = req.body;
        const pass = await BusPass.findById(req.params.id);
        if (!pass) return res.status(404).json({ msg: 'Application not found' });

        pass.status = status;
        pass.adminRemarks = remarks;

        if (status === 'approved') {
            pass.validFrom = validFrom;
            pass.validUntil = validUntil;
            // Generate QR Code with ID
            pass.qrCode = await QRCode.toDataURL(pass._id.toString());
            // Random NFC Tag ID (Simulated)
            pass.nfcTagId = 'NFC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        }

        await pass.save();

        // Audit Log
        const AuditLog = require('../models/AuditLog');
        await new AuditLog({
            adminId: req.user.id,
            action: `Processed application ${pass._id}`,
            details: `Status set to ${status}. Remarks: ${remarks}`
        }).save();

        res.json(pass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Renew bus pass
router.post('/renew/:id', auth, async (req, res) => {
    try {
        const pass = await BusPass.findOne({ _id: req.params.id, student: req.user.id });
        if (!pass) return res.status(404).json({ msg: 'Pass not found' });

        const { newPassType } = req.body;
        const renewalEntry = {
            renewalDate: new Date(),
            prevValidUntil: pass.validUntil,
            newPassType: newPassType || pass.applicationDetails.passType,
            status: 'pending'
        };

        pass.renewalHistory.push(renewalEntry);
        pass.status = 'pending_renewal';
        await pass.save();

        res.json({ msg: 'Renewal request submitted', pass });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Payment Receipt (Simulated)
router.get('/receipt/:id', auth, async (req, res) => {
    try {
        const pass = await BusPass.findOne({ _id: req.params.id, student: req.user.id }).populate('applicationDetails.route');
        if (!pass) return res.status(404).json({ msg: 'Receipt not found' });

        const receiptData = {
            receiptNo: 'RCP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: pass.updatedAt,
            amount: 1500, // Placeholder, usually would calculate based on pass type
            studentName: req.user.name,
            passId: pass._id,
            type: pass.applicationDetails.passType
        };

        res.json(receiptData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

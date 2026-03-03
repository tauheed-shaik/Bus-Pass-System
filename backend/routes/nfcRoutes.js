const express = require('express');
const router = express.Router();
const BusPass = require('../models/BusPass');

// NFC Verification Endpoint
router.get('/verify/:nfcId', async (req, res) => {
    try {
        const pass = await BusPass.findOne({ nfcTagId: req.params.nfcId })
            .populate('student', 'name email rollNumber department')
            .populate('applicationDetails.route');

        if (!pass) return res.status(404).json({ valid: false, msg: 'Tag not recognized' });

        const isExpired = new Date() > new Date(pass.validUntil);
        if (isExpired) return res.status(200).json({ valid: false, msg: 'Pass Expired', pass });

        if (pass.status !== 'approved') return res.status(200).json({ valid: false, msg: 'Pass Not Approved', pass });

        res.json({ valid: true, msg: 'Access Granted', pass });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

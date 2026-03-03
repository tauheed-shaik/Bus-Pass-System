const express = require('express');
const router = express.Router();
const { callGrokAI } = require('../utils/aiService');
const { auth, adminOnly } = require('../middleware/auth');

// Generate application summary
router.post('/summarize-application', auth, async (req, res) => {
    try {
        const { applicationData } = req.body;
        const prompt = `Summarize this bus pass application for admin review. Check for student consistency (Name, Roll No, etc). 
    Application Data: ${JSON.stringify(applicationData)}
    Return a professional and concise summary.`;

        const summary = await callGrokAI(prompt);
        res.json({ summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generate rejection reason or approval note
router.post('/generate-decision-note', auth, adminOnly, async (req, res) => {
    try {
        const { status, studentData, remarks } = req.body;
        const prompt = `Generate a professional ${status} message for a bus pass application.
    Student: ${studentData.name}
    Admin Remarks: ${remarks}
    The message should be polite and clear.`;

        const note = await callGrokAI(prompt);
        res.json({ note });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

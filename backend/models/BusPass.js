const mongoose = require('mongoose');

const busPassSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicationDetails: {
        route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
        stop: { type: String },
        passType: { type: String, enum: ['monthly', 'semester', 'yearly'] },
        documents: {
            idCard: { type: String },
            feeReceipt: { type: String },
            addressProof: { type: String },
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired', 'pending_renewal', 'blacklisted'],
        default: 'pending'
    },
    adminRemarks: { type: String },
    aiSummary: { type: String },
    validFrom: { type: Date },
    validUntil: { type: Date },
    nfcTagId: { type: String },
    qrCode: { type: String },
    renewalHistory: [{
        renewalDate: { type: Date, default: Date.now },
        prevValidUntil: { type: Date },
        newPassType: { type: String },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    }],
    createdAt: { type: Date, default: Date.now },
}, { strictPopulate: false });

module.exports = mongoose.model('BusPass', busPassSchema);

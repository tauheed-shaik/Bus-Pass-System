const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeName: { type: String, required: true },
    stops: [{
        stopName: { type: String, required: true },
        time: { type: String },
    }],
    pricing: {
        monthly: { type: Number, required: true },
        semester: { type: Number, required: true },
        yearly: { type: Number, required: true },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Route', routeSchema);

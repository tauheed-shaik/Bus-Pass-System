const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const { auth, adminOnly } = require('../middleware/auth');

// Get all routes
router.get('/', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new route (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const newRoute = new Route(req.body);
        await newRoute.save();
        res.json(newRoute);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete route
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        await Route.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Route deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

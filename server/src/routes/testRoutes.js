// TEST ENDPOINT - Add this temporarily to server.js to debug

import express from 'express';
const router = express.Router();

// Simple test endpoint that doesn't require auth
router.get('/test', (req, res) => {
    res.json({
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint to check MongoDB connection
router.get('/test-db', async (req, res) => {
    try {
        const User = (await import('./models/User.js')).default;
        const count = await User.countDocuments();
        res.json({
            message: 'Database connected!',
            userCount: count
        });
    } catch (error) {
        res.status(500).json({
            message: 'Database error',
            error: error.message
        });
    }
});

// Test protected endpoint
router.get('/test-auth', async (req, res) => {
    try {
        const { protect } = await import('./middleware/authMiddleware.js');
        // This route uses protect middleware
        return protect(req, res, () => {
            res.json({
                message: 'Auth working!',
                user: req.user
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Auth error',
            error: error.message
        });
    }
});

export default router;

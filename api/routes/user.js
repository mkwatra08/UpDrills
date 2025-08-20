const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/me - Get current user profile (requires auth)
router.get('/me', requireAuth, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
    providers: req.user.providers,
    createdAt: req.user.createdAt
  });
});

module.exports = router; 
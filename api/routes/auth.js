const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET /auth/google - Initiate Google OAuth
router.get('/google', (req, res, next) => {
  // Check if Google OAuth is properly configured
  if (!process.env.GOOGLE_CLIENT_ID || 
      !process.env.GOOGLE_CLIENT_SECRET ||
      process.env.GOOGLE_CLIENT_ID === 'placeholder.apps.googleusercontent.com' ||
      process.env.GOOGLE_CLIENT_SECRET === 'placeholder_secret') {
    return res.status(500).json({
      error: {
        code: 'OAUTH_NOT_CONFIGURED',
        message: 'Google OAuth is not properly configured. Please set up Google OAuth credentials in your environment variables.'
      }
    });
  }
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// GET /auth/google/callback - Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureMessage: true
  }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

// GET /auth/logout - Logout user
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        error: {
          code: 'LOGOUT_ERROR',
          message: 'Error during logout'
        }
      });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// GET /auth/status - Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
      }
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

// GET /auth/config - Check OAuth configuration status
router.get('/config', (req, res) => {
  const isConfigured = process.env.GOOGLE_CLIENT_ID && 
                      process.env.GOOGLE_CLIENT_SECRET &&
                      process.env.GOOGLE_CLIENT_ID !== 'placeholder.apps.googleusercontent.com' &&
                      process.env.GOOGLE_CLIENT_SECRET !== 'placeholder_secret';
  
  res.json({
    oauthConfigured: isConfigured,
    message: isConfigured ? 'OAuth is properly configured' : 'OAuth is not configured'
  });
});

module.exports = router; 
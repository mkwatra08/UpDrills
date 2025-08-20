// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    const error = new Error('Authentication required');
    error.name = 'UnauthorizedError';
    return next(error);
  }
  next();
};

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  // This middleware doesn't throw an error if user is not authenticated
  // It just ensures req.user is available
  next();
};

module.exports = {
  requireAuth,
  optionalAuth
}; 
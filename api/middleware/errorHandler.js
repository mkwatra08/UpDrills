const winston = require('winston');

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  winston.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error response
  let errorResponse = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  };

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    errorResponse = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: Object.values(err.errors).map(e => e.message)
      }
    };
    res.status(400);
  } else if (err.name === 'CastError') {
    errorResponse = {
      error: {
        code: 'INVALID_ID',
        message: 'Invalid ID format'
      }
    };
    res.status(400);
  } else if (err.name === 'MongoError' && err.code === 11000) {
    errorResponse = {
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'Duplicate entry found'
      }
    };
    res.status(409);
  } else if (err.name === 'UnauthorizedError') {
    errorResponse = {
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    };
    res.status(401);
  } else if (err.name === 'ForbiddenError') {
    errorResponse = {
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied'
      }
    };
    res.status(403);
  } else if (err.name === 'NotFoundError') {
    errorResponse = {
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found'
      }
    };
    res.status(404);
  } else if (err.name === 'RateLimitError') {
    errorResponse = {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests'
      }
    };
    res.status(429);
  } else {
    res.status(500);
  }

  // Send error response
  res.json(errorResponse);
};

// 404 handler middleware
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
}; 
const { z } = require('zod');

// Validation schemas
const attemptSchema = z.object({
  drillId: z.string().min(1, 'Drill ID is required'),
  answers: z.array(z.object({
    qid: z.string().min(1, 'Question ID is required'),
    text: z.string().min(1, 'Answer text is required')
  })).min(1, 'At least one answer is required')
});

const limitSchema = z.object({
  limit: z.string().optional().transform(val => {
    const num = parseInt(val);
    return isNaN(num) ? 5 : Math.min(Math.max(num, 1), 50);
  })
});

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params
      });
      
      // Attach validated data to request
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new Error('Validation failed');
        validationError.name = 'ValidationError';
        validationError.details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return next(validationError);
      }
      next(error);
    }
  };
};

// Specific validation middlewares
const validateAttempt = validateRequest(attemptSchema);
const validateLimit = validateRequest(limitSchema);

module.exports = {
  validateRequest,
  validateAttempt,
  validateLimit
}; 
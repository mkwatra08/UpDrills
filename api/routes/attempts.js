const express = require('express');
const Attempt = require('../models/Attempt');
const Drill = require('../models/Drill');
const { requireAuth } = require('../middleware/auth');
const { validateAttempt, validateLimit } = require('../middleware/validation');
const router = express.Router();

// POST /api/attempts - Submit attempt (requires auth)
router.post('/attempts', requireAuth, validateAttempt, async (req, res, next) => {
  try {
    const { drillId, answers } = req.validatedData;
    
    // Verify drill exists
    const drill = await Drill.findById(drillId);
    if (!drill) {
      const error = new Error('Drill not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    // Create attempt
    const attempt = new Attempt({
      userId: req.user._id,
      drillId,
      answers
    });

    // Calculate score
    attempt.score = attempt.calculateScore(drill);
    
    await attempt.save();

    // Populate drill info for response
    await attempt.populate('drillId', 'title difficulty');

    res.status(201).json({
      id: attempt._id,
      drillId: attempt.drillId,
      drillTitle: attempt.drillId.title,
      drillDifficulty: attempt.drillId.difficulty,
      answers: attempt.answers,
      score: attempt.score,
      createdAt: attempt.createdAt
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/attempts - Get user attempts (requires auth)
router.get('/attempts', requireAuth, validateLimit, async (req, res, next) => {
  try {
    const { limit = 5 } = req.validatedData;
    
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate('drillId', 'title difficulty tags')
      .sort({ createdAt: -1 })
      .limit(limit);

    const formattedAttempts = attempts.map(attempt => ({
      id: attempt._id,
      drillId: attempt.drillId._id,
      drillTitle: attempt.drillId.title,
      drillDifficulty: attempt.drillId.difficulty,
      drillTags: attempt.drillId.tags,
      score: attempt.score,
      createdAt: attempt.createdAt
    }));

    res.json({
      attempts: formattedAttempts,
      count: formattedAttempts.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/attempts/:id - Get specific attempt (requires auth)
router.get('/attempts/:id', requireAuth, async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('drillId', 'title difficulty tags questions');

    if (!attempt) {
      const error = new Error('Attempt not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    // Check if user owns this attempt
    if (attempt.userId.toString() !== req.user._id.toString()) {
      const error = new Error('Access denied');
      error.name = 'ForbiddenError';
      return next(error);
    }

    res.json({
      id: attempt._id,
      drillId: attempt.drillId._id,
      drillTitle: attempt.drillId.title,
      drillDifficulty: attempt.drillId.difficulty,
      drillTags: attempt.drillId.tags,
      answers: attempt.answers,
      score: attempt.score,
      createdAt: attempt.createdAt
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/attempts/stats - Get user statistics (requires auth)
router.get('/attempts/stats', requireAuth, async (req, res, next) => {
  try {
    const stats = await Attempt.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          lowestScore: { $min: '$score' }
        }
      }
    ]);

    const drillStats = await Attempt.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$drillId',
          attempts: { $sum: 1 },
          bestScore: { $max: '$score' },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { bestScore: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      overall: stats[0] || {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      },
      topDrills: drillStats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 
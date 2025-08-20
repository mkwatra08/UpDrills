const express = require('express');
const Drill = require('../models/Drill');
const router = express.Router();

// In-memory cache for drills
let drillsCache = null;
let cacheTimestamp = null;
const CACHE_TTL = parseInt(process.env.CACHE_TTL_MS) || 60000; // 60 seconds

// Cache middleware
const getCachedDrills = () => {
  if (drillsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_TTL) {
    return drillsCache;
  }
  return null;
};

const setCachedDrills = (drills) => {
  drillsCache = drills;
  cacheTimestamp = Date.now();
};

// GET /api/drills - Get all drills (public)
router.get('/drills', async (req, res, next) => {
  try {
    // Check cache first
    const cached = getCachedDrills();
    if (cached) {
      return res.json(cached);
    }

    // Query parameters
    const { difficulty, tags, search, limit = 50, page = 1 } = req.query;
    
    // Build query
    let query = {};
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const drills = await Drill.find(query)
      .select('-__v')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Drill.countDocuments(query);
    
    const response = {
      drills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };

    // Cache the response
    setCachedDrills(response);
    
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/drills/:id - Get specific drill (public)
router.get('/drills/:id', async (req, res, next) => {
  try {
    const drill = await Drill.findById(req.params.id).select('-__v');
    
    if (!drill) {
      const error = new Error('Drill not found');
      error.name = 'NotFoundError';
      return next(error);
    }
    
    res.json(drill);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 
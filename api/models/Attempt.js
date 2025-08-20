const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  qid: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
});

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  drillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drill',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
attemptSchema.index({ userId: 1, createdAt: -1 });

// Virtual for completion percentage
attemptSchema.virtual('completionPercentage').get(function() {
  if (!this.answers || this.answers.length === 0) return 0;
  return Math.round((this.answers.length / this.answers.length) * 100);
});

// Method to calculate score based on keywords
attemptSchema.methods.calculateScore = function(drill) {
  if (!drill || !drill.questions || !this.answers) {
    return 0;
  }

  let totalScore = 0;
  let maxScore = drill.questions.length * 10; // 10 points per question

  this.answers.forEach(answer => {
    const question = drill.getQuestionById(answer.qid);
    if (question && question.keywords) {
      const answerText = answer.text.toLowerCase();
      const matchedKeywords = question.keywords.filter(keyword => 
        answerText.includes(keyword.toLowerCase())
      );
      const questionScore = Math.round((matchedKeywords.length / question.keywords.length) * 10);
      totalScore += Math.min(questionScore, 10); // Cap at 10 points per question
    }
  });

  return Math.round((totalScore / maxScore) * 100);
};

// Static method to get user's best score for a drill
attemptSchema.statics.getBestScore = function(userId, drillId) {
  return this.findOne({ userId, drillId })
    .sort({ score: -1 })
    .select('score');
};

// Static method to get user's attempt history
attemptSchema.statics.getUserHistory = function(userId, limit = 10) {
  return this.find({ userId })
    .populate('drillId', 'title difficulty')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get drill statistics
attemptSchema.statics.getDrillStats = function(drillId) {
  return this.aggregate([
    { $match: { drillId: new mongoose.Types.ObjectId(drillId) } },
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
};

module.exports = mongoose.model('Attempt', attemptSchema); 
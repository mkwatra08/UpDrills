const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }]
});

const drillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  questions: [questionSchema]
}, {
  timestamps: true
});

// Indexes
drillSchema.index({ tags: 1 });
drillSchema.index({ difficulty: 1 });

// Virtual for question count
drillSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Method to get questions by ID
drillSchema.methods.getQuestionById = function(questionId) {
  return this.questions.find(q => q.id === questionId);
};

// Static method to find drills by tags
drillSchema.statics.findByTags = function(tags) {
  return this.find({ tags: { $in: tags } });
};

// Static method to find drills by difficulty
drillSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ difficulty });
};

// Static method to search drills
drillSchema.statics.search = function(query) {
  return this.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  });
};

module.exports = mongoose.model('Drill', drillSchema); 
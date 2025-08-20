const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['google']
  },
  providerId: {
    type: String,
    required: true
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    required: false
  },
  providers: [providerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });

// Virtual for getting the primary provider
userSchema.virtual('primaryProvider').get(function() {
  return this.providers.length > 0 ? this.providers[0] : null;
});

// Method to add a provider
userSchema.methods.addProvider = function(provider, providerId) {
  const existingProvider = this.providers.find(p => p.provider === provider);
  if (!existingProvider) {
    this.providers.push({ provider, providerId });
  }
  return this.save();
};

// Static method to find or create user
userSchema.statics.findOrCreate = async function(profile) {
  let user = await this.findOne({ email: profile.emails[0].value });
  
  if (!user) {
    user = new this({
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0]?.value,
      providers: [{
        provider: 'google',
        providerId: profile.id
      }]
    });
    await user.save();
  } else {
    // Update existing user with new provider if needed
    await user.addProvider('google', profile.id);
  }
  
  return user;
};

module.exports = mongoose.model('User', userSchema); 
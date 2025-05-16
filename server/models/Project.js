const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  youtuberId: {
    type: String,
    required: true,
    ref: 'User'
  },
  editorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'in_review', 'changes_requested', 'approved'],
    default: 'draft'
  },
  metadata: {
    duration: Number,
    resolution: String,
    format: String,
    size: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  feedback: [{
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    from: {
      type: String,
      required: true,
      ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ youtuberId: 1 });
projectSchema.index({ editorId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  return this.metadata?.duration || 0;
});

// Method to add feedback
projectSchema.methods.addFeedback = async function(message, userId) {
  this.feedback.push({
    message,
    from: userId,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update status
projectSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  this.updatedAt = new Date();
  return this.save();
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 
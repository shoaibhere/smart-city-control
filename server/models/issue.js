// models/Issue.js
import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [String], // Array of Cloudinary URLs
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  resolvedAt: Date,
  arData: {
    type: Object // For storing AR-related data
  },
  comments: [{
    text: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
issueSchema.index({ location: '2dsphere' });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
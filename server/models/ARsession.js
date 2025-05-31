// models/ARSession.js
import mongoose from 'mongoose';

const arSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  },
  sessionData: Object, // Stores AR session-specific data
  markers: [{
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    data: Object // Additional marker data
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: Date
});

// Index for geospatial queries
arSessionSchema.index({ 'markers': '2dsphere' });

const ARSession = mongoose.model('ARSession', arSessionSchema);
export default ARSession
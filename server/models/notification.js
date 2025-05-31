// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['issue', 'poll', 'report', 'message', 'assignment', 'status'],
    required: true
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  message: String,
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification =  mongoose.model('Notification', notificationSchema);
export default Notification;
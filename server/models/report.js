import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  files: [String], // Array of Cloudinary URLs for reports/documents
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  relatedIssues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }],
  metrics: Object, // For storing various analytics data
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);
export default Report;

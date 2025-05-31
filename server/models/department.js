// models/Department.js
import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  location: String,
  contactEmail: String,
  contactPhone: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
import Report from '../models/report.js';
import Department from '../models/department.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';


// @desc    Get all reports
// @route   GET /api/reports
export const getReports = async (req, res) => {
  try {
    let query = {};
    
    // Department officials can only see their department's reports
    if (req.user.role === 'department') {
      query.department = req.user.department;
    }

    const reports = await Report.find(query)
      .populate('createdBy', 'username profile')
      .populate('department', 'name')
      .sort('-createdAt');

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new report (Department official only)
// @route   POST /api/reports
export const createReport = async (req, res) => {
  try {
    if (req.user.role !== 'department') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, relatedIssues } = req.body;
    
    // Upload files to Cloudinary if any
    let files = [];
    if (req.files && req.files.files) {
      const uploadedFiles = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
      for (const file of uploadedFiles) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'reports'
        });
        files.push(result.secure_url);
      }
    }

    const report = new Report({
      title,
      description,
      files,
      createdBy: req.user.id,
      department: req.user.department,
      relatedIssues: JSON.parse(relatedIssues || '[]')
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
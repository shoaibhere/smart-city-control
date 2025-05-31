import Notification from '../models/notification.js';
import User from '../models/users.model.js';
import Issue from '../models/issue.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getIssues = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'citizen') {
      query.reportedBy = req.user.id;
    }
    
    if (req.user.role === 'department') {
      query.$or = [
        { assignedTo: req.user.id },
        { assignedTo: { $in: await User.find({ department: req.user.department }).select('_id') }
    }];
    }

    const issues = await Issue.find(query)
      .populate('reportedBy', 'username profile')
      .populate('assignedTo', 'username profile')
      .sort('-createdAt');

    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createIssue = async (req, res) => {
  try {
    if (req.user.role !== 'citizen') {
      return res.status(403).json({ message: 'Only citizens can report issues' });
    }

    const { title, description, category, location } = req.body;
    
    let images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'issue_images');
        if (result) {
          images.push(result.url);
        }
      }
    }

    const issue = new Issue({
      title,
      description,
      category,
      images,
      location: {
        type: 'Point',
        coordinates: JSON.parse(location)
      },
      reportedBy: req.user.id
    });

    await issue.save();

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        sender: req.user.id,
        type: 'issue',
        relatedEntity: issue._id,
        message: `New issue reported: ${title}`
      });
    }

    res.status(201).json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const assignIssue = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { assignedTo } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const official = await User.findOne({ _id: assignedTo, role: 'department' });
    if (!official) {
      return res.status(400).json({ message: 'Invalid department official' });
    }

    issue.assignedTo = assignedTo;
    issue.assignedBy = req.user.id;
    issue.assignedAt = Date.now();
    issue.status = 'Assigned';
    await issue.save();

    await Notification.create({
      recipient: assignedTo,
      sender: req.user.id,
      type: 'assignment',
      relatedEntity: issue._id,
      message: `You've been assigned a new issue: ${issue.title}`
    });

    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    if (req.user.role !== 'department') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (!issue.assignedTo.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this issue' });
    }

    issue.status = status;
    if (status === 'Resolved') {
      issue.resolvedAt = Date.now();
    }
    await issue.save();

    await Notification.create({
      recipient: issue.reportedBy,
      sender: req.user.id,
      type: 'status',
      relatedEntity: issue._id,
      message: `Your issue status has been updated to: ${status}`
    });

    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
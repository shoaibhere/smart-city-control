import express from 'express';
import Issue from '../models/issue.js';
import Report from '../models/report.js';
import User from '../models/users.model.js';
import Poll from '../models/poll.js';
const router = express.Router();

// Import your auth middleware
import { protect, admin } from '../middleware/auth.js';

// GET /api/admin/stats - Admin dashboard statistics
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeIssues = await Issue.countDocuments({ status: { $nin: ['Resolved'] } });
    const activePolls = await Poll.countDocuments({ isActive: true });
    const reportsFiled = await Report.countDocuments();

    // Format the response to match your frontend expectations
    res.json([
      {
        label: 'Total Users',
        value: totalUsers,
        iconKey: 'Users',
        bg: 'bg-blue-50',
        color: 'text-blue-600'
      },
      {
        label: 'Active Issues',
        value: activeIssues,
        iconKey: 'ClipboardList',
        bg: 'bg-orange-50',
        color: 'text-orange-600'
      },
      {
        label: 'Active Polls',
        value: activePolls,
        iconKey: 'Vote',
        bg: 'bg-green-50',
        color: 'text-green-600'
      },
      {
        label: 'Reports Filed',
        value: reportsFiled,
        iconKey: 'FileText',
        bg: 'bg-purple-50',
        color: 'text-purple-600'
      }
    ]);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

// GET /api/admin/recent-issues - Recent issues for admin dashboard
router.get('/recent-issues', protect, admin, async (req, res) => {
  try {
    const recentIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('department', 'name') // Assuming department is a reference
      .select('title status priority createdAt');

    // Format the response to match your frontend expectations
    const formattedIssues = recentIssues.map(issue => ({
      id: issue._id,
      title: issue.title,
      department: issue.department?.name || 'General',
      status: issue.status,
      priority: issue.priority,
      createdAt: issue.createdAt
    }));

    res.json(formattedIssues);
  } catch (error) {
    console.error('Error fetching recent issues:', error);
    res.status(500).json({ error: 'Server error fetching recent issues' });
  }
});

// GET /api/admin/users - Get all users (for user management)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// PUT /api/admin/users/:id - Update user role
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error updating user' });
  }
});

export default router;
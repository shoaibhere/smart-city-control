import express from 'express';
import Issue from '../models/issue.js';
import Poll from '../models/poll.js';
import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
  toggleUserActiveStatus,
} from '../controllers/user.controller.js';

import {
  protect,
  admin,
  citizen
} from '../middleware/auth.js';

const router = express.Router();
router.put('/:id/toggle', protect, toggleUserActiveStatus);
router.get('/', protect, admin, getUsers);
router.post('/', protect, admin, createUser);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [reportCount, resolved, activePolls] = await Promise.all([
      Issue.countDocuments({ reportedBy: userId }),
      Issue.countDocuments({ 
        reportedBy: userId, 
        status: 'Resolved' 
      }),
      Poll.countDocuments({ 
        isActive: true,
        endDate: { $gt: new Date() }
      })
    ]);

    // Calculate community score based on participation
    const communityScore = Math.min(
      100, 
      50 + // base score
      (reportCount * 5) + // 5 points per report
      (resolved * 10) // 10 points per resolved issue
    );

    res.json([
      {
        label: 'My Reports',
        value: reportCount,
        iconKey: 'ClipboardList',
        bg: 'bg-blue-50',
        color: 'text-blue-600'
      },
      {
        label: 'Resolved Issues',
        value: resolved,
        iconKey: 'FileText',
        bg: 'bg-green-50',
        color: 'text-green-600'
      },
      {
        label: 'Active Polls',
        value: activePolls,
        iconKey: 'Vote',
        bg: 'bg-purple-50',
        color: 'text-purple-600'
      },
      {
        label: 'Community Score',
        value: communityScore,
        iconKey: 'TrendingUp',
        bg: 'bg-orange-50',
        color: 'text-orange-600'
      }
    ]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error fetching dashboard stats' });
  }
});

// GET /api/dashboard/my-issues - Get citizen's recent issues
router.get('/my-issues', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const issues = await Issue.find({ reportedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('department', 'name')
      .select('title status location createdAt department');

    const formattedIssues = issues.map(issue => ({
      id: issue._id,
      title: issue.title,
      location: issue.location,
      status: issue.status,
      department: issue.department?.name || 'General',
      reportedAt: formatDate(issue.createdAt) // Helper function below
    }));

    res.json(formattedIssues);
  } catch (error) {
    console.error('Error fetching user issues:', error);
    res.status(500).json({ error: 'Server error fetching user issues' });
  }
});

// GET /api/dashboard/active-polls - Get active polls
router.get('/active-polls', protect, async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user._id;
    
    const polls = await Poll.find({
      isActive: true,
      endDate: { $gt: now }
    })
    .sort({ endDate: 1 }) // Sort by ending soonest
    .limit(3)
    .lean();

    const pollsWithVotedStatus = polls.map(poll => ({
      ...poll,
      voted: poll.voters?.includes(userId) || false,
      endsIn: formatTimeRemaining(poll.endDate) // Helper function below
    }));

    res.json(polls);
  } catch (error) {
    console.error('Error fetching active polls:', error);
    res.status(500).json({ error: 'Server error fetching active polls' });
  }
});

// Helper function to format dates
function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

// Helper function to format time remaining
function formatTimeRemaining(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
}

export default router;

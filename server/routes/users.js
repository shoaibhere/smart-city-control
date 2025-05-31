import express from 'express';
import Issue from '../models/issue.js';
import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser
} from '../controllers/user.controller.js';

import {
  protect,
  admin
} from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.post('/', protect, admin, createUser);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);
// GET /api/users/stats
router.get('/stats', protect, async (req, res) => {
  const reportCount = await Issue.countDocuments({ user: req.user._id });
  const resolved = await Issue.countDocuments({ user: req.user._id, status: 'Resolved' });
  const polls = await Poll.countDocuments(); // or only active ones
  const score = 92; // Example static or computed

  res.json({
    myReports: reportCount,
    resolvedIssues: resolved,
    activePolls: polls,
    communityScore: score
  });
});


export default router;

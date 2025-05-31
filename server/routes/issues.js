import express from 'express';
import {
  getIssues,
  createIssue,
  assignIssue,
  updateIssueStatus,
  getSingleIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issue.controller.js';

import {
  protect,
  citizen,
  department,
  admin
} from '../middleware/auth.js';

import {
  uploadMultiple,
  cleanupTempFiles
} from '../utils/multer.js';

const router = express.Router();

router.get('/', protect, getIssues);

router.post(
  '/',
  protect,
  citizen,
  uploadMultiple('images', 5),
  cleanupTempFiles,
  createIssue
);
router.get('/:id', protect, getSingleIssue);
router.put('/:id', protect, updateIssue); // Reporter or Admin
router.delete('/:id', protect, deleteIssue); // Reporter or Admin

router.put('/:id/assign', protect, admin, assignIssue);
router.put('/:id/status', protect, department, updateIssueStatus);
// GET /api/issues/my
router.get('/my', protect, async (req, res) => {
  const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(issues);
});


export default router;

import express from 'express';
import {
  getIssues,
  createIssue,
  assignIssue,
  updateIssueStatus
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

router.put('/:id/assign', protect, admin, assignIssue);
router.put('/:id/status', protect, department, updateIssueStatus);

export default router;

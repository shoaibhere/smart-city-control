import express from 'express';
import {
  getPolls,
  getActivePolls,
  createPoll,
  voteOnPoll,
  updatePoll,
  deletePoll,
} from '../controllers/polls.controller.js';

import {
  protect,
  citizen,
  admin
} from '../middleware/auth.js';

import {
  uploadSingle,
  cleanupTempFiles
} from '../utils/multer.js';

const router = express.Router();

// 🔹 Get all polls (admin)
router.get('/', protect, getPolls);

// 🔹 Get active polls (citizens)
router.get('/active', protect, citizen, getActivePolls);

// 🔹 Create poll (admin only)
router.post(
  '/',
  protect,
  admin,
  uploadSingle('image'),
  cleanupTempFiles,
  createPoll
);

// 🔹 Vote on a poll (citizens)
router.post('/:id/vote', protect, citizen, voteOnPoll);

// 🔹 Update poll (admin only)
router.put(
  '/:id',
  protect,
  admin,
  uploadSingle('image'),
  cleanupTempFiles,
  updatePoll
);

// 🔹 Delete poll (admin only)
router.delete('/:id', protect, admin, deletePoll);

export default router;

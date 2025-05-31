import express from 'express';
import {
  getPolls,
  createPoll,
  voteOnPoll
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

router.get('/', protect, getPolls);

router.post(
  '/',
  protect,
  admin,
  uploadSingle('image'),
  cleanupTempFiles,
  createPoll
);

router.post('/:id/vote', protect, citizen, voteOnPoll);
// GET /api/polls/active
router.get('/active', protect, async (req, res) => {
  const activePolls = await Poll.find({ expiresAt: { $gte: new Date() } });
  res.json(activePolls);
});


export default router;

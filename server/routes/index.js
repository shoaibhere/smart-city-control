// routes/index.js
import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import issueRoutes from './issues.js';
import pollRoutes from './polls.js';
import reportRoutes from './reports.js';
import chatRoutes from './chats.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/issues', issueRoutes);
router.use('/polls', pollRoutes);
router.use('/reports', reportRoutes);
router.use('/chats', chatRoutes);

export default router;

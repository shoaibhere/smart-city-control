// routes/index.js
import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import issueRoutes from './issues.js';
import pollRoutes from './polls.js';
import reportRoutes from './reports.js';
import chatRoutes from './chats.js';
import adminRoutes from './admin.js';
import cookieParser from 'cookie-parser';
import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
// Example /api/me route
// Assumes you use cookie-parser and JWT
router.use(cookieParser());
router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // You can fetch the user from DB here if needed
    const user = await User.findById(decoded.id);
    res.json({ user });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
    console.log(err)
  }
});


router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/issues', issueRoutes);
router.use('/polls', pollRoutes);
router.use('/reports', reportRoutes);
router.use('/chats', chatRoutes);

export default router;

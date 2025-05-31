import express from 'express';
import {
  getChats,
  createChat,
  createGroupChat,
  sendMessage
} from '../controllers/chat.controller.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.post('/group', protect, createGroupChat);
router.post('/:id/messages', protect, sendMessage);

export default router;

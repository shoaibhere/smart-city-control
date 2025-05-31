import express from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../utils/multer.js';

const router = express.Router();

router.post('/register', uploadSingle('avatar'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout); // ✅ add logout route

export default router;

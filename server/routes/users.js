import express from 'express';
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

export default router;

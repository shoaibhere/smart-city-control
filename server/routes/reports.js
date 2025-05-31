import express from 'express';
import {
  getReports,
  createReport
} from '../controllers/reports.controller.js';

import {
  protect,
  department,
  admin
} from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getReports);
router.post('/', protect, department, createReport);

export default router;

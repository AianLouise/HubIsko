import express from 'express';
import {
  createScholarshipActivityLog,
  getScholarshipActivityLogsByProvider
} from '../controllers/scholarshipActivityLog.controller.js';

const router = express.Router();

router.post('/scholarship-activity-logs', createScholarshipActivityLog);
router.get('/scholarship-activity-logs/provider/:providerId', getScholarshipActivityLogsByProvider);

export default router;
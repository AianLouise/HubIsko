import express from 'express';
import {
  createActivityLog,
  getActivityLogs,
  updateActivityLog,
  deleteActivityLog
} from '../controllers/activityLog.controller.js';

const router = express.Router();

router.post('/activity-logs', createActivityLog);
router.get('/activity-logs', getActivityLogs);
router.put('/activity-logs/:id', updateActivityLog);
router.delete('/activity-logs/:id', deleteActivityLog);

export default router;
import express from "express";
import { createNotification, getNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/notifications/create', createNotification);
router.get('/notifications/:recipientId', getNotifications);


export default router;
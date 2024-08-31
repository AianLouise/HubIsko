import express from "express";
import { createNotification, getNotificationById, getNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/notifications/create', createNotification);
router.get('/notifications/:recipientId', getNotifications);
router.get('/notification-details/:id', getNotificationById);

export default router;
import express from "express";
import { createNotification, getNotificationById, getNotifications, markAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/notifications/create', createNotification);
router.get('/notifications/:recipientId', getNotifications);
router.get('/notification-details/:id', getNotificationById);
router.post('/mark-as-read/:id', markAsRead);

export default router;
import express from 'express';
import { test, createAnnouncement, getAnnouncements, deleteAnnouncement, getAnnouncementById, addCommentToAnnouncement } from '../controllers/announcement.controller.js';

const router = express.Router();

router.post('/test', test);
router.post('/create-announcement', createAnnouncement);
router.get('/:scholarshipProgram', getAnnouncements);
router.delete('/announcements/:id', deleteAnnouncement);
router.get('/get/:id', getAnnouncementById);
router.post('/:id/comments', addCommentToAnnouncement);

export default router;
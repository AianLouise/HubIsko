import express from 'express';
import { test, createAnnouncement, getAnnouncements, deleteAnnouncement, getAnnouncementById, addCommentToAnnouncement, likeAnnouncement, unlikeAnnouncement, likeComment, unlikeComment, addReply } from '../controllers/announcement.controller.js';

const router = express.Router();

router.post('/test', test);
router.post('/create-announcement', createAnnouncement);
router.get('/:scholarshipProgram', getAnnouncements);
router.put('/delete/:id', deleteAnnouncement);
router.get('/get/:id', getAnnouncementById);
router.post('/:id/comments', addCommentToAnnouncement);
router.post('/like/:id', likeAnnouncement);
router.post('/unlike/:id', unlikeAnnouncement);
router.post('/like-comment/:announcementId/:commentId', likeComment);
router.post('/unlike-comment/:announcementId/:commentId', unlikeComment);
router.post('/reply/:announcementId/:commentId', addReply);

export default router;
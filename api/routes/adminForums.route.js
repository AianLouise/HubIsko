import express from 'express';
import {
  test,
  getAllForumPosts, // Import the getAllForumPosts function
  getApplicantForumPosts,
  getScholarshipProviderForumPosts,
  getAdminForumPosts,
  getAllAnnouncements
} from '../controllers/adminForums.controller.js';

const router = express.Router();

router.post('/test', test);
router.get('/forum-posts', getAllForumPosts);
router.get('/applicant-forum-posts', getApplicantForumPosts);
router.get('/scholarship-provider-forum-posts', getScholarshipProviderForumPosts);
router.get('/admin-forum-posts', getAdminForumPosts); 
router.get('/announcements', getAllAnnouncements);

export default router;
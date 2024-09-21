import express from 'express';
import {
    getProviderDetails,
    getProviderForumPosts,
    getProviderScholarshipPrograms,
    getApplicantForumPosts,
    test
} from '../controllers/adminProfile.controller.js';

const router = express.Router();

router.post('/test', test);
router.get('/provider/:id', getProviderDetails);
router.get('/provider/:id/forum-posts', getProviderForumPosts); 
router.get('/provider/:id/scholarship-programs', getProviderScholarshipPrograms);
router.get('/applicant/:id/forum-posts', getApplicantForumPosts); // Add the new route

export default router;
import express from 'express';
import {
    getProviderDetails,
    getProviderForumPosts,
    getProviderScholarshipPrograms,
    test
} from '../controllers/adminProfile.controller.js';

const router = express.Router();

router.post('/test', test);
router.get('/provider/:id', getProviderDetails);
router.get('/provider/:id/forum-posts', getProviderForumPosts); 
router.get('/provider/:id/scholarship-programs', getProviderScholarshipPrograms);

export default router;
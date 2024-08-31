import express from "express";
import { editUserInfo, getForumPostsByUserId, getScholarshipProgramsByProviderId, getUserById, test } from '../controllers/profile.controller.js';

const router = express.Router();

router.get("/test", test);
router.get('/user/:id', getUserById);
router.get('/:id/scholarship-programs', getScholarshipProgramsByProviderId);
router.get('/forum-posts/:id', getForumPostsByUserId);
router.put('/user/:userId', editUserInfo);


export default router;
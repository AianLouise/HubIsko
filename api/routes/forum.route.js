import express from "express";
import { createPost, getPosts, addComment } from '../controllers/forum.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/post', verifyToken, createPost);
router.get('/posts', verifyToken, getPosts);
router.post('/comment/:postId', verifyToken, addComment);

export default router;

import express from "express";
import { createPost, getPosts, addComment, likePost, viewPost, likeComment } from '../controllers/forum.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/post', verifyToken, createPost);
router.get('/posts', verifyToken, getPosts);
router.post('/comment/:postId', verifyToken, addComment);
router.put('/like/:postId', verifyToken, likePost);
router.put('/view/:postId', verifyToken, viewPost);
router.put('/comment/like/:commentId', verifyToken, likeComment);

export default router;

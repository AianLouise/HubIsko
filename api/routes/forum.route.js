import express from "express";
import { 
  createPost, 
  getPosts, 
  addComment, 
  likePost, 
  likeComment, 
  getPostById, 
  getCommentById, 
  deleteComment
} from '../controllers/forum.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/post', verifyToken, createPost);
router.get('/posts', verifyToken, getPosts);
router.get('/view/:postId', verifyToken, getPostById);
router.post('/comment/:postId', verifyToken, addComment);
router.put('/like/:postId', verifyToken, likePost);
router.put('/comment/like/:commentId', verifyToken, likeComment);
router.get('/comment/:commentId', verifyToken, getCommentById);
router.delete('/comment/:commentId', verifyToken, deleteComment);

export default router;

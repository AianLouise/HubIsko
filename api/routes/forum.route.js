import express from "express";
import { 
  createPost, 
  getPosts, 
  addComment, 
  likePost, 
  likeComment, 
  getPostById, 
  getCommentById, 
  deleteComment,
  addReplyToComment
} from '../controllers/forum.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route to create a new post
router.post('/post', createPost);

// Route to get all posts
router.get('/posts', getPosts);

// Route to get a specific post by its ID
router.get('/view/:postId', getPostById);

// Route to add a comment to a specific post
router.post('/comment/:postId', verifyToken, addComment);

// Route to like a specific post
router.put('/like/:postId', verifyToken, likePost);

// Route to like a specific comment
router.put('/comment/like/:commentId', verifyToken, likeComment);

// Route to get a specific comment by its ID
router.get('/comment/:commentId', verifyToken, getCommentById);

// Route to delete a specific comment by its ID
router.delete('/comment/:commentId', verifyToken, deleteComment);

// Route for adding a reply to a comment
router.post('/comment/reply/:commentId', verifyToken, addReplyToComment);

export default router;

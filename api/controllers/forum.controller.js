import ForumPost from '../models/forumPost.model.js';
import Comment from '../models/comment.model.js';

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = new ForumPost({
      title,
      content,
      author: req.user.id
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('author', ['username', 'email']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const addComment = async (req, res) => {
  const { content } = req.body;
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    const newComment = new Comment({
      content,
      author: req.user.id,
      post: req.params.postId
    });
    const comment = await newComment.save();
    post.comments.push(comment.id);
    await post.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const viewPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    post.views += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (comment.likes.includes(req.user.id)) {
      comment.likes = comment.likes.filter(like => like.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
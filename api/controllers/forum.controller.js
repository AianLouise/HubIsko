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

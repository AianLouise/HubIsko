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
    const modifiedPosts = posts.map(post => ({
      ...post.toObject(),
      totalLikes: post.likes.length,
      totalComments: post.comments.length,
    }));

    res.json(modifiedPosts);
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

export const getPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId)
      .populate('author', ['username', 'email'])
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Assuming 'likes' is an array of user IDs who liked the post
    const totalLikes = post.likes.length;

    // Assuming 'comments' is populated, its length gives the total number of comments
    const totalComments = post.comments.length;

    // Access the 'views' field directly from the post object
    const totalViews = post.views;

    // Modify the response to include totalLikes, totalComments, and totalViews
    res.json({
      ...post.toObject(), // Convert the Mongoose document to a plain JavaScript object
      totalLikes,
      totalComments,
      totalViews // Include totalViews in the response
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate('author', ['username']);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Ensure the user is the author of the comment
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await comment.remove();

    // Remove the comment ID from the corresponding post's comments array
    const post = await ForumPost.findById(comment.post);
    if (post) {
      post.comments = post.comments.filter(commentId => commentId.toString() !== req.params.commentId);
      await post.save();
    }

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

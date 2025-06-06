import ForumPost from '../models/forumPost.model.js';
import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';
import ActivityLog from '../models/activityLog.model.js'; // Adjust the import path as necessary

export const createPost = async (req, res) => {
  const { title, content, author, attachmentUrls } = req.body;

  try {
    const newPost = new ForumPost({
      title,
      content,
      author,
      attachmentUrls, // Add attachmentUrls to the new post
    });

    const post = await newPost.save();

    // Create an activity log entry for creating a post
    const activityLog = new ActivityLog({
      userId: author,
      action: 'CREATE_POST',
      type: 'forum',
      details: `Post created with title: ${title}`
    });

    await activityLog.save();
    console.log('Activity log saved:', activityLog);

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('author', ['role', 'applicantDetails', 'scholarshipProviderDetails', 'email', 'profilePicture', 'username']);
    const modifiedPosts = posts.map(post => ({
      ...post.toObject(),
      totalLikes: post.likes.length,
      totalComments: post.comments.length,
      authorName: post.author.role === 'applicant'
        ? `${post.author.applicantDetails.firstName} ${post.author.applicantDetails.middleName ? post.author.applicantDetails.middleName.charAt(0) + '.' : ''} ${post.author.applicantDetails.lastName}`
        : post.author.role === 'admin'
          ? `${post.author.username}`
          : `${post.author.scholarshipProviderDetails.organizationName}`
    }));

    res.json(modifiedPosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId)
      .populate('author', [
        'applicantDetails.firstName',
        'applicantDetails.lastName',
        'applicantDetails.middleName',
        'scholarshipProviderDetails.organizationName',
        'email',
        'profilePicture',
        'role',
        'username' // Include username for admin
      ]) // Include firstName, lastName, middleName, organizationName, and username
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'author',
            select: 'applicantDetails.firstName applicantDetails.lastName applicantDetails.middleName scholarshipProviderDetails.organizationName profilePicture role username' // Include firstName, lastName, middleName, organizationName, and username
          },
          {
            path: 'replies',
            populate: {
              path: 'author',
              select: 'applicantDetails.firstName applicantDetails.lastName applicantDetails.middleName scholarshipProviderDetails.organizationName profilePicture role username' // Include firstName, lastName, middleName, organizationName, and username
            }
          }
        ]
      })
      .populate('attachmentUrls'); // Populate attachments

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Assuming 'likes' is an array of user IDs who liked the post
    const totalLikes = post.likes.length;

    // Assuming 'comments' is populated, its length gives the total number of comments
    const totalComments = post.comments.length;

    // Access the 'views' field directly from the post object
    const totalViews = post.views;

    // Modify the response to include totalLikes, totalComments, totalViews, and attachments
    res.json({
      ...post.toObject(), // Convert the Mongoose document to a plain JavaScript object
      totalLikes,
      totalComments,
      totalViews, // Include totalViews in the response
      attachments: post.attachmentUrls, // Include attachments in the response
      authorName: post.author.role === 'applicant'
        ? `${post.author.applicantDetails.firstName} ${post.author.applicantDetails.middleName ? post.author.applicantDetails.middleName.charAt(0) + '.' : ''} ${post.author.applicantDetails.lastName}`
        : post.author.role === 'admin'
          ? `${post.author.username}`
          : `${post.author.scholarshipProviderDetails.organizationName}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const addComment = async (req, res) => {
  const { content, attachmentUrls } = req.body; // Extract attachment URLs from the request body
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    const newComment = new Comment({
      content,
      author: req.user.id,
      post: req.params.postId,
      attachmentUrls // Include attachment URLs when creating a new comment
    });
    const comment = await newComment.save();
    post.comments.push(comment.id);
    await post.save();

    // Create an activity log entry for adding a comment
    const activityLog = new ActivityLog({
      userId: req.user.id,
      action: 'ADD_COMMENT',
      type: 'forum',
      details: `Comment added to post with title: ${post.title}`
    });

    await activityLog.save();
    console.log('Activity log saved:', activityLog);

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

    let action;
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
      action = 'UNLIKE_POST';
    } else {
      post.likes.push(req.user.id);
      action = 'LIKE_POST';
    }

    await post.save();

    // Create an activity log entry for liking or unliking a post
    const activityLog = new ActivityLog({
      userId: req.user.id,
      action: action,
      type: 'forum',
      details: `${action === 'LIKE_POST' ? 'Liked' : 'Unliked'} post with title: ${post.title}`
    });

    await activityLog.save();
    console.log('Activity log saved:', activityLog);

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

    let action;
    if (comment.likes.includes(req.user.id)) {
      comment.likes = comment.likes.filter(like => like.toString() !== req.user.id);
      action = 'UNLIKE_COMMENT';
    } else {
      comment.likes.push(req.user.id);
      action = 'LIKE_COMMENT';
    }

    await comment.save();

    // Create an activity log entry for liking or unliking a comment
    const activityLog = new ActivityLog({
      userId: req.user.id,
      action: action,
      type: 'forum',
      details: `${action === 'LIKE_COMMENT' ? 'Liked' : 'Unliked'} comment with content: ${comment.content}`
    });

    await activityLog.save();
    console.log('Activity log saved:', activityLog);

    res.json(comment);
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

export const addReplyToComment = async (req, res) => {
  try {
    const { commentId } = req.params; // Get the comment ID from the URL parameters
    const { content } = req.body; // Get the reply content from the request body
    if (!content) {
      return res.status(400).json({ msg: 'Reply content cannot be empty.' });
    }

    // Find the original comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Create a new reply comment
    const reply = new Comment({
      content,
      author: req.user.id,
      post: comment.post, // Associate the reply with the same post as the original comment
      createdAt: new Date()
    });

    // Save the reply comment
    const savedReply = await reply.save();

    // Add the reply's ID to the original comment's replies array
    comment.replies.push(savedReply._id);
    await comment.save();

    res.json({ msg: 'Reply added successfully', reply: savedReply });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Remove all comments associated with the post
    await Comment.deleteMany({ post: req.params.postId });

    // Remove the post
    await post.deleteOne();

    // Create an activity log entry for deleting the post
    const activityLog = new ActivityLog({
      userId: req.body.userId, // Use the userId from the request body
      action: 'DELETE_POST',
      type: 'forum',
      details: `Post with title: ${post.title} was deleted`
    });

    await activityLog.save();
    console.log('Activity log saved:', activityLog);

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] // Added line for replies
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;

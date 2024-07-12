import mongoose from 'mongoose';

const { Schema } = mongoose;

const ForumPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }
});

const ForumPost = mongoose.model('ForumPost', ForumPostSchema);

export default ForumPost;

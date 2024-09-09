import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  attachmentUrls: [{
    url: { type: String, required: true },
    fileType: { type: String, required: true },
    fileName: { type: String, required: true } // Add fileName field
  }], // Nested attachment schema
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
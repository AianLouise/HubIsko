import mongoose from 'mongoose';

const { Schema } = mongoose;

const ForumPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  attachmentUrls: [{
    url: { type: String, required: true },
    fileType: { type: String, required: true },
    fileName: { type: String, required: true } // Add fileName field
  }], // Nested attachment schema
  createdAt: { type: Date, default: Date.now }
});

const ForumPost = mongoose.model('ForumPost', ForumPostSchema);

export default ForumPost;
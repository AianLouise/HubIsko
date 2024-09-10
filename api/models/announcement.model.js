import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [replySchema] // Add this line
});

const announcementSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scholarshipProgram: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Posted', 'Deleted'], default: 'Posted' },
  comments: [commentSchema],
  likesCount: { type: Number, default: 0 }, // Add this line
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Add this line
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
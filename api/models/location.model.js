import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  region: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  barangay: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
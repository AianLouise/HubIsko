import mongoose from 'mongoose';

const ScholarshipProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be a positive number'],
  },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v > new Date(); // Ensure deadline is a future date
      },
      message: 'Deadline must be a future date.',
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },
}, { timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdated' } });

// Indexes (if needed)
ScholarshipProgramSchema.index({ provider: 1 });
ScholarshipProgramSchema.index({ deadline: 1 });

const Scholarship = mongoose.model('Scholarship', ScholarshipProgramSchema);

export default Scholarship;

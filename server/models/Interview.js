import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question:   { type: String, required: true },
  answer:     { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  type:       { type: String, enum: ['Technical', 'Behavioral', 'HR', 'System Design'], default: 'Technical' },
  tags:       [String],
  company:    { type: String, default: '' },
  starred:    { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
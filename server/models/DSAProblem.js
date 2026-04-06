import mongoose from 'mongoose';

const dsaSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:      { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags:       [String],
  platform:   { type: String, default: 'LeetCode' },
  notes:      { type: String, default: '' },
  url:        { type: String, default: '' },
  solvedAt:   { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('DSAProblem', dsaSchema);
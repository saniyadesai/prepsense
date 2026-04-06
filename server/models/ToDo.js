import mongoose from 'mongoose';

// Each "block" is one line in the Notion-style editor
const blockSchema = new mongoose.Schema({
  id:      { type: String, required: true },
  type:    { type: String, enum: ['heading', 'todo', 'text', 'divider'], default: 'text' },
  content: { type: String, default: '' },
  checked: { type: Boolean, default: false },
  order:   { type: Number, default: 0 },
});

const todoSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:   { type: String, required: true }, // stored as "2025-04-05"
  blocks: [blockSchema],
}, { timestamps: true });

// One page per user per date
todoSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Todo', todoSchema);
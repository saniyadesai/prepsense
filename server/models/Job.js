import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  name:   { type: String, default: '' },
  date:   { type: String, default: '' },
  result: { type: String, enum: ['Pending', 'Passed', 'Failed'], default: 'Pending' },
  notes:  { type: String, default: '' },
});

const jobSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company:   { type: String, required: true },
  role:      { type: String, required: true },
  status:    {
    type: String,
    enum: ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'],
    default: 'Wishlist'
  },
  ctc:       { type: String, default: '' },
  location:  { type: String, default: '' },
  applyDate: { type: String, default: '' },
  deadline:  { type: String, default: '' },
  link:      { type: String, default: '' },
  rounds:    [roundSchema],
  notes:     { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
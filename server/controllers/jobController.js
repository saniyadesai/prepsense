import Job from '../models/Job.js';

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, user: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id });
    res.json({
      total:     jobs.length,
      applied:   jobs.filter(j => j.status !== 'Wishlist').length,
      interview: jobs.filter(j => j.status === 'Interview').length,
      offer:     jobs.filter(j => j.status === 'Offer').length,
      rejected:  jobs.filter(j => j.status === 'Rejected').length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
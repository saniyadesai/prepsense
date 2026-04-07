import DSAProblem from '../models/DSAProblem.js';

// GET /api/dsa — get all problems for this user
export const getProblems = async (req, res) => {
  try {
    const problems = await DSAProblem
      .find({ user: req.user.id })
      .sort({ solvedAt: -1 }); // newest first
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/dsa — add a new problem
export const addProblem = async (req, res) => {
  try {
    const problem = await DSAProblem.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/dsa/:id — update a problem
export const updateProblem = async (req, res) => {
  try {
    const problem = await DSAProblem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // must belong to this user
      req.body,
      { new: true } // return the updated doc, not the old one
    );
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/dsa/:id — delete a problem
export const deleteProblem = async (req, res) => {
  try {
    await DSAProblem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dsa/heatmap — returns { "2025-04-05": 3, "2025-04-06": 1, ... }
export const getHeatmap = async (req, res) => {
  try {
    const problems = await DSAProblem.find({ user: req.user.id });
    const heatmap = {};
    problems.forEach(p => {
      const dateKey = new Date(p.solvedAt).toISOString().split('T')[0];
      heatmap[dateKey] = (heatmap[dateKey] || 0) + 1;
    });
    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dsa/stats
export const getStats = async (req, res) => {
  try {
    const problems = await DSAProblem.find({ user: req.user.id });
    const stats = {
      total:  problems.length,
      easy:   problems.filter(p => p.difficulty === 'Easy').length,
      medium: problems.filter(p => p.difficulty === 'Medium').length,
      hard:   problems.filter(p => p.difficulty === 'Hard').length,
    };

    // Calculate current streak
    const today = new Date().toISOString().split('T')[0];
    const solvedDates = [...new Set(
      problems.map(p => new Date(p.solvedAt).toISOString().split('T')[0])
    )].sort().reverse();

    let streak = 0;
    let checkDate = new Date();
    for (const date of solvedDates) {
      const check = checkDate.toISOString().split('T')[0];
      if (date === check) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (date < check) {
        break;
      }
    }
    stats.streak = streak;
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
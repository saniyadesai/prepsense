import Todo from '../models/Todo.js';

// GET /api/todos/:date — get or create a page for a specific date
export const getByDate = async (req, res) => {
  try {
    const { date } = req.params;
    let page = await Todo.findOne({ user: req.user.id, date });

    // If no page exists for this date, create an empty one
    if (!page) {
      page = await Todo.create({
        user: req.user.id,
        date,
        blocks: []
      });
    }
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/todos/:date — save all blocks for a date
export const saveBlocks = async (req, res) => {
  try {
    const { date } = req.params;
    const page = await Todo.findOneAndUpdate(
      { user: req.user.id, date },
      { blocks: req.body.blocks },
      { new: true, upsert: true } // upsert = create if doesn't exist
    );
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/todos/summary — get dates that have todos (for calendar dots)
export const getSummary = async (req, res) => {
  try {
    const pages = await Todo.find({ user: req.user.id }).select('date blocks');
    const summary = pages
      .filter(p => p.blocks.length > 0)
      .map(p => ({
        date:  p.date,
        total: p.blocks.filter(b => b.type === 'todo').length,
        done:  p.blocks.filter(b => b.type === 'todo' && b.checked).length,
      }));
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
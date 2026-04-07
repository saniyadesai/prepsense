import express from 'express';
import { getByDate, saveBlocks, getSummary } from '../controllers/todoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/summary', getSummary);
router.get('/:date',   getByDate);
router.put('/:date',   saveBlocks);

export default router;
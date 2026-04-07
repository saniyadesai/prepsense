import express from 'express';
import { getJobs, addJob, updateJob, deleteJob, getStats } from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/stats', getStats);
router.get('/',      getJobs);
router.post('/',     addJob);
router.put('/:id',   updateJob);
router.delete('/:id',deleteJob);

export default router;
import express from 'express';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/',      getQuestions);
router.post('/',     addQuestion);
router.put('/:id',   updateQuestion);
router.delete('/:id',deleteQuestion);

export default router;
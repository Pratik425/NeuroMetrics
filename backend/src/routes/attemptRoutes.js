import express from 'express';
import { startAttempt, submitAttempt, getUserAttempts } from '../controllers/attemptController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', startAttempt);
router.post('/:id/submit', submitAttempt);
router.get('/my-attempts', getUserAttempts);

export default router;

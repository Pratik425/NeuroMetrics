import express from 'express';
import { createTest, getTests, getTestById } from '../controllers/testController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getTests)
  .post(protect, authorize('admin', 'tester'), createTest);

router.route('/:id')
  .get(getTestById);

export default router;

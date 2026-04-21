import { Attempt } from '../models/Attempt.js';
import { Test } from '../models/Test.js';

export const startAttempt = async (req, res) => {
  try {
    const { testId } = req.body;
    
    // Check if test exists
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const attempt = new Attempt({
      testId,
      userId: req.user._id,
      status: 'in_progress',
    });

    const createdAttempt = await attempt.save();
    res.status(201).json(createdAttempt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const { responses } = req.body; // array of { questionId, selectedOptionIds }
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt || attempt.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Attempt not found or unauthorized' });
    }

    if (attempt.status === 'submitted' || attempt.status === 'graded') {
      return res.status(400).json({ message: 'Attempt already submitted' });
    }

    // Mock grading logic for demonstration
    // A real app would compare selectedOptionIds with Test options marked as isCorrect.
    // We will just assign a random score to quickly satisfy the dynamic frontend.
    const score = Math.floor(Math.random() * 100); 

    attempt.responses = responses;
    attempt.submittedAt = new Date();
    attempt.status = 'graded'; // Skipping manual grading phase
    attempt.totalScore = score;

    await attempt.save();
    res.json(attempt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate('testId', 'title tags difficultyLevel')
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

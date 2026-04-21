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

    // Grade the attempt based on exact question matches
    const test = await Test.findById(attempt.testId);
    let totalScore = 0;
    let maxScorable = 0;

    // Load available questions into memory
    const qMap = {};
    if (test && test.sections) {
      test.sections.forEach(sec => {
        sec.questions.forEach(q => {
          qMap[q._id.toString()] = q;
        });
      });
    }

    // Evaluate
    responses.forEach(res => {
      if (!res.questionId) return;
      const q = qMap[res.questionId.toString()];
      if (q) {
        maxScorable += q.maxScore || 1;
        
        if (q.type === 'scmcq' || q.type === 'mcmcq') {
          // Compare options
          const correctOptionIds = q.options.filter(o => o.isCorrect).map(o => o._id.toString());
          const selected = res.selectedOptionIds || [];
          const isCorrect = selected.length > 0 && 
                            selected.every(id => correctOptionIds.includes(id.toString())) && 
                            selected.length === correctOptionIds.length;
          
          if (isCorrect) totalScore += q.maxScore || 1;
        } else {
          // Textual validation
          const userAns = typeof res.answerText === 'string' ? res.answerText.trim().toLowerCase() : '';
          const correctAns = typeof q.ans === 'string' ? q.ans.trim().toLowerCase() : '';
          if (correctAns && userAns === correctAns) {
            totalScore += q.maxScore || 1;
          }
        }
      }
    });

    const score = maxScorable > 0 ? Math.round((totalScore / maxScorable) * 100) : 0;

    attempt.responses = responses;
    attempt.submittedAt = new Date();
    attempt.status = 'graded'; 
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

import mongoose from 'mongoose';
import { Test } from './src/models/Test.js';
import dotenv from 'dotenv';
dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neurometrics');
    await Test.deleteMany({});
    
    const mockTests = [
      {
        title: 'Cognitive Baseline Test',
        description: 'A general baseline assessment consisting of logic and math.',
        duration: 1800,
        tags: ['general', 'baseline'],
        difficultyLevel: 'easy',
        sections: [
          {
            title: 'General',
            orderIndex: 0,
            questions: [
              { text: 'Identify the pattern that logically completes the sequence: 2, 4, 8, 16...', type: 'scmcq', options: [{text: '24'}, {text:'32'}, {text:'64'}, {text:'18'}] },
              { text: 'What is the sum of 12 and 15?', type: 'scmcq', options: [{text: '27'}, {text:'28'}, {text:'26'}, {text:'29'}] },
              { text: 'Which cognitive domain primarily involves working memory?', type: 'scmcq', options: [{text: 'Motor Skills'}, {text:'Executive Function'}, {text:'Visual Perception'}, {text:'Auditory Processing'}] },
              { text: 'Explain briefly what "semantic memory" is.', type: 'text' },
              { text: 'Select the odd one out:', type: 'scmcq', options: [{text: 'Apple'}, {text:'Banana'}, {text:'Carrot'}, {text:'Mango'}] }
            ]
          }
        ]
      },
      {
        title: 'Advanced Pattern Recognition',
        description: 'Hard pattern logics and visual acuity.',
        duration: 2400,
        tags: ['pattern', 'logic'],
        difficultyLevel: 'hard',
        sections: [
          {
            title: 'Pattern Phase 1',
            orderIndex: 0,
            questions: [
              { text: 'Complete the sequence: 1, 1, 2, 3, 5, 8, ...', type: 'text' },
              { text: 'If A=1, B=2, what is the numerical value of "CAB"?', type: 'scmcq', options: [{text: '312'}, {text:'213'}, {text:'415'}, {text:'123'}] },
              { text: 'Which of the following is not a prime number?', type: 'scmcq', options: [{text: '13'}, {text:'17'}, {text:'21'}, {text:'23'}] },
              { text: 'A bat and a ball cost $1.10. The bat costs $1.00 more than the ball. How much does the ball cost?', type: 'scmcq', options: [{text: '$0.10'}, {text:'$0.05'}, {text:'$1.05'}, {text:'$0.15'}] },
              { text: 'List 3 ways a cognitive test can be scientifically validated.', type: 'text' }
            ]
          }
        ]
      },
      {
        title: 'Memory Retention Beta',
        description: 'Short memory assessment.',
        duration: 900,
        tags: ['memory', 'beta'],
        difficultyLevel: 'medium',
        sections: [
          {
            title: 'Retention',
            orderIndex: 0,
            questions: [
              { text: 'Memorize these words: Cat, Tree, Box. What was the second word?', type: 'scmcq', options: [{text: 'Cat'}, {text:'Box'}, {text:'Tree'}, {text:'Car'}] },
              { text: 'What color is typically universally associated with "stop"?', type: 'text' },
              { text: 'In the acronym "MRI", what does the M stand for?', type: 'scmcq', options: [{text: 'Magnetic'}, {text:'Medical'}, {text:'Mental'}, {text:'Memory'}] },
              { text: 'Recall the first word from the first question of this test.', type: 'text' },
              { text: 'Is short-term memory the same as working memory? Explain.', type: 'text' }
            ]
          }
        ]
      },
      {
        title: 'Multimedia Sensory Test',
        description: 'Test containing audio and image recognition tasks.',
        duration: 1200,
        tags: ['sensory', 'multimedia'],
        difficultyLevel: 'medium',
        sections: [
          {
            title: 'Visual & Auditory Processing',
            orderIndex: 0,
            questions: [
              {
                text: 'What animal is shown in the image?',
                type: 'text',
                mediaUrls: ['https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg']
              },
              {
                text: 'What object commonly makes this sound? (Type your answer)',
                type: 'text',
                mediaUrls: ['https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3']
              },
              {
                text: 'Which musical instrument is prominently heard? (Select option)',
                type: 'scmcq',
                mediaUrls: ['https://assets.mixkit.co/active_storage/sfx/2281/2281-preview.mp3'],
                options: [{text: 'Piano'}, {text: 'Guitar'}, {text: 'Violin'}, {text: 'Flute'}]
              }
            ]
          }
        ]
      }
    ];

    await Test.insertMany(mockTests);
    console.log('Database seeded with 3 tests (5 questions each).');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();

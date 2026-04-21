import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send } from 'lucide-react';
import api from '../utils/api';
import './TestFeedback.css';

const TestFeedback = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mock or send genuine API Call
      // await api.post('/reviews', { testId, rating, feedback });
      alert('Thank you for your feedback! Your rank is updating...');
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feedback-container">
      <div className="glass-panel feedback-panel">
        
        <div className="feedback-icon-wrapper">
          <Star color="var(--accent-primary)" size={48} />
        </div>
        
        <h2 className="feedback-title">Test Completed!</h2>
        <p className="feedback-subtitle">
          How would you rate the quality and difficulty of this cognitive assessment?
        </p>

        <form onSubmit={handleSubmit}>
          
          <div className="rating-container">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                  <button
                  type="button"
                  key={index}
                  className="star-btn"
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                  onClick={() => setRating(index)}
                >
                  <Star 
                    size={40} 
                    fill={index <= (hover || rating) ? "var(--accent-secondary)" : "transparent"}
                    color={index <= (hover || rating) ? "var(--accent-secondary)" : "var(--glass-border)"}
                  />
                </button>
              );
            })}
          </div>

          <textarea
            className="glass-input feedback-textarea"
            rows="4"
            placeholder="Any additional feedback? (Optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>

          <button type="submit" className="btn-primary submit-feedback-btn" disabled={rating === 0}>
            <Send size={20} /> Submit Feedback
          </button>
        </form>

      </div>
    </div>
  );
};

export default TestFeedback;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Play } from 'lucide-react';
import './TestLibrary.css';

const TestLibrary = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now we'll mock if API fails, but attempt to fetch
    api.get('/tests')
      .then(res => {
        setTests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        // Fallback mock
        setTests([
          { _id: '1', title: 'Cognitive Baseline Test', difficultyLevel: 'medium', tags: ['general', 'baseline'], duration: 1800 },
          { _id: '2', title: 'Advanced Pattern Recognition', difficultyLevel: 'hard', tags: ['pattern', 'logic'], duration: 2400 },
          { _id: '3', title: 'Memory Retention Beta', difficultyLevel: 'easy', tags: ['memory', 'beta'], duration: 900 },
        ]);
      });
  }, []);

  return (
    <div>
      <div className="library-header">
        <div>
          <h1 className="library-title">Assessment Library</h1>
          <p>Select a cognitive test to begin your session.</p>
        </div>
        <div className="library-actions">
          <div className="search-container">
            <Search size={20} color="var(--text-secondary)" className="search-icon" />
            <input type="text" className="glass-input search-input" placeholder="Search tests..." />
          </div>
          <button className="btn-secondary filter-btn">
            <Filter size={20} /> Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-text">Loading tests...</div>
      ) : (
        <div className="grid grid-cols-3">
          {tests.map(test => (
            <div key={test._id} className="glass-card test-card">
              <div className="test-card-header">
                <span className={`difficulty-badge difficulty-${test.difficultyLevel || 'medium'}`}>
                  {test.difficultyLevel || 'medium'}
                </span>
                <span className="test-duration">
                  {test.duration ? Math.round(test.duration/60) + ' min' : ''}
                </span>
              </div>
              
              <h3 className="test-title">{test.title}</h3>
              
              <div className="test-tags">
                {test.tags?.map(tag => (
                  <span key={tag} className="test-tag">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <Link to={`/tests/${test._id}`} className="btn-primary start-attempt-btn">
                <Play size={18} /> Start Attempt
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestLibrary;

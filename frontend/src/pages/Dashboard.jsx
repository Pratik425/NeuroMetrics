import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Activity, BarChart2, Award, Clock } from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [attempts, setAttempts] = useState([]);
  const [globalScore, setGlobalScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user attempts
    api.get('/attempts/my-attempts')
      .then(res => {
        const data = res.data;
        setAttempts(data);
        
        // Calculate dynamic global score (average of graded tests)
        const gradedAttempts = data.filter(a => a.status === 'graded' && a.totalScore != null);
        if (gradedAttempts.length > 0) {
          const total = gradedAttempts.reduce((sum, a) => sum + a.totalScore, 0);
          setGlobalScore((total / gradedAttempts.length).toFixed(1));
        } else {
          setGlobalScore(0);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, <span className="dashboard-user-name">{user?.name}</span></h1>
        <p>Here is your dynamic cognitive performance overview based on your history.</p>
      </div>

      {loading ? <p>Loading stats...</p> : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-3 dashboard-stats-grid">
            <div className="glass-card stat-card-content">
              <div className="stat-icon-wrapper stat-icon-emerald">
                <Activity color="var(--accent-primary)" size={24} />
              </div>
              <div>
                <h3 className="stat-title">Global Avg Score</h3>
                <p className="stat-value">{globalScore}%</p>
              </div>
            </div>
            
            <div className="glass-card stat-card-content">
              <div className="stat-icon-wrapper stat-icon-purple">
                <Award color="var(--accent-secondary)" size={24} />
              </div>
              <div>
                <h3 className="stat-title">Tests Completed</h3>
                <p className="stat-value">
                  {attempts.filter(a => a.status === 'graded').length}
                </p>
              </div>
            </div>

            <div className="glass-card stat-card-content">
              <div className="stat-icon-wrapper stat-icon-blue">
                <Clock color="#38BDF8" size={24} />
              </div>
              <div>
                <h3 className="stat-title">Active Tests</h3>
                <p className="stat-value">
                  {attempts.filter(a => a.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="glass-panel dashboard-panel">
              <h2 className="panel-title">
                <BarChart2 size={24} color="var(--accent-primary)"/> Score History Graph
              </h2>
              <div className="graph-container">
                {attempts.filter(a => a.status === 'graded').slice(0, 5).map((a, idx) => (
                  <div key={idx} className={`graph-bar ${idx % 2 === 0 ? 'graph-bar-primary' : 'graph-bar-secondary'}`} style={{ 
                    height: `${a.totalScore}%` 
                  }}>{a.totalScore}</div>
                ))}
                {attempts.filter(a=> a.status === 'graded').length === 0 && <p className="empty-text">No graded attempts to map.</p>}
              </div>
            </div>

            <div className="glass-panel dashboard-panel">
              <h2 style={{ marginBottom: '24px' }}>Recent Activity</h2>
              <div className="activity-list">
                {attempts.length === 0 && <p className="empty-text">No recent activity.</p>}
                
                {attempts.slice(0, 3).map(a => (
                  <div key={a._id} className="activity-item">
                    <div>
                      <h4 className="activity-title">{a.testId?.title}</h4>
                      <p className="activity-date">{a.status === 'graded' ? 'Completed' : 'In Progress'} - {new Date(a.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="activity-score">
                      {a.status === 'graded' ? `${a.totalScore}%` : '-'}
                    </div>
                  </div>
                ))}
                
                <Link to="/tests" className="btn-primary take-test-btn">
                  Take New Test
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

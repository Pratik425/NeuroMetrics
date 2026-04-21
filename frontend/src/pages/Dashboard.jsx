import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Activity, BarChart2, Award, Clock } from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group to get only the most recent attempt per unique test
  const uniqueAttempts = attempts.filter((v, i, a) =>
    a.findIndex(t => (t.testId?._id || t.testId) === (v.testId?._id || v.testId)) === i
  );

  useEffect(() => {
    api.get('/attempts/my-attempts')
      .then(res => {
        setAttempts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const completedTestIds = new Set(attempts.filter(a => a.status === 'graded').map(a => a.testId?._id));
  const activeTestIds = new Set(attempts.filter(a => a.status === 'in_progress' && !completedTestIds.has(a.testId?._id)).map(a => a.testId?._id));

  const recentActivity = [];
  const seenTestIds = new Set();
  attempts.forEach(a => {
    const tId = a.testId?._id;
    if (!seenTestIds.has(tId)) {
      if (a.status === 'graded' || !completedTestIds.has(tId)) {
        recentActivity.push(a);
        seenTestIds.add(tId);
      }
    }
  });

  const gradedAttempts = attempts.filter(a => a.status === 'graded' && a.totalScore != null);
  const globalScore = gradedAttempts.length > 0
    ? (gradedAttempts.reduce((sum, a) => sum + a.totalScore, 0) / gradedAttempts.length).toFixed(1)
    : 0;

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
                <h3 className="stat-title">Average Score</h3>
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
                  {gradedAttempts.length}
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
                  {activeTestIds.size}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="glass-panel dashboard-panel">
              <h2 className="panel-title">
                <BarChart2 size={24} color="var(--accent-primary)" /> Score History Graph
              </h2>
              <div className="graph-container">
                {[...gradedAttempts].slice(0, 5).reverse().map((a, idx) => (
                  <div key={idx} className={`graph-bar ${idx % 2 === 0 ? 'graph-bar-primary' : 'graph-bar-secondary'}`} style={{
                    height: `${a.totalScore}%`
                  }}>{a.totalScore}</div>
                ))}
                {gradedAttempts.length === 0 && <p className="empty-text">No graded attempts to map.</p>}
              </div>
            </div>

            <div className="glass-panel dashboard-panel">
              <h2 style={{ marginBottom: '24px' }}>Recent Activity</h2>
              <div className="activity-list">
                {uniqueAttempts.length === 0 && <p className="empty-text">No recent activity.</p>}

                {attempts.slice(0, 3).map(a => (
                  <div key={a._id} className="activity-item">
                    <div>
                      <h4 className="activity-title">{a.testId?.title || 'Unknown / Deleted Test'}</h4>
                      <p className="activity-date">{a.status === 'graded' ? 'Completed' : 'In Progress'} - {new Date(a.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="activity-score">
                      {a.status === 'graded' ? `100%` : '-'}
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

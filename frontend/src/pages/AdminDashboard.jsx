import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, FileX, MessageSquare, Trash2, ShieldAlert } from 'lucide-react';
import api from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('scores');
  
  const [attempts, setAttempts] = useState([]);
  const [tests, setTests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (user?.type !== 'admin') return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [attRes, testRes, feedRes] = await Promise.all([
        api.get('/attempts'),
        api.get('/tests'),
        api.get('/reviews')
      ]);
      setAttempts(attRes.data);
      setTests(testRes.data);
      setFeedbacks(feedRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test? All active attempts pointing to it will lose their references.")) return;
    try {
      await api.delete(`/tests/${id}`);
      setTests(tests.filter(t => t._id !== id));
    } catch (err) {
      alert("Failed to delete test.");
    }
  };

  if (user?.type !== 'admin') {
    return <Navigate to="/" />;
  }

  const renderScoresContent = () => (
    <table className="admin-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Test Name</th>
          <th>Status</th>
          <th>Final Score</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {attempts.map(a => (
          <tr key={a._id}>
            <td>
              <div className="flex-col">
                <span className="bold block">{a.userId?.name || 'Unknown'}</span>
                <span className="small text-muted">{a.userId?.email}</span>
              </div>
            </td>
            <td>{a.testId?.title || <span className="warning">Deleted Test</span>}</td>
            <td>
              <span className={`status-badge status-${a.status}`}>{a.status.replace('_', ' ')}</span>
            </td>
            <td className="score-val">{a.totalScore != null ? `${a.totalScore}%` : '-'}</td>
            <td>{new Date(a.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
        {attempts.length === 0 && <tr><td colSpan="5">No attempts found.</td></tr>}
      </tbody>
    </table>
  );

  const renderTestsContent = () => (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Tag / Difficulty</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tests.map(t => (
          <tr key={t._id}>
            <td>{t.title} <span className="small text-muted block">ID: {t._id}</span></td>
            <td>
              <div>{t.difficultyLevel}</div>
              <div className="small text-muted">{(t.tags || []).join(', ')}</div>
            </td>
            <td>{t.isActive ? 'Active' : 'Draft'}</td>
            <td>
              <button className="del-btn" onClick={() => handleDeleteTest(t._id)}>
                <Trash2 size={16} /> Delete
              </button>
            </td>
          </tr>
        ))}
        {tests.length === 0 && <tr><td colSpan="4">No tests configured.</td></tr>}
      </tbody>
    </table>
  );

  const renderFeedbackContent = () => (
    <div className="feedback-grid">
      {feedbacks.map(f => (
        <div key={f._id} className="feedback-card">
          <div className="fb-header">
            <h4 className="bold m-0">{f.testId?.title || 'Unknown Test'}</h4>
            <div className="stars">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
          </div>
          <div className="fb-author text-muted small">{f.userId?.name} ({f.userId?.email})</div>
          <p className="fb-text mt-3">{f.feedback || <i>No text feedback provided.</i>}</p>
          <div className="small text-muted mt-2">{new Date(f.createdAt).toLocaleDateString()}</div>
        </div>
      ))}
      {feedbacks.length === 0 && <p className="text-muted">No feedbacks submitted yet.</p>}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>
          <ShieldAlert color="var(--accent-primary)" size={32} style={{ display:'inline', verticalAlign: 'bottom', marginRight: '10px' }} />
          Administrative Panel
        </h1>
        <p>Global oversight of assessment performance, test parameters, and user sentiment.</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'scores' ? 'active' : ''}`}
          onClick={() => setActiveTab('scores')}
        >
          <Users size={20} /> All Scores
        </button>
        <button 
          className={`admin-tab ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          <FileX size={20} /> Manage Tests
        </button>
        <button 
          className={`admin-tab ${activeTab === 'feedbacks' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedbacks')}
        >
          <MessageSquare size={20} /> Feedbacks
        </button>
      </div>

      <div className="admin-content-panel">
        {activeTab === 'scores' && renderScoresContent()}
        {activeTab === 'tests' && renderTestsContent()}
        {activeTab === 'feedbacks' && renderFeedbackContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;

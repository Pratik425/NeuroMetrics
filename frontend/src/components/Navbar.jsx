import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo-link">
          <BrainCircuit color="var(--accent-primary)" size={28} />
          <h2 className="navbar-logo-text">
            NeuroMetrics
          </h2>
        </Link>
        
        {user && (
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Dashboard</Link>
            <Link to="/tests" className="navbar-link">Tests</Link>
            {user.type === 'admin' && (
              <Link to="/admin" className="navbar-link" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="btn-secondary navbar-logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

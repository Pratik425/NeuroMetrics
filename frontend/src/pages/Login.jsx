import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/');
    } catch (error) {
      alert('Authentication failed!');
    }
  };

  return (
    <div className="login-container">
      <div className="glass-panel login-panel">
        <h2 className="login-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="login-subtitle">
          {isLogin ? 'Enter your details to access your dashboard' : 'Join NeuroMetrics today'}
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
            />
          )}
          <input 
            type="email" 
            className="glass-input" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            className="glass-input" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <button type="submit" className="btn-primary login-submit-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="login-footer-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            className="login-toggle-link"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

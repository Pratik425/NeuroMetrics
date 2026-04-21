import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TestLibrary from './pages/TestLibrary';
import TestRunner from './pages/TestRunner';
import TestFeedback from './pages/TestFeedback';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/tests" element={<PrivateRoute><TestLibrary /></PrivateRoute>} />
            <Route path="/tests/:id" element={<PrivateRoute><TestRunner /></PrivateRoute>} />
            <Route path="/feedback/:testId" element={<PrivateRoute><TestFeedback /></PrivateRoute>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

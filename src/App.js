import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './components/Register';
import ClientLogin from './components/Login';
import MainAdminLogin from './components/MainAdminLogin';
import ReceptionistLogin from './components/ReceptionistLogin';
import ClientDashboard from './components/ClientDashboard';
import MainAdminDashboard from './components/MainAdminDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  // Initialize from localStorage to persist login across refresh
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');

  // Sync role and token in localStorage whenever they change
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');

    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [token, role]);

  const handleLogout = () => {
    setToken('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <Router>
      <nav>
        {!token && (
          <>
            <Link to="/login/client">Client Login</Link> |{' '}
            <Link to="/login/main-admin">Main Admin Login</Link> |{' '}
            <Link to="/login/receptionist">Receptionist Login</Link>
          </>
        )}

        {token && role === 'client' && (
          <Link to="/client/dashboard">Client Dashboard</Link>
        )}

        {token && role === 'main-admin' && (
          <Link to="/admin/main">Main Admin Dashboard</Link>
        )}

        {token && role === 'receptionist' && (
          <Link to="/admin/reception">Receptionist Dashboard</Link>
        )}

        {token && (
          <button onClick={handleLogout} style={{ marginLeft: '20px' }}>
            Logout
          </button>
        )}
      </nav>

      <div className="container">
        <Routes>
          {/* Registration */}
          <Route path="/register" element={<Register />} />

          {/* Login Pages */}
          <Route
            path="/login/client"
            element={<ClientLogin setToken={setToken} setRole={setRole} />}
          />
          <Route
            path="/login/main-admin"
            element={<MainAdminLogin setToken={setToken} setRole={setRole} />}
          />
          <Route
            path="/login/receptionist"
            element={<ReceptionistLogin setToken={setToken} setRole={setRole} />}
          />

          {/* Protected Dashboards */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute token={token} role={role} allowedRole="client">
                <ClientDashboard token={token} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/main"
            element={
              <ProtectedRoute token={token} role={role} allowedRole="main-admin">
                <MainAdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reception"
            element={
              <ProtectedRoute token={token} role={role} allowedRole="receptionist">
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect based on role */}
          <Route
            path="*"
            element={
              token ? (
                role === 'client' ? <Navigate to="/client/dashboard" /> :
                role === 'main-admin' ? <Navigate to="/admin/main" /> :
                role === 'receptionist' ? <Navigate to="/admin/reception" /> :
                <Navigate to="/login/client" />
              ) : (
                <Navigate to="/login/client" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

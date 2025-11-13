import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function MainAdminLogin({ setToken, setRole }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: form.email.trim(),
        password: form.password,
      });

      const { token, user } = res.data;

      // Enforce main-admin only
      if (user.role !== 'main-admin') {
        setMsg('Access denied. Main Admin only.');
        return;
      }

      // Save auth state
      setToken(token);
      setRole(user.role);
      localStorage.setItem('role', user.role);

      setMsg('Welcome, Main Admin! Redirecting...');

      setTimeout(() => {
        navigate('/admin/main');
      }, 1000);
    } catch (err) {
      const error = err.response?.data?.msg || 'Invalid credentials';
      setMsg(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Help Icon */}
      <div className="help-icon" title="Main Admin Portal">
        Crown
      </div>

      {/* Logo */}
      <div className="login-logo">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="login-title">Main Admin</h1>

      {/* Message */}
      {msg && (
        <p
          className={`login-message ${
            msg.includes('Welcome') || msg.includes('Redirecting')
              ? 'success'
              : 'error'
          }`}
        >
          {msg}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <label className="login-label">Email</label>
        <input
          name="email"
          type="email"
          className="login-input"
          placeholder="admin@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="username"
          disabled={loading}
        />

        <label className="login-label">Password</label>
        <input
          name="password"
          type="password"
          className="login-input"
          placeholder="Enter master password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          disabled={loading}
        />

        <button
          type="submit"
          className="login-button"
          disabled={loading}
          style={{
            background: loading
              ? '#a0aec0'
              : 'linear-gradient(135deg, #9f7aea, #6c5ce7)',
          }}
        >
          {loading ? 'Verifying...' : 'Enter Admin Zone'}
        </button>
      </form>

      {/* Links */}
      <div className="login-links">
        <Link to="/login" className="forgot-password">
          Back to User Login
        </Link>
      </div>
    </div>
  );
}
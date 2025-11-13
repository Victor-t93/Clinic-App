import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'

export default function ReceptionistLogin({ setToken, setRole }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg('');
  };

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

      // ✅ Enforce receptionist role only
      if (user.role !== 'receptionist') {
        setMsg('Access denied. Receptionist login only.');
        setLoading(false);
        return;
      }

      // ✅ Save auth state (critical fix)
      setToken(token);
      setRole(user.role);
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      setMsg('Welcome, Receptionist! Loading your dashboard...');

      setTimeout(() => {
        navigate('/admin/reception');
      }, 1000);
    } catch (err) {
      const error = err.response?.data?.msg || 'Invalid login credentials';
      setMsg(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Help Icon */}
      <div className="help-icon" title="Receptionist Portal">
        🛎️ Desk Bell
      </div>

      {/* Logo */}
      <div className="login-logo">
        <svg viewBox="0 0 24 24" aria-hidden="true" width="64" height="64">
          <path
            d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="#10b981"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="login-title">Receptionist Login</h1>

      {/* Message */}
      {msg && (
        <p
          className={`login-message ${
            msg.toLowerCase().includes('welcome') ||
            msg.toLowerCase().includes('loading')
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
          placeholder="reception@clinic.com"
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
          placeholder="Enter your password"
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
              : 'linear-gradient(135deg, #34d399, #10b981)',
          }}
        >
          {loading ? 'Checking In...' : 'Enter Reception'}
        </button>
      </form>

      {/* Links */}
      <div className="login-links">
        <Link to="/login" className="forgot-password">
          ⬅ Back to Main Login
        </Link>
      </div>
    </div>
  );
}

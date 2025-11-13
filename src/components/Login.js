import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './ClientDashboard.css'

export default function ClientLogin({ setToken, setRole }) {
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
        password: form.password.trim(),
      });

      const { token, user } = res.data;

      // Ensure only clients can login here
      if (user.role !== 'client') {
        setMsg('Access denied. Please use the correct portal.');
        return;
      }

      // Save token and role both in state and localStorage
      setToken(token);
      setRole(user.role);
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      setMsg('Login successful! Redirecting...');
      setTimeout(() => navigate('/client/dashboard'), 800);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Invalid email or password';
      setMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Help Icon */}
      <div className="help-icon" title="Need help?">
        ?
      </div>

      {/* Logo */}
      <div className="login-logo">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="login-title">
        Alimponya Alivaawa <br />Clinic
      </h1>

      {/* Message */}
      {msg && (
        <p
          className={`login-message ${
            msg.includes('successful') ? 'success' : 'error'
          }`}
        >
          {msg}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <label className="login-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="login-input"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="username"
          disabled={loading}
        />

        <label className="login-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="login-input"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          disabled={loading}
        />

        <button
          type="submit"
          className="login-button"
          disabled={loading || !form.email || !form.password}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Links */}
      <div className="login-links">
        <Link to="/register">Don’t have an account? Sign Up</Link>
        <Link to="/forgot" className="forgot-password">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Register({ setToken, setRole }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setMsg(res.data.msg || 'Registration successful');

      // Auto-login if backend returns token
      if (res.data.token && res.data.user) {
        setToken(res.data.token);
        setRole(res.data.user.role);
        localStorage.setItem('role', res.data.user.role);
        setTimeout(() => navigate('/booking'), 800);
      } else {
        setTimeout(() => navigate('/login'), 1200);
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="login-container">
      <div className="help-icon">?</div>

      <div className="login-logo">
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      <h1 className="login-title">Alimponya Alivaawa <br></br>Clinic</h1>

      {msg && (
        <p className={`login-message ${msg.includes('Error') ? 'error' : 'success'}`}>
          {msg}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label className="login-label">Name</label>
        <input
          name="name"
          className="login-input"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
        />

        <label className="login-label">Email</label>
        <input
          name="email"
          type="email"
          className="login-input"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />

        <label className="login-label">Password</label>
        <input
          name="password"
          type="password"
          className="login-input"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" className="login-button">
          Register
        </button>
      </form>

      <div className="login-links">
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
}
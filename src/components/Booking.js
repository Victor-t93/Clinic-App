import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Booking({ token }) {
  const [form, setForm] = useState({ date: '', time: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/bookings', form, { headers: { Authorization: `Bearer ${token}` } });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" name="date" onChange={handleChange} required />
        <input type="time" name="time" onChange={handleChange} required />
        <button type="submit">Book</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

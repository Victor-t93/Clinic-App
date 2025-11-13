import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function AdminDashboard({ token }) {
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error fetching bookings');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(res.data.msg);
      fetchBookings(); // refresh list
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error updating status');
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get('/bookings/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error fetching bookings');
    }
  };

  if (token) fetchData();
}, [token]); // fetchData is inside useEffect, so no missing dependency


  return (
    <div>
      <h2>Admin Dashboard</h2>
      {msg && <p>{msg}</p>}
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.user?.name} ({b.user?.email})</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.status}</td>
                <td>{b.doctor}</td>
                <td>
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(b._id, 'approved')}>Approve</button>
                      <button onClick={() => updateStatus(b._id, 'cancelled')}>Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

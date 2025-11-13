import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig"; // baseURL = /api/admin
import './ClientDashboard.css';

export default function MainAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [message, setMessage] = useState("");

  // =====================
  // FETCH DATA ON MOUNT
  // =====================
  useEffect(() => {
    fetchUsers();
    fetchBookings();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get("admin/users"); // /api/admin/users
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch users");
    }
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await api.get("admin/bookings"); // /api/admin/bookings
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch bookings");
    }
  };

  // =====================
  // USER ACTIONS
  // =====================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setMessage("User deleted successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete user");
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await api.patch(`admin/users/${id}`, { role });
      setUsers(users.map(u => (u._id === id ? { ...u, role } : u)));
      setMessage(`User role updated to ${role}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update role");
    }
  };

  // =====================
  // BOOKING ACTIONS
  // =====================
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`admin/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
      setMessage("Booking deleted successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete booking");
    }
  };

  const updateBookingStatus = async (id, status) => {
    if (!["pending", "approved", "completed", "cancelled"].includes(status)) return;
    try {
      await api.patch(`admin/bookings/${id}`, { status });
      setBookings(bookings.map(b => (b._id === id ? { ...b, status } : b)));
      setMessage(`Booking marked as ${status}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update booking status");
    }
  };

  // =====================
  // RENDER
  // =====================
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>Bookings</li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <h1>{activeTab === "bookings" ? "Booking Management" : "User Management"}</h1>
        {message && <p className="message">{message}</p>}

        {/* USERS TABLE */}
        {activeTab === "users" && (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button className="btn success" onClick={() => updateUserRole(u._id, "client")}>Client</button>
                      <button className="btn success" onClick={() => updateUserRole(u._id, "main-admin")}>Admin</button>
                      <button className="btn success" onClick={() => updateUserRole(u._id, "receptionist")}>Receptionist</button>
                      <button className="btn danger" onClick={() => deleteUser(u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BOOKINGS TABLE */}
        {activeTab === "bookings" && (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td>{b.user?.name || "N/A"}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td><span className={`status ${b.status}`}>{b.status}</span></td>
                    <td>
                      <button className="btn success" onClick={() => updateBookingStatus(b._id, "approved")}>Approve</button>
                      <button className="btn warning" onClick={() => updateBookingStatus(b._id, "pending")}>Pending</button>
                      <button className="btn success" onClick={() => updateBookingStatus(b._id, "completed")}>Complete</button>
                      <button className="btn warning" onClick={() => updateBookingStatus(b._id, "cancelled")}>Cancel</button>
                      <button className="btn danger" onClick={() => deleteBooking(b._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

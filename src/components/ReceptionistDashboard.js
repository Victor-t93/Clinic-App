import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig"; // baseURL should include /api

export default function ReceptionistDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  // =====================
  // FETCH BOOKINGS
  // =====================
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/receptionist/bookings"); // GET /api/receptionist/bookings
      // ✅ handle both plain array and object-with-data
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setMessage("Failed to load bookings");
    }
  };

  // =====================
  // UPDATE STATUS
  // =====================
  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/receptionist/bookings/${id}`, { status });
      const updatedBooking = res.data.data || res.data;
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updatedBooking : b))
      );
      setMessage(`Booking marked as ${status}`);
    } catch (err) {
      console.error("Error updating status:", err);
      setMessage("Could not update booking");
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await api.patch(`/receptionist/bookings/${id}`, {
        status: "cancelled",
      });
      const updatedBooking = res.data.data || res.data;
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updatedBooking : b))
      );
      setMessage("Booking cancelled");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setMessage("Could not cancel booking");
    }
  };

  // =====================
  // FILTER BOOKINGS
  // =====================
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  // =====================
  // RENDER
  // =====================
  return (
    <div className="reception-dashboard">
      <header className="reception-header">
        <h1>Receptionist Dashboard</h1>
        <p>Manage and confirm client bookings below.</p>
      </header>

      {message && <p className="message">{message}</p>}

      <div className="filter-bar">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-container">
        <table className="reception-table">
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
            {Array.isArray(filteredBookings) && filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.user?.name || "Unknown"}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>
                    <span className={`status ${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    {b.status === "pending" && (
                      <button
                        className="btn success"
                        onClick={() => updateStatus(b._id, "approved")}
                      >
                        Approve
                      </button>
                    )}
                    {b.status === "approved" && (
                      <button
                        className="btn info"
                        onClick={() => updateStatus(b._id, "completed")}
                      >
                        Complete
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        className="btn danger"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

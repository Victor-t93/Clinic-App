import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import './ClientDashboard.css'

export default function ClientDashboard({ token }) {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ date: "", time: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch bookings");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time) {
      setMessage("Please select date and time");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/bookings", form);
      setBookings((prev) => [...prev, res.data.booking]);
      setMessage("Booking successful!");
      setForm({ date: "", time: "" });
    } catch (err) {
      const error = err.response?.data?.msg || "Booking failed";
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await api.patch(`/bookings/${id}`, { status: "cancelled" });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
      setMessage("Booking cancelled");
    } catch (err) {
      console.error(err);
      setMessage("Failed to cancel booking");
    }
  };

  return (
    <div className="client-dashboard">
      <header>
        <h1>Client Dashboard</h1>
        <p>Book appointments and view your booking history.</p>
      </header>

      {message && <p className="message">{message}</p>}

      {/* Booking Form */}
      <section className="booking-form">
        <h2>Book New Appointment</h2>
        <form onSubmit={handleBooking}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label>Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </section>

      {/* Booking History */}
      <section className="booking-history">
        <h2>Booking History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td className={`status ${b.status}`}>{b.status}</td>
                  <td>
                    {b.status === "pending" && (
                      <button
                        className="btn cancel"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

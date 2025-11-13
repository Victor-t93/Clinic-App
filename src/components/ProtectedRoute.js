import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ token, role, children, allowedRole }) {
  // Retrieve token and role from localStorage if not passed via props
  const storedToken = token || localStorage.getItem('token');
  const storedRole = role || localStorage.getItem('role');

  if (!storedToken) {
    // Not logged in
    return <Navigate to="/login/client" />;
  }

  if (allowedRole && storedRole !== allowedRole) {
    // Role mismatch
    return <Navigate to="/login/client" />;
  }

  return children;
}
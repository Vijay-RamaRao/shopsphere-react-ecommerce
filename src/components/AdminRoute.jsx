import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_UID } from '../config';

function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.uid !== ADMIN_UID) {
    // If no user or not admin, redirect to homepage
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
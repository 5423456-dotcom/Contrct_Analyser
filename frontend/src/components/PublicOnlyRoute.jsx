import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function PublicOnlyRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    // If user is already authenticated, redirect them to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import type { User, UserRole } from '../types';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactElement;
  adminOnly?: boolean;
  staffOnly?: boolean; // New prop for staff-only routes
  loginPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children, adminOnly = false, staffOnly = false, loginPath = '/login' }) => {
  if (!user) {
    return <Navigate to={loginPath} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check if the user is staff for staffOnly routes
  if (staffOnly) {
    const isStaff = ['Technician', 'Manager', 'Receptionist'].includes(user.role);
    if (!isStaff) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Role, roleHierarchy } from '../types';
import { LoaderCircle } from './Icons';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ children, allowedRoles }: React.PropsWithChildren<ProtectedRouteProps>) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoleLevel = roleHierarchy[user.role] ?? -1;
    const isAuthorized = allowedRoles.some(role => userRoleLevel >= (roleHierarchy[role] ?? -1));

    if (!isAuthorized) {
        // Redirect to home page or an unauthorized page if role is not sufficient
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
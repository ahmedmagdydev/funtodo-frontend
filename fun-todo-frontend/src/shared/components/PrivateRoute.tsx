import React from 'react';
import {  Navigate } from 'react-router-dom';
import { authService } from '../../api/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isLoggedIn = authService.isAuthenticated();

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;

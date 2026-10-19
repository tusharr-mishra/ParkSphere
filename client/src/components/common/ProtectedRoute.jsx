import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ForbiddenState } from './ForbiddenState.jsx';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <ForbiddenState
          title="Role Restriction"
          message={`Your current role (${user?.role || 'CUSTOMER'}) does not have permission to access this area.`}
        />
      </div>
    );
  }

  return children;
};

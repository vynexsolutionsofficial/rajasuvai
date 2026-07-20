import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  // BYPASS AUTHENTICATION FOR LOCAL TESTING
  return <Outlet />;
};

export default ProtectedRoute;

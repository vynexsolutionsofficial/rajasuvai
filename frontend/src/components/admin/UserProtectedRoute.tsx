import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-950">
        <Loader2 className="size-12 animate-spin text-brand-500" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default UserProtectedRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-950">
        <Loader2 className="size-12 animate-spin text-brand-500" />
      </div>
    );
  }

  return user && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

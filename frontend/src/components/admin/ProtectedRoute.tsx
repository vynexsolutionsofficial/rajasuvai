import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = async () => {
    try {
      // --- DEVELOPMENT BYPASS ---
      const isDevAdmin = localStorage.getItem('rajasuvai_dev_admin') === 'true';
      if (isDevAdmin) {
        const { data: profile } = await supabase
          .from('clients')
          .select('role')
          .eq('email', 'admin@rajasuvai.com')
          .maybeSingle();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
      } else {
        const { data: profile } = await supabase
          .from('clients')
          .select('role')
          .eq('email', user.email)
          .maybeSingle();

        setIsAdmin(profile?.role === 'admin');
      }
    } catch (err) {
      console.error('Auth Check Error:', err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Re-check whenever auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <Loader2 className="animate-spin" size={48} color="#f9a826" />
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

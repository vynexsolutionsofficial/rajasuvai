import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

type Role = 'admin' | 'customer';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadRole = async (currentUser: User | null) => {
      if (!currentUser) {
        if (isMounted) setRole(null);
        return;
      }
      const { data: profile } = await supabase
        .from('clients')
        .select('role')
        .ilike('email', currentUser.email ?? '')
        .maybeSingle();
      if (isMounted) setRole(profile?.role === 'admin' ? 'admin' : 'customer');
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      await loadRole(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      await loadRole(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, isAdmin: role === 'admin', loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

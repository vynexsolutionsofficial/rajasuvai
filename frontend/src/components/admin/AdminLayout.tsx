import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, ClipboardList, Package, LogOut, User,
  Users, Tag, Settings, Bell, Home, Menu, X,
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { cn } from '../../lib/cn';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: ShoppingBag },
  { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
  { name: 'Offers', path: '/admin/offers', icon: Tag },
  { name: 'Inventory', path: '/admin/inventory', icon: Package },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase.from('clients').select('name').eq('email', user.email).maybeSingle();
        if (profile?.name) setAdminName(profile.name);
      } catch (err) {
        console.error('Failed to fetch admin name:', err);
      }
    };
    fetchAdminName();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    window.location.reload();
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-lg font-extrabold text-white">SUVAI</span>
          <span className="rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">ADMIN</span>
        </div>
        <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="text-white/60 lg:hidden">
          <X size={22} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                active ? 'bg-brand-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={18} /> {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white">
          <Home size={18} /> Back to Site
        </Link>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-brand-50/30">
      {drawerOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setDrawerOpen(false)} />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-950 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="text-brand-950 lg:hidden">
              <Menu size={22} />
            </button>
            <h1 className="font-display text-lg font-bold text-brand-950">
              {navItems.find((i) => i.path === location.pathname)?.name || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={19} className="text-black/40" />
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                {adminName.charAt(0)}
              </div>
              <span className="hidden text-sm font-semibold text-brand-950 sm:inline">{adminName}</span>
              <User size={14} className="hidden text-black/40 sm:inline" />
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

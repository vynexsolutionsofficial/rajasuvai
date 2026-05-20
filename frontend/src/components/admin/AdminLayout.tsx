import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Package,
  LogOut,
  User,
  Users,
  Tag,
  Settings,
  Bell,
  Home,
  Menu,
  X
} from 'lucide-react';
import './AdminLayout.css';
import { supabase } from '../../supabaseClient';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // ProtectedRoute already handles auth guard.
    // Here we just fetch the admin's display name.
    const fetchAdminName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile } = await supabase
          .from('clients')
          .select('name')
          .eq('email', user.email)
          .maybeSingle();

        if (profile?.name) {
          setAdminName(profile.name);
        }
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

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={20} /> },
    { name: 'Offers', path: '/admin/offers', icon: <Tag size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-container">
      {drawerOpen && (
        <div className="admin-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={`admin-sidebar ${drawerOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span>SUVAİ</span>
            <span className="admin-logo-tag">ADMIN</span>
          </div>
          <button
            className="admin-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <Link to="/" className="admin-nav-item admin-nav-foot">
          <Home size={20} />
          <span>Back to Site</span>
        </Link>

        <button className="admin-nav-item admin-nav-foot" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <h1>{navItems.find(i => i.path === location.pathname)?.name || 'Admin'}</h1>
          </div>
          <div className="admin-header-right">
            <Bell size={20} className="admin-bell" />
            <div className="user-profile">
              <div className="user-avatar">{adminName.charAt(0)}</div>
              <span className="user-profile-name">{adminName}</span>
              <User size={16} />
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

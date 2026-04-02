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
  Home
} from 'lucide-react';
import './AdminLayout.css';
import { supabase } from '../../supabaseClient';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    // ProtectedRoute already handles auth guard.
    // Here we just fetch the admin's display name.
    const fetchAdminName = async () => {
      try {
        // --- DEVELOPMENT BYPASS ---
        const isDevAdmin = localStorage.getItem('rajasuvai_dev_admin') === 'true';
        if (isDevAdmin) {
          const { data: profile } = await supabase
            .from('clients')
            .select('name')
            .eq('email', 'admin@rajasuvai.com')
            .maybeSingle();

          if (profile?.name) {
            setAdminName(profile.name);
            return;
          }
        }

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
    localStorage.removeItem('rajasuvai_dev_admin');
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
      <div className="admin-sidebar">
        <div className="admin-logo">
          <span>SUVAİ</span>
          <span style={{ fontSize: '0.6rem', background: '#f9a826', color: '#000', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle', WebkitTextFillColor: '#000' }}>ADMIN</span>
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
        
        <Link 
          to="/" 
          className="admin-nav-item" 
          style={{ marginTop: 'auto', marginBottom: '0.5rem' }}
        >
          <Home size={20} />
          <span>Back to Site</span>
        </Link>

        <button className="admin-nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
      
      <main className="admin-content">
        <header className="admin-header">
          <h1>{navItems.find(i => i.path === location.pathname)?.name || 'Admin'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Bell size={20} style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }} />
            <div className="user-profile">
              <div className="user-avatar">{adminName.charAt(0)}</div>
              <span>{adminName}</span>
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

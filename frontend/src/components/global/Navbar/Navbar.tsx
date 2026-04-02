import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { supabase } from '../../../supabaseClient';
import AuthModal from '../Auth/AuthModal';
import logo from '../../../assets/logo.png';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
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
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('clients')
          .select('role')
          .eq('email', user.email)
          .maybeSingle();
        
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo Section */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Rajasuvai Logo" className="logo-image" />
        </Link>

        {/* Center: Navigation */}
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>HOME</Link>
          <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>SHOP SPICES</Link>
          <Link to="/story" className={location.pathname === '/story' ? 'active' : ''}>OUR STORY</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>CONTACT</Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              className={location.pathname.startsWith('/admin') ? 'active admin-link' : 'admin-link'}
              style={{ color: '#f9a826', fontWeight: 'bold' }}
            >
              <ShieldCheck size={16} /> ADMIN
            </Link>
          )}
        </div>

        {/* Right: Icons & Shop Now */}
        <div className="navbar-right">
          <button className="navbar-icon-btn">
            <Search size={22} />
          </button>
          
          <button 
            className={`navbar-icon-btn profile-btn ${showAuthModal ? 'active' : ''}`}
            onClick={async () => {
              const { data: { user } } = await supabase.auth.getUser();
              const isDevAdmin = localStorage.getItem('rajasuvai_dev_admin') === 'true';
              if (user || isDevAdmin) {
                window.location.href = '/profile';
              } else {
                setShowAuthModal(true);
              }
            }}
          >
            <User size={22} />
          </button>

          <Link to="/cart" className="navbar-icon-btn cart-btn">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cat-badge">{cartCount}</span>}
          </Link>

          <Link to="/shop" className="shop-now-btn">
            SHOP NOW
          </Link>
        </div>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </nav>
  );
};

export default Navbar;

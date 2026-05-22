import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, ShieldCheck, Menu, X } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { supabase } from '../../../supabaseClient';
import AuthModal from '../Auth/AuthModal';
import logo from '../../../assets/logo.png';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  useEffect(() => {
    const checkAuth = async () => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkAuth());
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Rajasuvai Logo" className="logo-image" />
        </Link>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">Menu</span>
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>HOME</Link>
          <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>SHOP SPICES</Link>
          <Link to="/wholesale" className={location.pathname === '/wholesale' ? 'active' : ''}>WHOLESALE</Link>
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

        <div className="navbar-right">
          <button className="navbar-icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          {showSearch ? (
            <form onSubmit={handleSearch} className="navbar-search-form">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
              />
              <button type="submit" className="navbar-icon-btn">
                <Search size={18} />
              </button>
              <button type="button" className="navbar-icon-btn" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                <X size={18} />
              </button>
            </form>
          ) : (
            <button className="navbar-icon-btn" onClick={() => setShowSearch(true)} aria-label="Search">
              <Search size={22} />
            </button>
          )}

          <button
            className={`navbar-icon-btn profile-btn ${showAuthModal ? 'active' : ''}`}
            onClick={async () => {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
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

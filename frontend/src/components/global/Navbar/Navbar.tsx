import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Heart } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useCart } from '../../../context/CartContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  return (
    <nav className={`navbar ${location.pathname === '/shop' ? 'navbar-light' : ''}`}>
      <div className="navbar-container container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <div className="logo-text-group">
            <span className="logo-main">Raja</span>
            <span className="logo-sub">Suvai</span>
          </div>
        </Link>

        {/* Search Bar - Center */}
        <div className="navbar-search">
          <input type="text" placeholder="Search for products..." />
          <button className="search-icon-btn">
            <Search size={20} />
          </button>
        </div>

        {/* Icons Section */}
        <div className="navbar-icons">
          <div className="profile-wrapper">
            <button 
              className={`icon-btn profile-btn ${isProfileOpen ? 'active' : ''}`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User size={24} />
            </button>
            {isProfileOpen && <ProfileDropdown onClose={() => setIsProfileOpen(false)} />}
          </div>

          <button className="icon-btn heart-btn">
            <Heart size={24} />
            <span className="icon-badge">1</span>
          </button>
          
          <button className="icon-btn cart-btn">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
          </button>

          <button className="icon-btn cart-alt-btn">
            <ShoppingCart size={24} />
            <span className="icon-badge badge-orange">2</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

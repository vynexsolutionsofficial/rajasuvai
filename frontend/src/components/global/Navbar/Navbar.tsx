import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <div className="logo-text">RAJASUVAI</div>
          <div className="logo-tagline">ROYAL TASTE IN EVERY GRAIN</div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <a href="/" className="active">HOME</a>
          <a href="/shop">SHOP</a>
          <a href="/our-story">OUR STORY</a>
          <a href="/contact">CONTACT</a>
        </div>

        {/* Icons Section */}
        <div className="navbar-icons">
          <button className="icon-btn search-btn">
            <Search size={20} />
          </button>
          
          <div className="profile-wrapper">
            <button 
              className={`icon-btn profile-btn ${isProfileOpen ? 'active' : ''}`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User size={20} />
            </button>
            {isProfileOpen && <ProfileDropdown onClose={() => setIsProfileOpen(false)} />}
          </div>

          <button className="icon-btn cart-btn">
            <ShoppingCart size={20} />
            <span className="cart-count">0</span>
          </button>
          
          <button className="icon-btn mobile-menu-btn">
            <Menu size={20} />
          </button>

          <button className="shop-now-btn">SHOP NOW</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

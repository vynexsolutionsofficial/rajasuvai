import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import AuthModal from '../Auth/AuthModal';
import logo from '../../../assets/logo.png';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo Section */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Rajasuvai Logo" className="logo-image" />
        </Link>

        {/* Center: Navigation & Subtext */}
        <div className="navbar-center">
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>HOME</Link>
            <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>SHOP SPICES</Link>
            <Link to="/story" className={location.pathname === '/story' ? 'active' : ''}>OUR STORY</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>CONTACT</Link>
          </div>
          <div className="nav-subtext">
            <span>P U R E   O R G A N I C   S P I C E S</span>
          </div>
        </div>

        {/* Right: Icons & Shop Now */}
        <div className="navbar-right">
          <button className="navbar-icon-btn">
            <Search size={22} />
          </button>
          
          <button 
            className={`navbar-icon-btn profile-btn ${showAuthModal ? 'active' : ''}`}
            onClick={() => setShowAuthModal(!showAuthModal)}
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

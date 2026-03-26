import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <div className="logo-emblem"></div>
          <div className="logo-text">
            <span className="logo-raja">Raja</span>
            <span className="logo-suvai">Suvai</span>
          </div>
        </Link>

        {/* Search Bar - Center */}
        <div className="navbar-search">
          <div className="search-input-wrapper">
            <input type="text" placeholder="Search for products..." />
            <button className="search-submit">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Icons Section */}
        <div className="navbar-right">
          <button className="navbar-icon-btn">
            <User size={24} />
          </button>
          
          <button className="navbar-icon-btn">
            <Heart size={24} />
            <span className="badge-red">1</span>
          </button>

          <button className="navbar-icon-btn">
            <ShoppingCart size={24} />
            <span className="badge-red">3</span>
          </button>

          <button className="navbar-icon-btn">
            <ShoppingCart size={24} />
            <span className="badge-red">{cartCount > 0 ? cartCount : 2}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

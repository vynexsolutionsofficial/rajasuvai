import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="logo">
          <a href="/">RAJASUVAI</a>
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/shop">Shop</a></li>
          <li><a href="/our-story">Our Story</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div className="nav-actions">
          <button className="search-btn">Search</button>
          <button className="cart-btn">Cart (0)</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

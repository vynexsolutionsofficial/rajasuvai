import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="logo-section">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 7 6 7 11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11C17 6 12 2 12 2Z" opacity="0.8" />
              <path d="M12 6C12 6 9 9 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 9 12 6 12 6Z" />
              <path d="M12 22C16.4183 22 20 18.4183 20 14C20 11.5 19 9.5 17.5 8C18.5 10 18.5 12 17 14C15.5 16 13 16 12 17C11 16 8.5 16 7 14C5.5 12 5.5 10 6.5 8C5 9.5 4 11.5 4 14C4 18.4183 7.58172 22 12 22Z" fill="var(--color-brand-orange)" />
            </svg>
          </div>
          <div className="logo-text">
            <a href="/" className="brand-name">Rajasuvai..</a>
            <span className="brand-tagline">ARTISAN SPICES</span>
          </div>
        </div>

        <ul className="nav-links">
          <li><a href="/" className="active">HOME</a></li>
          <li><a href="/shop">SHOP SPICES</a></li>
          <li><a href="/our-story">OUR STORY</a></li>
          <li><a href="/contact">CONTACT</a></li>
        </ul>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button className="icon-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
          <a href="/shop" className="nav-cta-btn">SHOP NOW</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

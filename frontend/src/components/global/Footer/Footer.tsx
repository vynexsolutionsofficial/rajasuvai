import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2 className="logo">RAJASUVAI</h2>
          <p>Defining the standard of premium authentic taste.</p>
        </div>
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              <li><a href="/shop">Shop All</a></li>
              <li><a href="/best-sellers">Best Sellers</a></li>
              <li><a href="/new-arrivals">New Arrivals</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Our Story</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/tradition">Tradition</a></li>
              <li><a href="/careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Support</h3>
            <ul>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/shipping">Shipping</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Rajasuvai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

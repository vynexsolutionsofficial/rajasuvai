import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* ── Newsletter Section ── */}
      <div className="footer-newsletter">
        <div className="container newsletter-content">
          <div className="newsletter-text">
            <h3>Join the Spice Trail</h3>
            <p>Subscribe to receive artisan recipes, spice care tips, and exclusive offers.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="yourname@email.com" required />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="container footer-main">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <h2 className="footer-logo">RAJASUVAI</h2>
            <p className="footer-tagline">
              Defining the standard of premium authentic taste since 1984. 
              Sourcing the finest ingredients from the heart of South India.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" className="social-icon">IG</a>
              <a href="#" aria-label="Facebook" className="social-icon">FB</a>
              <a href="#" aria-label="WhatsApp" className="social-icon">WA</a>
              <a href="#" aria-label="YouTube" className="social-icon">YT</a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-links-col">
            <h4>SHOP</h4>
            <ul>
              <li><Link to="/shop?category=Spices">Artisan Spices</Link></li>
              <li><Link to="/shop?category=Oils">Cold-pressed Oils</Link></li>
              <li><Link to="/shop?category=Staples">Organic Staples</Link></li>
              <li><Link to="/shop?category=Gifts">Gift Boxes</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>CUSTOMER CARE</h4>
            <ul>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
              <li><Link to="/returns">Returns & Refunds</Link></li>
              <li><Link to="/faq">Track Order</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="footer-bottom">
        <div className="container bottom-content">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Rajasuvai. All rights reserved. 
            Powered by <a href="https://vynexsolution.in" target="_blank" rel="noopener noreferrer" className="vynex-link">Vynex Solution</a>
          </p>
          <div className="bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          <div className="payment-badges">
            <span className="badge">VISA</span>
            <span className="badge">UP-I</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

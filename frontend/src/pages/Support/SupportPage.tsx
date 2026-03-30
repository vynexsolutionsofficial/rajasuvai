import React from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';
import './SupportPage.css';

const SupportPage: React.FC = () => {
  return (
    <div className="support-page-wrapper">
      <div className="support-header">
        <h1 className="support-logo">RAJA SUVAI</h1>
      </div>

      <div className="support-info-bar">
        <div className="info-item">
          <Phone size={18} className="info-icon" />
          <span>+91 99999 00000</span>
        </div>
        <div className="info-item">
          <Clock size={18} className="info-icon" />
          <span>Mon-Sat, 9am - 7pm</span>
        </div>
        <div className="info-item">
          <MapPin size={18} className="info-icon" />
          <span>Coimbatore, TN</span>
        </div>
        <div className="info-item">
          <MapPin size={18} className="info-icon" />
          <span>Tamil Nadu, India</span>
        </div>
      </div>

      <div className="support-content container">
        <div className="support-split-layout">
          {/* Left Side: Form Card */}
          <div className="support-form-card">
            <div className="form-header">
              <div className="header-line"></div>
              <span className="header-label">LET'S <span>CONNECT</span></span>
              <div className="header-line"></div>
            </div>
            
            <h2 className="form-title">DROP US A <span>NOTE.</span></h2>
            <p className="form-subtitle">Fill out the form below and we'll respond within 2 hours.</p>

            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Full Name" className="form-input" />
              </div>
              
              <div className="form-group email-group">
                <input type="email" placeholder="Email Address" className="form-input" />
                <span className="input-hint">your@email.com</span>
              </div>
              
              <div className="form-group textarea-group">
                <label className="input-label">Your Message</label>
                <textarea placeholder="Tell us what you're looking for..." className="form-textarea"></textarea>
              </div>

              <button type="submit" className="btn-send-message">
                SEND MESSAGE <span className="btn-arrow">→</span>
              </button>
            </form>

            <div className="form-footer">
              <div className="header-line"></div>
              <span className="footer-label">FOLLOW US</span>
              <div className="header-line"></div>
            </div>
            
            <div className="support-socials">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </div>
          </div>

          {/* Right Side: Decorative Image */}
          <div className="support-visual-card">
            <img 
              src="/products/garam_masala.png" 
              alt="Artisan Spices" 
              className="spice-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

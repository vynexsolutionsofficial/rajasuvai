import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <img src="/src/assets/hero-bg.jpg" alt="Premium Rajasuvai Background" className="hero-bg" />
        <div className="hero-content container">
          <div className="hero-text-center">
            <span className="hero-upper-subtitle">PURE ORGANIC SPICES</span>
            <h1 className="hero-title">
              EXPERIENCE THE QUALITY OF <br />
              <span className="text-mask">every single grain.</span>
            </h1>
            <p className="hero-description">
              Sourced directly from local farms to ensure the highest quality for your kitchen.
            </p>
            
            <div className="hero-cta">
              <a href="/shop" className="btn btn-orange">START SHOPPING</a>
              <a href="/our-story" className="btn btn-outline">
                OUR STORY <span>→</span>
              </a>
            </div>

            <div className="hero-reviews">
              <div className="avatar-group">
                <img src="/src/assets/avatar-1.jpg" alt="User" />
                <img src="/src/assets/avatar-2.jpg" alt="User" />
                <img src="/src/assets/avatar-3.jpg" alt="User" />
                <img src="/src/assets/avatar-4.jpg" alt="User" />
                <div className="avatar-more">+4k</div>
              </div>
              <div className="review-stats">
                <div className="stars">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="endorsed-text">ENDORSED BY OVER 4,000+ MASTER CHEFS WORLDWIDE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

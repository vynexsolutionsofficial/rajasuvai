import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <img src="/src/assets/hero-bg.jpg" alt="Premium Rajasuvai Background" className="hero-bg" />
        <div className="hero-content container">
          <h1 className="hero-title animate-up">Pure Authentication.<br />Royal Taste.</h1>
          <p className="hero-subtitle animate-up-delayed">Discover the finest collection of traditional delicacies, crafted for the modern connoisseur.</p>
          <div className="hero-cta animate-up-delayed-more">
            <a href="/shop" className="btn btn-primary">Shop Collection</a>
            <a href="/our-story" className="btn btn-secondary">Our Story</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

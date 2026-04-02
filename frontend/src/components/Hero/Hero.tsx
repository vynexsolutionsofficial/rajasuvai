import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/hero-bg-v2.png';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <img src={heroBg} alt="Premium Rajasuvai Background" className="hero-bg" />
        <div className="hero-content container">
          <div className="hero-text-center">
            <div className="hero-badge">PURE ORGANIC SPICES</div>
            <h1 className="hero-title">
              EXPERIENCE THE <br />
              QUALITY OF <br />
              <span className="text-textured">every single grain.</span>
            </h1>
            <p className="hero-description">
              Sourced directly from local farms to ensure the highest quality for your kitchen.
            </p>
            
            <div className="hero-cta">
              <Link to="/shop" className="btn-artisan btn-artisan-orange">START SHOPPING</Link>
              <Link to="/story" className="btn-artisan btn-outline-white">
                OUR STORY <span className="arrow">→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

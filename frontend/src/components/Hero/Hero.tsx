import React from 'react';
import heroBg from '../../assets/hero-bg-v2.png';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <img src={heroBg} alt="Premium Rajasuvai Background" className="hero-bg" />
        <div className="hero-content container">
          <div className="hero-text-center">
            <h1 className="hero-title">
              EXPERIENCE THE QUALITY OF <br />
              <span 
                className="text-mask" 
                style={{ backgroundImage: `url(${heroBg})` }}
              >
                every single grain.
              </span>
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


          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

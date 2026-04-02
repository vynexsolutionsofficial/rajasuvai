import React from 'react';
import './OfferBanners.css';

const SpecialOfferBanner: React.FC = () => {
  return (
    <div className="special-offer-banner">
      <div className="offer-content">
        <span className="offer-badge">LIMITED SEASON SPECIAL</span>
        <h2 className="offer-title">EXPERIENCE THE <br /> AUTHENTICITY <span>20% OFF</span></h2>
        <p className="offer-description">On all hand-ground masalas and organic seed collections. Use code: SUVAI20</p>
        <button className="btn-artisan btn-artisan-orange">CLAIM MY OFFER <span className="arrow">→</span></button>
      </div>
      <div className="offer-visual">
        <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Spice Special" />
      </div>
    </div>
  );
};

const ProductShowcase: React.FC = () => {
  return (
    <div className="product-showcase-panner">
      <div className="showcase-header">
        <h3 className="showcase-label">CURATED COLLECTION</h3>
        <h2 className="showcase-title">EXPERT'S CHOICE</h2>
      </div>
      <div className="showcase-grid">
        <div className="showcase-card">
          <div className="showcase-img-box">
            <img src="/products/pepper.png" alt="Black Pepper" />
          </div>
          <div className="showcase-details">
            <h4>Tellicherry Black Pepper</h4>
            <p className="price">₹450.00</p>
            <button className="btn-artisan-mini">VIEW PROFILE</button>
          </div>
        </div>

        <div className="showcase-card active">
          <div className="showcase-img-box">
            <img src="/products/turmeric.png" alt="Pure Turmeric" />
          </div>
          <div className="showcase-details">
            <h4>Khandwala Turmeric</h4>
            <p className="price">₹280.00</p>
            <button className="btn-artisan-mini">VIEW PROFILE</button>
          </div>
        </div>

        <div className="showcase-card">
          <div className="showcase-img-box">
            <img src="/products/chilli.png" alt="Red Chilli" />
          </div>
          <div className="showcase-details">
            <h4>Guntur Sannam Chilli</h4>
            <p className="price">₹320.00</p>
            <button className="btn-artisan-mini">VIEW PROFILE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OfferBanners: React.FC = () => {
  return (
    <section className="offer-banners-section">
      <SpecialOfferBanner />
      <ProductShowcase />
    </section>
  );
};

export default OfferBanners;

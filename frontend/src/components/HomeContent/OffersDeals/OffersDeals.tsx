import React from 'react';
import './OffersDeals.css';

const OffersDeals: React.FC = () => {
  return (
    <section className="offers-section container">
      <div className="offers-banner">
        <div className="offer-text">
          <span className="offer-badge">Limited Time</span>
          <h2>Weekend Feast Bundle</h2>
          <p>Get a curated selection of 5 traditional sweets at a special price.</p>
          <button className="btn btn-primary">Shop Offer</button>
        </div>
        <div className="offer-image">
          <img src="https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=800&auto=format&fit=crop" alt="Offer" />
        </div>
      </div>
    </section>
  );
};

export default OffersDeals;

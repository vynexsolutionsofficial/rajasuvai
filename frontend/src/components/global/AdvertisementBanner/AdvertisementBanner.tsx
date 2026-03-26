import React from 'react';
import './AdvertisementBanner.css';

const AdvertisementBanner: React.FC = () => {
  return (
    <div className="ad-banner">
      <div className="container">
        <div className="ad-content">
          <span>Seasonal Offer</span>
          <h2>Get 20% Off on Heritage Sweets</h2>
          <button className="btn btn-primary">Claim Offer</button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementBanner;

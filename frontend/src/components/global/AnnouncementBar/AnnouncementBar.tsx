import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar: React.FC = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span className="flashing-text">✨ Free Shipping on all orders above ₹999! ✨ Limited Time Offer! ✨</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;

import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar: React.FC = () => {
  return (
    <div className="announcement-bar">
      <div className="container">
        <p>Free Shipping on orders over ₹1000 | New Collection Out Now!</p>
      </div>
    </div>
  );
};

export default AnnouncementBar;

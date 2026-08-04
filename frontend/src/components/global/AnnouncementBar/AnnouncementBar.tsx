import React from 'react';

const AnnouncementBar: React.FC = () => {
  return (
    <div className="hidden bg-brand-950 py-1.5 text-center text-xs font-medium tracking-wide text-brand-100 sm:block">
      Free shipping on all orders above ₹999 · Limited time offer
    </div>
  );
};

export default AnnouncementBar;

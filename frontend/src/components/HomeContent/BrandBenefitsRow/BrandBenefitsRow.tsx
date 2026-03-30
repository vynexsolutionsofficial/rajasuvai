import React from 'react';
import './BrandBenefitsRow.css';

const BrandBenefitsRow: React.FC = () => {
  const essentials = [
    { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
    { icon: '💳', title: 'Secure Payment', desc: 'UPI, Cards, and Net Banking' },
    { icon: '↩️', title: '7-Day Return', desc: 'Easy and hassle-free returns' },
    { icon: '🌿', title: '100% Organic', desc: 'No artificial flavors or colors' },
  ];

  return (
    <section className="benefits-bar-section">
      <div className="container benefits-bar-grid">
        {essentials.map((item, index) => (
          <div key={index} className="benefits-bar-item">
            <span className="benefits-bar-icon">{item.icon}</span>
            <div className="benefits-bar-info">
              <h4 className="benefits-bar-title">{item.title}</h4>
              <p className="benefits-bar-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandBenefitsRow;

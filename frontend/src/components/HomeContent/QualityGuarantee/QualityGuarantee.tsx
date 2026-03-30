import React from 'react';
import './QualityGuarantee.css';

const QualityGuarantee: React.FC = () => {
  const benefits = [
    { icon: '🌿', title: 'Direct Sourcing', desc: 'From the heart of South Indian farms.' },
    { icon: '🧪', title: 'Lab Tested', desc: 'Uncompromising purity & curcumin standards.' },
    { icon: '📜', title: 'Traditional Recipes', desc: 'Authenticity preserved across generations.' },
    { icon: '🛡️', title: 'Artisanal Processing', desc: 'Small-batch crafted for peak flavor.' }
  ];

  return (
    <section className="quality-section container">
      <div className="quality-header">
        <div className="quality-accent">
          <span className="quality-icon">🛡️</span>
          OUR QUALITY GUARANTEE
        </div>
        <h2 className="quality-title">
          Why settle for <br />
          <span className="title-orange">ordinary flavors?</span>
        </h2>
      </div>

      <div className="benefits-grid">
        {benefits.map((b, i) => (
          <div key={i} className="benefit-item">
            <div className="benefit-icon">{b.icon}</div>
            <h3 className="benefit-title">{b.title}</h3>
            <p className="benefit-desc">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QualityGuarantee;

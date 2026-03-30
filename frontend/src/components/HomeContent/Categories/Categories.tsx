import React from 'react';
import './Categories.css';

const CATEGORIES = [
  { id: 1, name: 'PURE TURMERIC', image: '/products/turmeric.png' },
  { id: 2, name: 'RED CHILLI', image: '/products/chilli.png' },
  { id: 3, name: 'BLACK PEPPER', image: '/products/pepper.png' },
  { id: 4, name: 'GARAM MASALA', image: '/products/garam_masala.png' },
  { id: 5, name: 'GREEN CARDAMOM', image: '/products/cardamom.png' },
  { id: 6, name: 'ORGANIC NUTMEG', image: '/products/saffron.png' },
];

const Categories: React.FC = () => {
  return (
    <section className="categories-section container">
      <div className="categories-header">
        <span className="categories-accent">ARTISANAL COLLECTION</span>
        <h2 className="categories-title">
          <span className="title-black">SHOP BY</span> <span className="title-orange">CATEGORY</span>
        </h2>
        <p className="categories-subtitle">
          Discover our collection of unadulterated, single-origin spices from the heart of India.
        </p>
      </div>

      <div className="categories-grid">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="category-card">
            <img src={cat.image} alt={cat.name} className="category-bg" />
            <div className="category-overlay">
              <h3 className="category-name">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="categories-footer">
        <a href="/shop" className="btn-browse-all">
          Browse All Spices <span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
};

export default Categories;

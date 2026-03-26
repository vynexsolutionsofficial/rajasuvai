import React from 'react';
import './Categories.css';

const CATEGORIES = [
  { id: 1, name: 'Traditional Sweets', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=400&auto=format&fit=crop' },
  { id: 2, name: 'Savory Snacks', image: 'https://images.unsplash.com/photo-1626132646529-500639d48530?w=400&auto=format&fit=crop' },
  { id: 3, name: 'Organic Spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd05cd?w=400&auto=format&fit=crop' },
  { id: 4, name: 'Premium Ghee', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&auto=format&fit=crop' },
];

const Categories: React.FC = () => {
  return (
    <section className="categories-section container">
      <h2 className="section-title">Shop by Category</h2>
      <div className="categories-grid">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="category-card">
            <div className="category-image-wrapper">
              <img src={cat.image} alt={cat.name} />
            </div>
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

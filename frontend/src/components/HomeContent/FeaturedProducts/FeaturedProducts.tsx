import React from 'react';
import ProductCard from '../../ProductCard/ProductCard';
import './FeaturedProducts.css';

const FEATURED = [
  { id: 1, name: 'Signature Mysore Pak', price: '₹950', category: 'Premium', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&auto=format&fit=crop' },
  { id: 2, name: 'Splendid Cashew Halwa', price: '₹1200', category: 'Luxury', image: 'https://images.unsplash.com/photo-1626132646529-500639d48530?w=600&auto=format&fit=crop' },
];

const FeaturedProducts: React.FC = () => {
  return (
    <section className="featured-section container">
      <div className="section-header">
        <h2 className="section-title">Featured Selection</h2>
      </div>
      <div className="featured-grid">
        {FEATURED.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;

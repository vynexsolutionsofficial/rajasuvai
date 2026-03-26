import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Royal Mysore Pak', price: '₹850', category: 'Sweets', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=800&auto=format&fit=crop' },
  { id: 2, name: 'Premium Karupatti Halwa', price: '₹720', category: 'Sweets', image: 'https://images.unsplash.com/photo-1601050638917-3f80fc014dad?w=800&auto=format&fit=crop' },
  { id: 3, name: 'Madras Filter Coffee Blend', price: '₹450', category: 'Beverages', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop' },
  { id: 4, name: 'Handcrafted Murukku', price: '₹350', category: 'Snacks', image: 'https://images.unsplash.com/photo-1626132646529-500639d48530?w=800&auto=format&fit=crop' },
];

const ProductGrid: React.FC = () => {
  return (
    <section className="product-grid-section container">
      <div className="section-header">
        <h2 className="section-title">The Collection</h2>
        <a href="/shop" className="view-all">View All Products</a>
      </div>
      <div className="product-grid">
        {DUMMY_PRODUCTS.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;

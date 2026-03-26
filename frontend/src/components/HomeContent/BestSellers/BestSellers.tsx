import React from 'react';
import ProductCard from '../../ProductCard/ProductCard';
import './BestSellers.css';

const BEST_SELLERS = [
  { id: 1, name: 'Handcrafted Laddu', price: '₹450', category: 'Best Seller', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop' },
  { id: 2, name: 'Traditional Murukku', price: '₹320', category: 'Best Seller', image: 'https://images.unsplash.com/photo-1626132646529-500639d48530?w=400&auto=format&fit=crop' },
  { id: 3, name: 'Filter Coffee Powder', price: '₹280', category: 'Best Seller', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop' },
  { id: 4, name: 'Ghee Roasted Cashews', price: '₹750', category: 'Best Seller', image: 'https://images.unsplash.com/photo-1626132646529-500639d48530?w=400&auto=format&fit=crop' },
];

const BestSellers: React.FC = () => {
  return (
    <section className="best-sellers-section container">
      <div className="section-header">
        <h2 className="section-title">Best Sellers</h2>
        <a href="/shop" className="view-all">Shop All</a>
      </div>
      <div className="product-grid">
        {BEST_SELLERS.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;

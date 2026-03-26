import React, { useState } from 'react';
import ShopProductGrid from './ShopProductGrid';
import './Shop.css';

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Spices', 'Masalas', 'Oils', 'Snacks'];

  return (
    <div className="shop-page">
      <main className="shop-container container">
        <aside className="shop-sidebar">
          <div className="shop-filter-group">
            <h3 className="shop-filter-title">Categories</h3>
            <div className="shop-filter-list">
              {categories.map((cat) => (
                <label key={cat} className="shop-filter-item">
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategory === cat}
                    onChange={() => setActiveCategory(cat)}
                  />
                  <span className="shop-radio-custom"></span>
                  <span className="shop-filter-name">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="shop-filter-group">
            <h3 className="shop-filter-title">Price</h3>
            <div className="shop-filter-list">
              {[
                { label: '₹0 - ₹200', checked: true },
                { label: '₹200 - ₹500', checked: false },
                { label: '₹500 & Above', checked: false }
              ].map((priceRange) => (
                <label key={priceRange.label} className="shop-filter-item">
                  <input type="checkbox" defaultChecked={priceRange.checked} />
                  <span className="shop-check-custom"></span>
                  <span className="shop-filter-name">{priceRange.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="shop-filter-group">
            <h3 className="shop-filter-title">Customer Ratings</h3>
            <div className="shop-filter-list">
              {[5, 4, 3].map((num) => (
                <label key={num} className="shop-filter-item">
                  <input type="checkbox" />
                  <span className="shop-check-custom"></span>
                  <span className="shop-star-rating">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} style={{ opacity: i < num ? 1 : 0.2 }}>★</span>
                    ))}
                    <span style={{ color: '#888', marginLeft: '5px' }}>& Up</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="shop-main">
          <header className="shop-header">
            <div className="shop-header-info">
              <h1 className="shop-title">Our Products</h1>
              <p className="item-stats">Showing 1-12 of 120 items</p>
            </div>
            <div className="header-actions">
              <select className="shop-sort">
                <option>Sort by: Popularity</option>
                <option>Price: Low to High</option>
              </select>
              <button className="filter-btn-orange">
                <span>↑</span> Filter
              </button>
            </div>
          </header>

          <ShopProductGrid category={activeCategory} />

          <div className="shop-pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn next">Next</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Shop;

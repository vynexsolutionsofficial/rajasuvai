import React from 'react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import './Shop.css';

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('Spices');
  const categories = ['Spices', 'Masalas', 'Oils', 'Snacks'];
  const priceRanges = ['₹0 - ₹200', '₹200 - ₹500', '₹500 & Above'];

  return (
    <div className="shop-page">
      <div className="shop-content container">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar">
          <div className="filter-group">
            <h3 className="filter-group-title">Categories</h3>
            <div className="filter-options">
              {categories.map(cat => (
                <label key={cat} className="filter-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="option-label">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-group-title">Price</h3>
            <div className="filter-options">
              {priceRanges.map(range => (
                <label key={range} className="filter-checkbox">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  <span className="option-label">{range}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-group-title">Customer Ratings</h3>
            <div className="filter-options">
              {[5, 4, 3].map(rating => (
                <label key={rating} className="filter-checkbox">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  <span className="option-label">
                    {Array(rating).fill('★').join('')} & Up
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Main Product Area */}
        <main className="shop-main">
          <div className="shop-main-header">
            <div className="header-left">
              <h2 className="main-title">Our Products</h2>
              <p className="item-count-text">Showing 1-12 of 120 items</p>
            </div>
            
            <div className="header-right">
              <div className="sort-wrapper">
                <span>Sort by:</span>
                <select className="sort-dropdown">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
              <button className="btn-filter-toggle">
                <span>↑</span> Filter
              </button>
            </div>
          </div>

          <ProductGrid category={selectedCategory} />
          
          {/* Pagination Placeholder */}
          <div className="pagination">
            <button className="page-num">1</button>
            <button className="page-num active">2</button>
            <button className="page-num">3</button>
            <button className="page-next">Next</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;

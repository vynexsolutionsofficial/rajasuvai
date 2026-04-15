import React, { useState, useCallback } from 'react';
import ShopProductGrid from './ShopProductGrid';
import './Shop.css';

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState<[number, number | null] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const categories = ['All', 'Spices', 'Masalas', 'Oils', 'Snacks'];
  const priceRanges: { label: string; value: [number, number | null] }[] = [
    { label: 'All Prices', value: [0, null] },
    { label: '₹0 - ₹200', value: [0, 200] },
    { label: '₹200 - ₹500', value: [200, 500] },
    { label: '₹500 & Above', value: [500, null] },
  ];

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePriceChange = (range: [number, number | null]) => {
    setActivePriceRange(range[1] === null && range[0] === 0 ? undefined : range);
    setCurrentPage(1);
  };

  const handleTotalItems = useCallback((total: number) => {
    setTotalItems(total);
  }, []);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="shop-page">
      <main className="shop-container">

        {/* ── Sidebar ── */}
        <aside className="shop-sidebar">
          {/* Categories */}
          <div className="shop-filter-group">
            <h3 className="shop-filter-title">Categories</h3>
            <div className="shop-filter-list">
              {categories.map((cat) => (
                <label key={cat} className="shop-filter-item">
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategory === cat}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <span className="shop-radio-custom"></span>
                  <span className="shop-filter-name">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="shop-filter-group">
            <h3 className="shop-filter-title">Price Range</h3>
            <div className="shop-filter-list">
              {priceRanges.map((range) => (
                <label key={range.label} className="shop-filter-item">
                  <input
                    type="radio"
                    name="price"
                    checked={
                      (!activePriceRange && range.label === 'All Prices') ||
                      (activePriceRange?.[0] === range.value[0] &&
                        activePriceRange?.[1] === range.value[1])
                    }
                    onChange={() => handlePriceChange(range.value)}
                  />
                  <span className="shop-radio-custom"></span>
                  <span className="shop-filter-name">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Ratings */}
          <div className="shop-filter-group">
            <h3 className="shop-filter-title">Customer Ratings</h3>
            <div className="shop-filter-list">
              {[5, 4, 3].map((num) => (
                <label key={num} className="shop-filter-item">
                  <input type="checkbox" name="rating" />
                  <span className="shop-check-custom"></span>
                  <span className="shop-star-rating">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} style={{ opacity: i < num ? 1 : 0.2 }}>
                          ★
                        </span>
                      ))}
                    <span style={{ color: '#888', marginLeft: '4px', fontSize: '12px' }}>& Up</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <section className="shop-main">
          <header className="shop-header">
            <div className="shop-header-info">
              <h1 className="shop-title">Our Products</h1>
              <p className="item-stats">
                Showing {startItem}–{endItem} of {totalItems} items
              </p>
            </div>
            <div className="header-actions">
              <select className="shop-sort">
                <option>Sort: Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </header>

          <ShopProductGrid
            category={activeCategory}
            priceRange={activePriceRange}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onTotalItems={handleTotalItems}
          />

          {totalItems > itemsPerPage && (
            <div className="shop-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  className="page-btn next"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Shop;

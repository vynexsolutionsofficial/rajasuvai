import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ShopProductGrid from './ShopProductGrid';
import './Shop.css';

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState<[number, number | null] | undefined>(undefined);
  const [activeSort, setActiveSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  // Reset to page 1 when URL search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [urlSearch]);

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

  const [filtersOpen, setFiltersOpen] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="shop-page">
      {/* Mobile filter backdrop */}
      <div
        className={`shop-sidebar-backdrop${filtersOpen ? ' open' : ''}`}
        onClick={() => setFiltersOpen(false)}
      />
      <main className="shop-container">

        {/* ── Sidebar ── */}
        <aside className={`shop-sidebar${filtersOpen ? ' open' : ''}`}>
          {/* Close button (mobile only) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 16px', borderBottom: '1px solid #F5F4F2', marginBottom: '16px' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#1C1917' }}>Filters</span>
            <button onClick={() => setFiltersOpen(false)} style={{ background: '#F5F4F2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#57534E' }}>
              <X size={16} />
            </button>
          </div>
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

          <div className="shop-filter-group">
            <h3 className="shop-filter-title">Customer Ratings</h3>
            <div className="shop-filter-list">
              {[5, 4, 3].map((num) => (
                <label key={num} className="shop-filter-item">
                  <input type="checkbox" name="rating" />
                  <span className="shop-check-custom"></span>
                  <span className="shop-star-rating">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} style={{ opacity: i < num ? 1 : 0.2 }}>★</span>
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
              <h1 className="shop-title">
                {urlSearch ? `Search: "${urlSearch}"` : 'Our Products'}
              </h1>
              <p className="item-stats">
                Showing {startItem}–{endItem} of {totalItems} items
              </p>
            </div>
            <div className="header-actions">
              <button className="shop-filter-toggle" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal size={15} />
                Filters
              </button>
              <select
                className="shop-sort"
                value={activeSort}
                onChange={(e) => { setActiveSort(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Sort: Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </header>

          <ShopProductGrid
            category={activeCategory}
            priceRange={activePriceRange}
            sort={activeSort}
            search={urlSearch}
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
                <button className="page-btn next" onClick={() => setCurrentPage((prev) => prev + 1)}>
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

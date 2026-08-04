import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { api } from '../../services/api';
import ShopProductGrid from './ShopProductGrid';
import { Sheet } from '../../components/ui/Sheet';
import { cn } from '../../lib/cn';

const priceRanges: { label: string; value: [number, number | null] }[] = [
  { label: 'All Prices', value: [0, null] },
  { label: '₹0 - ₹200', value: [0, 200] },
  { label: '₹200 - ₹500', value: [200, 500] },
  { label: '₹500 & Above', value: [500, null] },
];

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [activePriceRange, setActivePriceRange] = useState<[number, number | null] | undefined>(undefined);
  const [activeSort, setActiveSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const itemsPerPage = 200; // show all products on one page

  useEffect(() => {
    api.get('/api/categories').then((data: { id: number; name: string }[]) => {
      if (Array.isArray(data)) {
        setCategories(['All', ...data.map((c) => c.name)]);
      }
    }).catch(() => {
      setCategories(['All', 'Spices', 'Flours', 'Pulses']);
    });
  }, []);

  useEffect(() => {
    setActiveCategory(urlCategory);
    setCurrentPage(1);
  }, [urlSearch, urlCategory]);

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

  const filterContent = (
    <div className="space-y-6 p-5">
      <FilterGroup title="Categories">
        {categories.map((cat) => (
          <FilterRadio key={cat} label={cat} checked={activeCategory === cat} onChange={() => handleCategoryChange(cat)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range">
        {priceRanges.map((range) => (
          <FilterRadio
            key={range.label}
            label={range.label}
            checked={
              (!activePriceRange && range.label === 'All Prices') ||
              (activePriceRange?.[0] === range.value[0] && activePriceRange?.[1] === range.value[1])
            }
            onChange={() => handlePriceChange(range.value)}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/5 bg-white">{filterContent}</div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold text-brand-950 sm:text-2xl">
                {urlSearch ? `Search: "${urlSearch}"` : activeCategory !== 'All' ? activeCategory : 'Our Products'}
              </h1>
              <p className="mt-0.5 text-xs text-black/50">
                Showing {startItem}–{endItem} of {totalItems} items
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-xs font-semibold text-brand-950 hover:bg-black/5 lg:hidden"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
              <select
                value={activeSort}
                onChange={(e) => { setActiveSort(e.target.value); setCurrentPage(1); }}
                className="rounded-full border border-black/10 px-3.5 py-2 text-xs font-semibold text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full text-sm font-semibold',
                    currentPage === page ? 'bg-brand-500 text-white' : 'text-brand-950 hover:bg-black/5'
                  )}
                >
                  {page}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-full px-4 text-sm font-semibold text-brand-600 hover:bg-black/5"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" side="bottom">
        {filterContent}
      </Sheet>
    </div>
  );
};

const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="mb-3 text-xs font-bold tracking-wide text-black/40">{title.toUpperCase()}</h3>
    <div className="space-y-2.5">{children}</div>
  </div>
);

const FilterRadio: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-black/70">
    <input type="radio" checked={checked} onChange={onChange} className="size-4 accent-brand-500" />
    <span className={checked ? 'font-semibold text-brand-950' : ''}>{label}</span>
  </label>
);

export default Shop;

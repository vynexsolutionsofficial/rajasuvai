import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'Pure Turmeric', image: '/products/turmeric.png' },
  { id: 2, name: 'Red Chilli', image: '/products/chilli.png' },
  { id: 3, name: 'Black Pepper', image: '/products/pepper.png' },
  { id: 4, name: 'Garam Masala', image: '/products/garam_masala.png' },
  { id: 5, name: 'Green Cardamom', image: '/products/cardamom.png' },
  { id: 6, name: 'Organic Saffron', image: '/products/saffron.png' },
];

const Categories: React.FC = () => {
  return (
    <section className="mx-auto max-w-(--container-page) px-6 py-12 sm:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-brand-500">ARTISANAL COLLECTION</span>
          <h2 className="mt-1 font-display text-2xl font-bold text-brand-950 sm:text-3xl">Shop by Category</h2>
        </div>
        <Link
          to="/shop"
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex"
        >
          Browse all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="group flex flex-col items-center gap-2.5 text-center"
          >
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-50 p-4 transition-colors group-hover:bg-brand-100">
              <img src={cat.image} alt={cat.name} className="size-full object-contain transition-transform group-hover:scale-105" />
            </div>
            <span className="text-xs font-semibold text-brand-950 sm:text-sm">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;

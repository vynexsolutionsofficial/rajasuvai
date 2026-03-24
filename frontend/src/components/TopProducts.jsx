import React, { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from './BestSellers';

export default function TopProducts() {
  const { addToCart } = useCart();
  const [added, setAdded] = useState({});
  const topProducts = products.slice(0, 8);

  const handleAdd = (product) => {
    addToCart(product);
    setAdded(p => ({ ...p, [product.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [product.id]: false })), 1500);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full flex flex-col items-center">

        <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-3 text-amber-600 mb-6 group mx-auto lg:mx-0">
              <span className="w-8 h-[2px] bg-amber-600 group-hover:w-12 transition-all" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em]">The Full Collection</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter leading-none italic uppercase">Explore <span className="text-amber-600 not-italic">Top Spices</span></h2>
          </div>
          
          <Link to="/products" className="inline-flex items-center gap-4 px-10 py-6 rounded-2xl border-2 border-stone-100 text-[12px] font-black uppercase tracking-[0.3em] text-stone-900 hover:text-white hover:bg-stone-900 transition-all group shadow-sm bg-stone-50/50 mx-auto lg:mx-0">
            Browse Everything
            <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform text-amber-600" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full">
          {topProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isAdded={!!added[product.id]}
              onAdd={() => handleAdd(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Star, Check, Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BestSellers() {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState('ALL');
  const [added, setAdded] = useState({});

  const tabs = ['ALL', 'WHOLE SPICES', 'MASALA POWDERS'];
  const filtered = filter === 'ALL'
    ? products.slice(0, 4)
    : products.filter(p => p.category.toUpperCase() === filter).slice(0, 4);

  const handleAdd = (product) => {
    addToCart(product);
    setAdded(p => ({ ...p, [product.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [product.id]: false })), 1500);
  };

  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full flex flex-col items-center">

        {/* Header */}
        <div className="text-center max-w-3xl mb-20">
          <p className="text-amber-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Curated Selection</p>
          <h2 className="text-4xl md:text-6xl font-black text-stone-900 leading-tight mb-6 tracking-tighter">Our Best Sellers</h2>
          <p className="text-stone-500 text-lg font-medium mb-12">Hand-picked by our master blenders, these are the spices that define the Rajasuvai experience.</p>
          
          {/* Filter tabs */}
          <div className="inline-flex bg-stone-100 p-1.5 rounded-2xl gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                  filter === tab
                    ? 'bg-white text-stone-900 shadow-premium'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isAdded={!!added[product.id]}
              onAdd={() => handleAdd(product)}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/products" className="bg-white/80 backdrop-blur-md border border-amber-600/20 text-amber-900 px-12 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-white hover:shadow-lg active:scale-95">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product, isAdded, onAdd }) {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-3xl transition-all duration-700 hover:-translate-y-3">
      {/* Save Button */}
      <button className="absolute top-5 right-5 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-stone-400 hover:text-amber-600 hover:bg-white transition-all shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-500">
        <Heart size={20} />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fbf9f6] flex items-center justify-center p-8 group">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>
        
        {/* Quick Add Overlay */}
        {!isAdded && (
          <div className="absolute inset-x-6 bottom-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 hidden md:block">
            <button
              onClick={onAdd}
              className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-amber-600/40 hover:bg-amber-700 transition-all active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-8 flex flex-col flex-1 text-center items-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">{product.category}</span>
          <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black text-stone-900">4.9</span>
            <span className="text-[10px] font-bold text-stone-400">/ 5.0</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="flex-1 w-full">
          <h3 className="text-xl font-black text-stone-900 mb-6 group-hover:text-amber-600 transition-colors line-clamp-1 italic tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Action Row */}
        <div className="w-full flex items-center justify-between mt-auto pt-6 border-t border-stone-50">
          <div className="text-left">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] block mb-1">Price</span>
            <span className="text-2xl font-black text-stone-900">₹{product.price}</span>
          </div>
          
          <button
            onClick={onAdd}
            className={`transition-all duration-500 rounded-2xl font-black text-[12px] tracking-[0.2em] px-8 py-3 ${
              isAdded 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-stone-900 text-white hover:bg-amber-600 shadow-xl'
            }`}
            aria-label="Add to cart"
          >
            {isAdded ? (
              <span className="flex items-center gap-2"><Check size={18} strokeWidth={3} /> ADDED</span>
            ) : (
              'ADD'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

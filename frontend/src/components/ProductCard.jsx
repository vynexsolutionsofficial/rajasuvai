import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Check } from 'lucide-react';

export default function ProductCard({ product, isAdded, onAdd }) {
  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-stone-100/60 flex flex-col h-full hover:shadow-2xl transition-all duration-500 group relative">
      {/* Image Container */}
      <div className="relative h-[240px] mb-6 overflow-hidden rounded-[1.5rem] bg-stone-50">
        <Link to={`/product/${product.id}`} className="block h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100">
            Organic
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col px-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600/80">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black text-stone-400">4.9</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-black text-stone-900 mb-6 leading-tight group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Footer: Price and Button */}
        <div className="mt-auto pt-5 border-t border-stone-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em] mb-1">M.R.P</span>
            <span className="text-2xl font-black text-stone-900 tracking-tighter">₹{product.price}</span>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onAdd(product);
            }}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 ${
              isAdded 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-stone-900 text-white hover:bg-amber-600 shadow-xl shadow-stone-900/10'
            }`}
          >
            {isAdded ? <Check size={20} strokeWidth={3} /> : <div className="text-xl font-black mb-1">+</div>}
          </button>
        </div>
      </div>
    </div>
  );
}

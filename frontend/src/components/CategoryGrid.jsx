import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const categories = [
  { name: 'Pure Turmeric', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=600', to: '/products' },
  { name: 'Red Chilli', image: 'https://images.unsplash.com/photo-1596547609201-9f935105634b?auto=format&fit=crop&q=80&w=600', to: '/products' },
  { name: 'Black Pepper', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600', to: '/products' },
  { name: 'Garam Masala', image: 'https://images.unsplash.com/photo-1599140021487-78972ca3102d?auto=format&fit=crop&q=80&w=600', to: '/products' },
  { name: 'Green Cardamom', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', to: '/products' },
  { name: 'Organic Nutmeg', image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=600', to: '/products' },
];

export default function CategoryGrid() {
  return (
    <section className="py-24 md:py-40 bg-white border-y border-stone-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-3xl mb-24">
          <div className="flex items-center justify-center gap-3 text-amber-600 mb-6 animate-fade-in group">
            <Sparkles size={20} className="group-hover:scale-125 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em]">Artisanal Collection</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-stone-900 tracking-tighter leading-none mb-10 italic uppercase">Shop by <span className="text-amber-600 not-italic">Category</span></h2>
          <p className="text-stone-500 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">Discover our collection of unadulterated, single-origin spices from the heart of India.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 w-full">
          {categories.map((cat, idx) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="group relative h-[550px] rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-4xl transition-all duration-1000 animate-fade-up border border-stone-100"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0 shadow-inner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/40 to-transparent" />
              <div className="absolute bottom-10 left-8 right-8">
                <h3 className="text-white font-black text-2xl lg:text-3xl leading-none group-hover:text-amber-500 transition-colors uppercase tracking-tight mb-4">{cat.name}</h3>
                <div className="flex items-center gap-3 text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                  Explore Now
                  <ArrowRight size={14} className="text-amber-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link to="/products" className="inline-flex items-center gap-6 px-16 py-6 rounded-full border-2 border-stone-900 text-stone-900 font-black text-lg hover:bg-stone-900 hover:text-white transition-all transform hover:scale-105 active:scale-95 group shadow-xl">
            Browse All Spices
            <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

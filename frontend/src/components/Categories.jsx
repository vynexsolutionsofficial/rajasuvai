import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Pure Turmeric', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=600', count: 12 },
  { name: 'Red Chilli', image: 'https://images.unsplash.com/photo-1596547609201-9f935105634b?auto=format&fit=crop&q=80&w=600', count: 24 },
  { name: 'Black Pepper', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600', count: 8 },
  { name: 'Garam Masala', image: 'https://images.unsplash.com/photo-1599140021487-78972ca3102d?auto=format&fit=crop&q=80&w=600', count: 18 },
  { name: 'Green Cardamom', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', count: 15 },
  { name: 'Organic Nutmeg', image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=600', count: 6 },
];

export default function Categories() {
  return (
    <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl mb-16">
          <p className="text-amber-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Discovery</p>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-6">Shop by Category</h2>
          <p className="text-stone-500 text-lg font-medium">Explore our meticulously curated collections of the finest South Indian spices.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full">
          {categories.map((cat) => (
            <div key={cat.name} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-premium hover:shadow-2xl transition-all duration-700">
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[1.5s]" 
                style={{ backgroundImage: `url(${cat.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-10 left-8 right-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-[1px] bg-amber-500" />
                  <span className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase">{cat.count} Variants</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase leading-none mb-1 group-hover:text-amber-500 transition-colors">{cat.name}</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">Explore Collection</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link to="/products" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-amber-600 transition-all group">
            Browse All Categories 
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

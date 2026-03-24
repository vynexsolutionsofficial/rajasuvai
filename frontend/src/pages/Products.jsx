import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { Filter, ChevronDown, Flame, SlidersHorizontal, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Whole Spices', 'Masala Powders', 'Blends'];
const SORTS = ['Newest First', 'Price: Low to High', 'Price: High to Low', 'Best Sellers'];

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest First');
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="bg-[#faf9f7] min-h-screen">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section className="relative bg-stone-950 overflow-hidden pt-16 pb-0">
        {/* Spice bg image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_background_new.png"
            alt="Spice backdrop"
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/50 to-stone-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />
        </div>

        {/* Glows */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-600/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none z-10" />

        <div className="relative z-20 page-container pt-52 pb-32">
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 bg-amber-600/15 border border-amber-600/30 rounded-xl flex items-center justify-center">
                <Flame size={16} className="text-amber-400" strokeWidth={2.5} />
              </span>
              <span className="text-amber-400 text-[11px] font-black uppercase tracking-[0.6em]">Handpicked Excellence</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-white leading-[0.85] tracking-tighter uppercase mb-8 animate-fade-up">
              Authentic
              <span className="block italic lowercase text-amber-500 tracking-normal animate-fade-up" style={{ animationDelay: '0.1s' }}>spices.</span>
            </h1>

            <p className="text-stone-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Every spice harvested at peak potency from South India's finest organic estates. Zero additives. Pure flavour.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-10">
              {[
                { label: 'Products', value: '12+' },
                { label: 'Avg. Rating', value: '4.9★' },
                { label: 'Happy Families', value: '4,000+' },
              ].map(s => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">{s.value}</span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom transition */}
        <div className="relative z-20 h-16 overflow-hidden">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 64L1440 64L1440 20C1200 60 840 0 720 10C600 20 240 70 0 20L0 64Z" fill="#faf9f7"/>
          </svg>
        </div>
      </section>

      {/* ── Filters & Grid ─────────────────────────────────── */}
      <section className="page-container py-12">

        {/* Filter / Sort Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">

          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300
                  ${activeFilter === cat
                    ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/15'
                    : 'bg-white border border-stone-200 text-stone-500 hover:border-amber-500 hover:text-amber-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: count + sort */}
          <div className="flex items-center gap-5">
            <span className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">
              Showing <span className="text-stone-900">12 Premium</span> Products
            </span>

            <div className="relative">
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-3 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-stone-700 hover:border-amber-500 transition-all"
              >
                <SlidersHorizontal size={14} strokeWidth={2.5} />
                {activeSort}
                <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-20 animate-fade-in">
                  {SORTS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setActiveSort(s); setSortOpen(false); }}
                      className={`w-full text-left px-5 py-3.5 text-[11px] font-black uppercase tracking-widest transition-colors
                        ${activeSort === s ? 'bg-amber-50 text-amber-600' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid />

        {/* Bottom CTA */}
        <div className="mt-20 py-20 text-center bg-stone-900 rounded-[2rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.6em] mb-4">Freshly Ground</p>
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-6">Can't find what you need?</h2>
            <p className="text-stone-400 font-medium mb-10 max-w-md mx-auto text-lg">
              We source directly from farmers. Contact us for custom bulk orders or rare spice requests.
            </p>
            <a
              href="https://wa.me/919999999999"
              className="inline-flex items-center gap-3 px-10 py-5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-full text-sm uppercase tracking-widest shadow-2xl shadow-amber-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Contact on WhatsApp
              <ArrowRight size={20} />
            </a>
          </div>
        </div>

      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-stone-950 text-center py-24">
      {/* Background & Overlays */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <img
          src="/images/hero_background_new.png"
          alt="Premium Spice Background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/50 to-stone-950/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/40 z-20" />
        {/* Amber glow accents */}
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-amber-600/8 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-30" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-amber-900/8 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/3 pointer-events-none z-30" />
      </div>

      <div className="relative z-40 w-full px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">

          {/* Eyebrow label */}
          <span className="text-stone-400 text-[10px] md:text-xs font-black uppercase tracking-[0.8em] animate-fade-in block mb-10 opacity-80">
            Pure Artisanal Sourcing
          </span>

          {/* Main Headline */}
          <div className="mb-14 space-y-2">
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] font-black text-white leading-[0.85] tracking-tighter uppercase animate-fade-up"
            >
              Experience the
              <span className="block">Essence of</span>
            </h1>
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] font-black italic lowercase tracking-tight animate-fade-up text-mask bg-[url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200')] bg-fixed bg-cover bg-center"
              style={{ animationDelay: '0.1s' }}
            >
              every single grain.
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto mb-16 animate-fade-up leading-relaxed font-medium"
            style={{ animationDelay: '0.2s' }}
          >
            Join thousands of discerning families who have elevated their daily rituals with the unmatched purity of Rajasuvai.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up mb-28"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              to="/products"
              className="bg-amber-600 hover:bg-amber-500 text-white font-black px-14 py-6 rounded-full text-lg shadow-2xl shadow-amber-600/40 hover:scale-105 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center"
            >
              Start Shopping
            </Link>
            <Link
              to="/products"
              className="bg-white/5 backdrop-blur-md border-2 border-white/25 hover:border-white hover:bg-white/10 text-white font-black px-14 py-6 rounded-full text-lg flex items-center justify-center gap-4 transition-all group hover:scale-105 active:scale-95"
            >
              Explore Heritage
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Trust Section */}
          <div className="flex flex-col items-center gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-stone-950 bg-stone-800 overflow-hidden shadow-2xl hover:scale-110 hover:z-10 transition-transform">
                  <img src={`https://i.pravatar.cc/100?u=${i + 45}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-stone-950 bg-amber-600 flex items-center justify-center text-xs font-black text-white shadow-2xl">
                +4k
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} size={16} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-stone-500 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-center">
                Endorsed by over <span className="text-stone-300">4,000+</span> Master Chefs Worldwide
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

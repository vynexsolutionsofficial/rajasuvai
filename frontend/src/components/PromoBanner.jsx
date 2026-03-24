import React from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PromoBanner() {
  return (
    <section className="relative w-full py-32 overflow-hidden bg-stone-950">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1600"
          alt="Spice Texture"
          className="w-full h-full object-cover opacity-20 grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>

      <div className="relative z-10 page-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="text-center lg:text-left flex-1 max-w-3xl">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-600/10 text-amber-500 rounded-full text-[11px] font-black uppercase tracking-[0.5em] mb-10 border border-amber-600/20 backdrop-blur-xl">
              <Tag size={16} strokeWidth={3} />
              Exclusive Seasonal Offer
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-10 tracking-tighter uppercase italic">
              Unlock the <br className="hidden md:block" />
              flavor of <span className="text-amber-500 not-italic lowercase tracking-normal block md:inline mt-2">indian summers.</span>
            </h2>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10">
              <p className="text-stone-300 text-xl md:text-2xl font-medium leading-tight max-w-md italic opacity-90">
                Experience <span className="text-white font-black underline decoration-amber-500 decoration-[6px] underline-offset-[10px]">15% OFF</span> your first harvest.
              </p>
              
              <div className="bg-white/5 border border-white/10 px-10 py-5 rounded-3xl backdrop-blur-2xl group hover:border-amber-600/50 transition-all duration-500">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.5em] block mb-2">Use Voucher Code:</span>
                <span className="text-3xl font-black text-amber-500 tracking-[0.3em] group-hover:scale-105 inline-block transition-transform">SUMMER15</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <Link
              to="/products"
              className="bg-amber-600 hover:bg-amber-500 text-white font-black px-12 py-6 rounded-full text-xl shadow-2xl shadow-amber-600/40 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center gap-4 whitespace-nowrap"
            >
              Claim Discount
              <ArrowRight size={24} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

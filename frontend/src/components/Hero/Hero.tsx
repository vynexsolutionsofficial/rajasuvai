import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroBg from '../../assets/hero-bg-v2.png';

const Hero: React.FC = () => {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden sm:min-h-[640px]">
      <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

      <div className="relative mx-auto w-full max-w-(--container-page) px-6 py-16 text-center sm:px-10">
        <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-100 backdrop-blur">
          PURE ORGANIC SPICES
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl leading-[1.1] font-extrabold text-white sm:text-5xl lg:text-6xl">
          Experience the quality of every single grain.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base text-white/85">
          Sourced directly from local farms to ensure the highest quality for your kitchen.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop"
            className="rounded-full bg-brand-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-950/30 transition-colors hover:bg-brand-600"
          >
            Start Shopping
          </Link>
          <Link
            to="/story"
            className="flex items-center gap-1.5 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Our Story <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { ArrowRight } from 'lucide-react';
import offerBg from '../../../assets/hero-premium-bg.png';

const SpecialOfferBanner: React.FC = () => {
  return (
    <div className="relative flex min-h-[280px] items-center overflow-hidden rounded-3xl">
      <img src={offerBg} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/70 to-brand-950/20" />
      <div className="relative max-w-md px-8 py-10 sm:px-12">
        <span className="inline-block rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold tracking-widest text-brand-100 backdrop-blur">
          LIMITED SEASON SPECIAL
        </span>
        <h2 className="mt-4 font-display text-3xl leading-tight font-extrabold text-white">
          Experience the authenticity — <span className="text-brand-300">20% off</span>
        </h2>
        <p className="mt-3 text-sm text-white/75">
          On all hand-ground masalas and organic seed collections. Use code <strong className="text-white">SUVAI20</strong>
        </p>
        <button className="mt-6 flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600">
          Claim My Offer <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const showcaseItems = [
  { image: '/products/pepper.png', name: 'Tellicherry Black Pepper', price: 450 },
  { image: '/products/turmeric.png', name: 'Khandwala Turmeric', price: 280 },
  { image: '/products/chilli.png', name: 'Guntur Sannam Chilli', price: 320 },
];

const ProductShowcase: React.FC = () => {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
      <span className="text-xs font-bold tracking-widest text-brand-500">CURATED COLLECTION</span>
      <h2 className="mt-1 font-display text-2xl font-bold text-brand-950">Expert's Choice</h2>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {showcaseItems.map((item) => (
          <div key={item.name} className="text-center">
            <div className="mb-3 flex aspect-square items-center justify-center rounded-2xl bg-brand-50 p-3">
              <img src={item.image} alt={item.name} className="size-full object-contain" />
            </div>
            <h4 className="line-clamp-2 text-xs font-semibold text-brand-950 sm:text-sm">{item.name}</h4>
            <p className="mt-1 text-sm font-bold text-brand-600">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const OfferBanners: React.FC = () => {
  return (
    <section className="mx-auto max-w-(--container-page) px-6 py-12 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SpecialOfferBanner />
        </div>
        <div className="lg:col-span-2">
          <ProductShowcase />
        </div>
      </div>
    </section>
  );
};

export default OfferBanners;

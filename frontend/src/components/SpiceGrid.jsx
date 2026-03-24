import React from 'react';

const gridItems = [
  { label: 'Bardakum', image: '/images/hero_spice.png' },
  { label: 'Roaste Seeds', image: '/images/star_anise.png' },
  { label: 'Cardamom', image: '/images/cardamom.png' },
  { label: 'Nutmeg', image: '/images/nutmeg.png' },
];

export default function SpiceGrid() {
  return (
    <div className="py-20 bg-white px-4 md:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Large Offer Card */}
        <div className="relative h-[400px] md:h-full bg-dark rounded-3xl overflow-hidden group">
          <img 
            src="/images/hero_spice.png" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
            alt="Offer"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <h4 className="text-primary font-black text-xl mb-4 italic uppercase tracking-widest">The Flavors of Spices</h4>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight uppercase tracking-tighter">
              30% FLAT OFFER <br/> ALL PRODUCTS
            </h2>
            <button className="px-10 py-4 bg-primary text-white font-black rounded-lg uppercase tracking-widest hover:bg-primary-dark transition-all">
              Shop Now
            </button>
          </div>
        </div>

        {/* Small Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {gridItems.map((item) => (
            <div key={item.label} className="relative aspect-square rounded-3xl overflow-hidden group">
              <img src={item.image} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4">
                <div className="bg-black/80 backdrop-blur-md text-white py-2 px-4 text-center rounded-lg">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{item.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

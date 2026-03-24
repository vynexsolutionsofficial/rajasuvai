import { ShieldCheck, Leaf, Truck, ChefHat } from 'lucide-react';

export default function TrustStrip() {
  const items = [
    { icon: Leaf, title: '100% Organic', desc: 'No chemicals, pure nature.' },
    { icon: ChefHat, title: 'Heritage Flavor', desc: 'Traditional artisan methods.' },
    { icon: ShieldCheck, title: 'Uncompromising Quality', desc: 'Zero preservatives added.' },
    { icon: Truck, title: 'Direct to Home', desc: 'Fast, trackable shipping.' },
  ];

  return (
    <section className="bg-stone-900 py-20 border-y border-white/5 relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-amber-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-amber-600/5 blur-[100px] pointer-events-none" />
      
      <div className="page-container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col md:flex-row items-center gap-6 group">
              <div className="w-20 h-20 shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-amber-600 group-hover:border-amber-600 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(217,119,6,0.3)] shadow-2xl text-amber-500 group-hover:text-white">
                <Icon size={32} strokeWidth={2} />
              </div>
              <div className="flex flex-col text-center md:text-left">
                <h4 className="text-white font-black text-lg mb-1 tracking-tight group-hover:text-amber-500 transition-colors uppercase italic">{title}</h4>
                <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed group-hover:text-stone-300 transition-colors">{desc}</p>
                <div className="w-0 h-[2px] bg-amber-600 mt-2 transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Leaf, FlaskConical, ChefHat, ArrowRight, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Leaf,
    title: 'Farm to Kitchen',
    desc: 'Sourced directly from organic farms at peak harvest season to ensure maximum potency and flavor.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: ShieldCheck,
    title: 'Purity First',
    desc: 'Strictly zero additives, artificial colors, or preservatives. Just pure, unadulterated nature.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Sparkles,
    title: 'Artisan Crafted',
    desc: 'Traditional slow-grinding methods preserve essential oils and the soul of the spice.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

export default function WhyRajasuvai() {
  return (
    <section className="bg-white py-24">
      <div className="page-container">
        <div className="text-center max-w-4xl mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px] uppercase tracking-widest mb-6">
            <HeartPulse size={14} />
            The Rajasuvai Promise
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-stone-900 leading-tight mb-8 tracking-tighter italic">
            Why settle for <br />
            <span className="text-amber-600 not-italic">ordinary flavors?</span>
          </h2>
          <p className="text-stone-500 text-lg md:text-xl font-medium leading-relaxed">
            We transcend the commercial standard. Every spice in our collection is a testament to our commitment to authenticity, health, and the legacy of Indian kitchens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-32">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex flex-col items-center text-center p-12 rounded-[2.5rem] bg-stone-50 border border-stone-100 group hover:bg-stone-900 hover:shadow-3xl transition-all duration-700 hover:-translate-y-2">
              <div className={`w-24 h-24 shrink-0 ${bg} ${color} rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-sm mb-12`}>
                <Icon size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-6 group-hover:text-white transition-colors tracking-tight">{title}</h3>
              <p className="text-stone-500 text-lg leading-relaxed font-medium group-hover:text-stone-400 transition-colors">{desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

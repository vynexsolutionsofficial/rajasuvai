import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Flame, ShieldCheck, Sparkles, Heart } from 'lucide-react';

const MILESTONES = [
  { year: '1994', title: 'Founded in Coimbatore', desc: 'A family vision to bring pure, unadulterated spices directly from South Indian farms to the home kitchen.' },
  { year: '2006', title: 'First Organic Certification', desc: 'Certified by India Organic, ensuring zero pesticides and 100% natural cultivation methods across all partner farms.' },
  { year: '2015', title: 'Slow-Grind Process Perfected', desc: 'We adopted traditional stone-grinding methods that preserve essential oils and the true soul of every spice.' },
  { year: '2024', title: '4,000+ Families Served', desc: 'A loyal community of discerning home cooks, professional chefs, and wellness enthusiasts across India.' },
];

const VALUES = [
  {
    icon: Leaf,
    title: 'Farm Direct',
    desc: 'We partner exclusively with certified organic farms and cut every middleman — keeping it honest, traceable, and pure.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Compromise',
    desc: 'No artificial colors. No preservatives. No fillers. Just the spice, exactly as nature intended.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Heart,
    title: 'Artisan Crafted',
    desc: 'Every batch is slow-ground and hand-packed in small quantities to preserve freshness and maximum flavour potency.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
];

export default function OurStory() {
  return (
    <div className="bg-[#faf9f7] min-h-screen">

      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative bg-stone-950 overflow-hidden pt-0">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_background_new.png"
            alt="Our Story"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/55 to-stone-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/30 to-transparent" />
        </div>

        {/* Glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-700/12 rounded-full blur-[150px] -translate-y-1/3 -translate-x-1/4 pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[120px] translate-y-1/3 translate-x-1/4 pointer-events-none z-10" />

        <div className="relative z-20 page-container pt-52 pb-36">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 bg-amber-600/15 border border-amber-600/30 rounded-xl flex items-center justify-center">
                <Sparkles size={15} className="text-amber-400" strokeWidth={2.5} />
              </span>
              <span className="text-amber-400 text-[11px] font-black uppercase tracking-[0.6em]">Since 1994</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-white leading-[0.85] tracking-tighter uppercase mb-8 animate-fade-up">
              Our
              <span className="block italic lowercase text-amber-500 tracking-normal animate-fade-up" style={{ animationDelay: '0.1s' }}>heritage.</span>
            </h1>

            <p className="text-stone-300 text-lg md:text-2xl font-medium max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Born in Coimbatore. Rooted in tradition. We have spent three decades obsessing over one thing — delivering the most honest, potent, and pure spices on the planet.
            </p>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="relative z-20 h-16 overflow-hidden">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 64L1440 64L1440 20C1200 60 840 0 720 10C600 20 240 70 0 20L0 64Z" fill="#faf9f7"/>
          </svg>
        </div>
      </section>

      {/* ── Mission Statement ────────────────────────────── */}
      <section className="page-container py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Big quote */}
          <div>
            <p className="text-amber-600 text-[11px] font-black uppercase tracking-[0.6em] mb-6">Our Mission</p>
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter leading-tight mb-8 italic">
              "Spice should never be a
              <span className="text-amber-600 not-italic block"> compromise."</span>
            </h2>
            <p className="text-stone-500 text-lg font-medium leading-relaxed mb-8">
              We believe every family deserves access to spices that are genuinely pure — not diluted, not artificially colored, not industrially processed. This belief has driven every decision we have made since 1994.
            </p>
            <p className="text-stone-500 text-lg font-medium leading-relaxed">
              From the farms we choose to the stone mills we use, each step of our supply chain is meticulously designed to preserve flavour, potency, and truth.
            </p>
          </div>

          {/* Right: Stacked image blocks */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=500', label: 'Turmeric Harvest' },
                { img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=500', label: 'Black Pepper' },
                { img: 'https://images.unsplash.com/photo-1599140021487-78972ca3102d?auto=format&fit=crop&q=80&w=500', label: 'Masala Blending' },
                { img: 'https://images.unsplash.com/photo-1596547609201-9f935105634b?auto=format&fit=crop&q=80&w=500', label: 'Red Chilli' },
              ].map((item, i) => (
                <div key={i} className={`overflow-hidden rounded-2xl shadow-lg group ${i === 0 ? 'mt-8' : i === 3 ? '-mt-8' : ''}`}>
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="bg-white px-4 py-3">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-amber-600 text-white rounded-2xl px-6 py-4 shadow-2xl shadow-amber-600/30">
              <p className="text-2xl font-black">30+</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Years of Heritage</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────── */}
      <section className="bg-stone-900 py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="page-container relative z-10">
          <div className="text-center mb-20">
            <p className="text-amber-400 text-[11px] font-black uppercase tracking-[0.6em] mb-4">Our Journey</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
              Three decades of <span className="text-amber-500 not-italic">dedication.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="relative group">
                {/* Connector line */}
                {i < MILESTONES.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-stone-700 z-0 group-hover:bg-amber-600/30 transition-colors duration-500" />
                )}
                <div className="relative z-10 p-8 rounded-2xl bg-stone-800/50 border border-stone-700/50 hover:border-amber-600/30 hover:bg-stone-800 transition-all duration-500 hover:-translate-y-2">
                  <span className="inline-block px-3 py-1 bg-amber-600 text-white text-xs font-black rounded-full mb-5 tracking-wider">
                    {m.year}
                  </span>
                  <h3 className="text-white font-black text-xl mb-4 tracking-tight leading-tight">{m.title}</h3>
                  <p className="text-stone-400 font-medium text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values Section ───────────────────────────────── */}
      <section className="page-container py-28">
        <div className="text-center mb-20">
          <p className="text-amber-600 text-[11px] font-black uppercase tracking-[0.6em] mb-4">What We Stand For</p>
          <h2 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter italic">
            The Rajasuvai <span className="text-amber-600 not-italic">Promise.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {VALUES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="p-10 rounded-3xl bg-white border border-stone-100 shadow-sm hover:-translate-y-3 hover:shadow-2xl transition-all duration-700 group">
              <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={30} className={color} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight mb-4">{title}</h3>
              <p className="text-stone-500 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="page-container pb-28">
        <div className="bg-stone-900 rounded-[2rem] px-12 md:px-24 py-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-amber-400 text-[11px] font-black uppercase tracking-[0.6em] mb-4">Taste the Difference</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic mb-6">
              Ready to experience <span className="text-amber-500 not-italic block">purity?</span>
            </h2>
            <p className="text-stone-400 font-medium text-lg max-w-lg mx-auto mb-12">
              Explore our full collection of artisanal, farm-direct spices and taste the Rajasuvai difference.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-12 py-5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-full text-sm uppercase tracking-widest shadow-2xl shadow-amber-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Shop the Collection
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, Globe, Heart, ShieldCheck, Sun } from 'lucide-react';
import heroImage from '../../assets/hero-premium-bg.png';
import storyImg1 from '../../assets/hero-bg-v2.png';

const pillars = [
  { icon: Award, title: 'Tradition', desc: 'Our recipes are heirlooms. We use traditional roasting and grinding methods calibrated to release complex essential oils, ensuring authentic taste.' },
  { icon: Globe, title: 'Direct Sourcing', desc: 'We partner directly with the finest spice estates and farmers across South India, securing the highest grade harvest for our blends.' },
  { icon: Leaf, title: 'Sustainability', desc: 'Premium quality extends to the earth. We are committed to eco-conscious practices and encouraging sustainable farming methods.' },
  { icon: ShieldCheck, title: 'Purity Guaranteed', desc: 'No artificial colors, no preservatives, no fillers. Every batch undergoes rigorous testing to meet our strict standards.' },
];

const OurStory: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[380px] items-center overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-(--container-page) px-6 py-16 text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-100 backdrop-blur">SINCE 1984</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-white sm:text-5xl">Our Story</h1>
          <p className="mx-auto mt-3 max-w-md text-white/80">Defining the standard of premium authentic taste for nearly four decades.</p>
        </div>
      </section>

      {/* Legacy */}
      <section className="mx-auto max-w-(--container-page) px-6 py-14 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-brand-950">A Legacy of <span className="text-brand-600">Flavor</span></h2>
            <p className="mt-4 text-sm leading-relaxed text-black/65">
              For nearly four decades, Rajasuvai has been synonymous with uncompromising quality and authentic South Indian flavors. What started as a small, passionate endeavor to preserve traditional spice blends has grown into a definitive source for premium culinary staples.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">
              We believe that true flavor cannot be rushed, and genuine quality cannot be compromised. Every pinch of our spice tells a story of sun-drenched fields, meticulous harvesting, and a passion for perfection.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[['40+', 'Years of Legacy'], ['100%', 'Pure & Natural'], ['5k+', 'Happy Families']].map(([num, label]) => (
                <div key={label}>
                  <h3 className="font-display text-2xl font-extrabold text-brand-600">{num}</h3>
                  <span className="text-xs text-black/50">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl">
            <img src={storyImg1} alt="Rajasuvai Spices" className="aspect-4/5 w-full object-cover" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-brand-950 shadow-lg backdrop-blur">
              <Sun size={16} className="text-brand-500" /> Sun-Dried Perfection
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-brand-50/50 py-14 sm:py-20">
        <div className="mx-auto max-w-(--container-page) px-6">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-display text-3xl font-bold text-brand-950">Our Core <span className="text-brand-600">Philosophy</span></h2>
            <p className="mt-2 text-sm text-black/55">The four pillars that hold up the standard of the Rajasuvai name.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-black/5 bg-white p-5">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <Icon size={22} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-brand-950">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-black/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-950 py-16 text-center">
        <div className="relative mx-auto max-w-lg px-6">
          <Heart size={40} className="mx-auto text-brand-400" />
          <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">Experience the Difference</h2>
          <p className="mt-2 text-sm text-white/70">Taste the legacy of Rajasuvai in your own kitchen.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-brand-500 px-7 py-3 text-sm font-bold text-white hover:bg-brand-600">
            Explore Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OurStory;

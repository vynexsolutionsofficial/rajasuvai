import React from 'react';
import { ShieldCheck, Sprout, FlaskConical, ScrollText, PackageCheck } from 'lucide-react';

const benefits = [
  { icon: Sprout, title: 'Direct Sourcing', desc: 'From the heart of South Indian farms.' },
  { icon: FlaskConical, title: 'Lab Tested', desc: 'Uncompromising purity & curcumin standards.' },
  { icon: ScrollText, title: 'Traditional Recipes', desc: 'Authenticity preserved across generations.' },
  { icon: PackageCheck, title: 'Artisanal Processing', desc: 'Small-batch crafted for peak flavor.' },
];

const QualityGuarantee: React.FC = () => {
  return (
    <section className="bg-brand-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-(--container-page) px-6 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-500">
          <ShieldCheck size={14} /> OUR QUALITY GUARANTEE
        </div>
        <h2 className="mx-auto mt-3 max-w-md font-display text-2xl font-bold text-brand-950 sm:text-3xl">
          Why settle for <span className="text-brand-600">ordinary flavors?</span>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-black/5 bg-white p-5">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Icon size={22} />
              </div>
              <h3 className="mt-3 text-sm font-bold text-brand-950">{title}</h3>
              <p className="mt-1 text-xs text-black/50">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualityGuarantee;

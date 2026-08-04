import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Leaf } from 'lucide-react';

const essentials = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: 'UPI, Cards, and Net Banking' },
  { icon: RotateCcw, title: '7-Day Return', desc: 'Easy and hassle-free returns' },
  { icon: Leaf, title: '100% Organic', desc: 'No artificial flavors or colors' },
];

const BrandBenefitsRow: React.FC = () => {
  return (
    <section className="border-b border-black/5 bg-white">
      <div className="mx-auto grid max-w-(--container-page) grid-cols-2 gap-6 px-6 py-6 sm:grid-cols-4 sm:py-8">
        {essentials.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-brand-950">{title}</h4>
              <p className="truncate text-xs text-black/50">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandBenefitsRow;

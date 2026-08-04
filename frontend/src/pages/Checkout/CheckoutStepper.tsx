import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

const steps = ['Cart', 'Address', 'Payment'];

const CheckoutStepper: React.FC<{ current: 1 | 2 | 3 }> = ({ current }) => {
  return (
    <div className="mx-auto mb-8 flex max-w-sm items-center justify-center gap-2 sm:mb-10">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-xs font-bold',
                  done ? 'bg-fresh-500 text-white' : active ? 'bg-brand-500 text-white' : 'bg-black/5 text-black/40'
                )}
              >
                {done ? <Check size={14} /> : step}
              </div>
              <span className={cn('text-xs font-semibold', active ? 'text-brand-950' : 'text-black/40')}>{label}</span>
            </div>
            {step < steps.length && <div className={cn('mb-4 h-0.5 w-10 sm:w-16', done ? 'bg-fresh-500' : 'bg-black/10')} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;

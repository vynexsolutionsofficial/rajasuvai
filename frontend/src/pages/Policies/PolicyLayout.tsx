import React from 'react';

const PolicyLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
    <div className="mb-8 border-b border-black/5 pb-6 text-center">
      <h1 className="font-display text-3xl font-bold text-brand-950">{title}</h1>
      <p className="mt-1.5 text-xs text-black/40">Last Updated: May 2026</p>
    </div>
    <div className="space-y-4 text-sm leading-relaxed text-black/65">{children}</div>
  </div>
);

export const PolicyHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mt-8 mb-2 font-display text-lg font-bold text-brand-950">{children}</h2>
);

export const PolicyList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="list-disc space-y-1.5 pl-5">{children}</ul>
);

export default PolicyLayout;

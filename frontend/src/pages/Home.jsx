import React from 'react';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import CategoryGrid from '../components/CategoryGrid';
import BestSellers from '../components/BestSellers';
import WhyRajasuvai from '../components/WhyRajasuvai';
import PromoBanner from '../components/PromoBanner';
import TopProducts from '../components/TopProducts';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <BestSellers />
      <WhyRajasuvai />
      <TopProducts />
    </div>
  );
}

import React from 'react';
import Categories from './Categories/Categories';
import FeaturedProducts from './FeaturedProducts/FeaturedProducts';
import OffersDeals from './OffersDeals/OffersDeals';
import BestSellers from './BestSellers/BestSellers';

const HomeContent: React.FC = () => {
  return (
    <div className="home-content">
      <Categories />
      <FeaturedProducts />
      <OffersDeals />
      <BestSellers />
    </div>
  );
};

export default HomeContent;

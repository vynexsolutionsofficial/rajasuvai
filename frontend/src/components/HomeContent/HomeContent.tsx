import React from 'react';
import Categories from './Categories/Categories';
import QualityGuarantee from './QualityGuarantee/QualityGuarantee';
import FeaturedProducts from './FeaturedProducts/FeaturedProducts';
import OffersDeals from './OffersDeals/OffersDeals';
import BestSellers from './BestSellers/BestSellers';
import BrandBenefitsRow from './BrandBenefitsRow/BrandBenefitsRow';

const HomeContent: React.FC = () => {
  return (
    <div className="home-content">
      <Categories />
      <QualityGuarantee />
      <FeaturedProducts />
      <OffersDeals />
      <BestSellers />
      <BrandBenefitsRow />
    </div>
  );
};

export default HomeContent;

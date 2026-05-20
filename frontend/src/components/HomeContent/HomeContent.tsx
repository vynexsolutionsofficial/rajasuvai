import React from 'react';
import Categories from './Categories/Categories';
import FeaturedProducts from './FeaturedProducts/FeaturedProducts';
import OfferBanners from './OfferBanners/OfferBanners';
import QualityGuarantee from './QualityGuarantee/QualityGuarantee';
import BrandBenefitsRow from './BrandBenefitsRow/BrandBenefitsRow';

const HomeContent: React.FC = () => {
  return (
    <div className="home-content">
      <BrandBenefitsRow />
      <Categories />
      <FeaturedProducts />
      <OfferBanners />
      <QualityGuarantee />
    </div>
  );
};

export default HomeContent;

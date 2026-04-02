import React from 'react';
import Categories from './Categories/Categories';
import OfferBanners from './OfferBanners/OfferBanners';
import QualityGuarantee from './QualityGuarantee/QualityGuarantee';
import BrandBenefitsRow from './BrandBenefitsRow/BrandBenefitsRow';

const HomeContent: React.FC = () => {
  return (
    <div className="home-content">
      <Categories />
      <OfferBanners />
      <QualityGuarantee />
      <BrandBenefitsRow />
    </div>
  );
};

export default HomeContent;

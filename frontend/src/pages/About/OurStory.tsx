import React from 'react';
import './OurStory.css';
import { Leaf, Award, Globe, Heart } from 'lucide-react';
import heroImage from '../../assets/hero-bg-v2.png';

const OurStory: React.FC = () => {
  return (
    <div className="our-story-page">
      {/* Hero Section */}
      <section className="story-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="story-hero-overlay"></div>
        <div className="container story-hero-content">
          <h1>Our Story</h1>
          <p>Defining the standard of premium authentic taste since 1984.</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="story-intro container">
        <div className="intro-text">
          <h2>A Legacy of Flavor</h2>
          <p>
            For nearly four decades, Rajasuvai has been synonymous with uncompromising quality 
            and authentic South Indian flavors. What started as a small, passionate endeavor 
            to preserve traditional spice blends has grown into a definitive source for premium 
            culinary staples. We believe that true flavor cannot be rushed, and genuine 
            quality cannot be compromised.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="story-pillars container">
        <div className="pillar-grid">
          <div className="pillar-card">
            <div className="pillar-icon">
              <Award size={32} />
            </div>
            <h3>Tradition</h3>
            <p>
              Our recipes are heirlooms, passed down through generations. 
              We use traditional roasting and grinding methods, precisely calibrated 
              to release the complex essential oils within each spice, ensuring 
              the authentic taste of our heritage in every pinch.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <Globe size={32} />
            </div>
            <h3>Direct Sourcing</h3>
            <p>
              We bypass intermediaries to partner directly with the finest 
              spice estates and farmers across South India. This direct relationship 
              ensures fair compensation for cultivators and secures the highest 
              grade harvest exclusively for our blends.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <Leaf size={32} />
            </div>
            <h3>Sustainability</h3>
            <p>
              Premium quality extends to how we treat the earth. We are committed 
              to eco-conscious practices, from encouraging sustainable farming methods 
              among our partners to utilizing biodegradable and recyclable packaging 
              wherever possible.
            </p>
          </div>
          
          <div className="pillar-card">
            <div className="pillar-icon">
              <Heart size={32} />
            </div>
            <h3>Purity Guaranteed</h3>
            <p>
              No artificial colors, no preservatives, no fillers. Just pure, 
              unadulterated ingredients. Every batch undergoes rigorous quality 
              testing to ensure it meets the strict standards that bear the 
              Rajasuvai name.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="story-cta">
        <div className="container">
          <h2>Experience the Difference</h2>
          <p>Taste the legacy of Rajasuvai in your own kitchen.</p>
          <a href="/shop" className="story-btn">Explore Our Collection</a>
        </div>
      </section>
    </div>
  );
};

export default OurStory;

import React, { useEffect } from 'react';
import './OurStory.css';
import { Leaf, Award, Globe, Heart, ShieldCheck, Sun } from 'lucide-react';
import heroImage from '../../assets/hero-premium-bg.png';
import storyImg1 from '../../assets/hero-bg-v2.png';

const OurStory: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="our-story-page">
      {/* Hero Section */}
      <section className="os-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="os-hero-overlay"></div>
        <div className="os-hero-content container">
          <div className="os-hero-badge">Since 1984</div>
          <h1 className="os-hero-title">Our Story</h1>
          <p className="os-hero-subtitle">
            Defining the standard of premium authentic taste for nearly four decades.
          </p>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="os-legacy-section">
        <div className="container os-legacy-grid">
          <div className="os-legacy-text">
            <h2>A Legacy of <span className="os-highlight">Flavor</span></h2>
            <p>
              For nearly four decades, Rajasuvai has been synonymous with uncompromising quality 
              and authentic South Indian flavors. What started as a small, passionate endeavor 
              to preserve traditional spice blends has grown into a definitive source for premium 
              culinary staples. 
            </p>
            <p>
              We believe that true flavor cannot be rushed, and genuine 
              quality cannot be compromised. Every pinch of our spice tells a story of 
              sun-drenched fields, meticulous harvesting, and a passion for perfection.
            </p>
            <div className="os-stats">
              <div className="os-stat">
                <h3>40+</h3>
                <span>Years of Legacy</span>
              </div>
              <div className="os-stat">
                <h3>100%</h3>
                <span>Pure & Natural</span>
              </div>
              <div className="os-stat">
                <h3>5k+</h3>
                <span>Happy Families</span>
              </div>
            </div>
          </div>
          <div className="os-legacy-image">
            <div className="os-img-wrapper">
              <img src={storyImg1} alt="Rajasuvai Spices" />
              <div className="os-img-badge">
                <Sun size={24} />
                <span>Sun-Dried Perfection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="os-pillars-section">
        <div className="container">
          <div className="os-pillars-header">
            <h2>Our Core <span className="os-highlight">Philosophy</span></h2>
            <p>The four pillars that hold up the standard of the Rajasuvai name.</p>
          </div>
          <div className="os-pillars-grid">
            <div className="os-pillar-card">
              <div className="os-pillar-icon-wrapper">
                <Award size={28} />
              </div>
              <h3>Tradition</h3>
              <p>
                Our recipes are heirlooms. We use traditional roasting and grinding methods 
                calibrated to release complex essential oils, ensuring authentic taste.
              </p>
            </div>

            <div className="os-pillar-card">
              <div className="os-pillar-icon-wrapper">
                <Globe size={28} />
              </div>
              <h3>Direct Sourcing</h3>
              <p>
                We partner directly with the finest spice estates and farmers across South India, 
                securing the highest grade harvest for our blends.
              </p>
            </div>

            <div className="os-pillar-card">
              <div className="os-pillar-icon-wrapper">
                <Leaf size={28} />
              </div>
              <h3>Sustainability</h3>
              <p>
                Premium quality extends to the earth. We are committed to eco-conscious practices 
                and encouraging sustainable farming methods.
              </p>
            </div>
            
            <div className="os-pillar-card">
              <div className="os-pillar-icon-wrapper">
                <ShieldCheck size={28} />
              </div>
              <h3>Purity Guaranteed</h3>
              <p>
                No artificial colors, no preservatives, no fillers. Every batch undergoes 
                rigorous testing to meet our strict standards.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="os-cta-section">
        <div className="os-cta-overlay"></div>
        <div className="container os-cta-content">
          <Heart size={48} className="os-cta-icon" />
          <h2>Experience the Difference</h2>
          <p>Taste the legacy of Rajasuvai in your own kitchen.</p>
          <a href="/shop" className="os-cta-btn">Explore Our Collection</a>
        </div>
      </section>
    </div>
  );
};

export default OurStory;

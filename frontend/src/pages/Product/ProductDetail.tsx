import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

// Static review data
const STATIC_REVIEWS = [
  { id: 1, name: 'Priya M.', avatar: 'P', stars: 5, date: 'March 2025', text: "Absolutely the best quality spice I've tried! The aroma alone is incredible. Will definitely buy again.", verified: true },
  { id: 2, name: 'Raju K.', avatar: 'R', stars: 5, date: 'Feb 2025', text: "Fresh, pure, and authentic. My biriyani has never tasted so good since I started using Rajasuvai spices.", verified: true },
  { id: 3, name: 'Lakshmi S.', avatar: 'L', stars: 4, date: 'Jan 2025', text: "Great product and fast delivery. Packaging is secure and eco-friendly. Slight bitter edge, but overall excellent.", verified: false },
];

// Product descriptions by name
const getDescription = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('turmeric')) return 'Our Pure Turmeric is cold-ground from the finest Erode-region rhizomes, giving it a deep golden hue and extraordinary curcumin content. Rich in anti-inflammatory compounds and earthy warmth, it is the cornerstone of every South Indian kitchen.';
  if (n.includes('chilli')) return 'Sourced from sun-dried Byadagi chillies, our Red Chilli powder is prized for its vibrant deep-red colour rather than excessive heat — ideal for curries, chutneys, and tandoori marinades. Naturally processed with no artificial colorants.';
  if (n.includes('pepper')) return 'Hand-harvested Malabar Black Pepper from Kerala\'s hill plantations. Bold, pungent, and complex — with layers of pine, citrus, and spice. The "King of Spices" in its purest form. Rich in piperine for superior bioavailability.';
  if (n.includes('garam')) return 'Our Garam Masala is a master blend of over 12 whole-spice aromatics — cinnamon, cloves, cardamom, nutmeg, and star anise — slow-roasted and stone-ground to unlock their essential oils. A single teaspoon transforms any dish.';
  if (n.includes('cardamom')) return 'Premium Grade A Green Cardamom from the Idukki highlands. Intensely aromatic with sweet-camphor top notes. Perfect for chai, kheer, biriyani, and baking. Each pod is hand-sorted for maximum freshness and oil content.';
  if (n.includes('saffron')) return 'Finest Kashmiri Mogra Saffron — hand-picked red stigmas with honey-sweet, earthy aroma and an intense golden tint. Third-party tested for purity. Use just a few threads to transform rice, desserts, and teas.';
  if (n.includes('ghee')) return 'Pure A2 cow Ghee slow-churned using the traditional bilona method. Rich in fat-soluble vitamins, conjugated linoleic acid (CLA), and butyrate. Naturally golden with a deep nutty aroma. Lactose and casein free.';
  if (n.includes('coconut')) return 'Cold-pressed Virgin Coconut Oil extracted from fresh, mature coconuts within 24 hours of harvest. Unrefined and unbleached — preserving natural lauric acid, MCTs, and its characteristic tropical aroma. Ideal for cooking and skincare.';
  if (n.includes('cashew')) return 'Premium Grade W240 Cashews from Kollam district. Naturally cashew-white, buttery, and crunchy — free from artificial preservatives. Rich in magnesium, healthy fats, and protein. Packed in nitrogen-flushed pouches for maximum freshness.';
  if (n.includes('amla')) return 'Traditional Amla Candy prepared from fresh Indian Gooseberry using a time-honoured recipe with minimal sugar and natural spices. An excellent source of Vitamin C, antioxidants, and digestive enzymes. A healthy alternative snack.';
  return `Experience the authentic taste of tradition with our premium ${name}. Carefully sourced and beautifully crafted to bring out the richest flavors and essential aromas. Perfect for culinary enthusiasts and health-conscious individuals alike.`;
};

// Get all images for a product (slideshow)
const getProductImages = (name: string): string[] => {
  const n = name.toLowerCase();
  const imgs: Record<string, string[]> = {
    turmeric: ['/products/turmeric.png', '/products/garam_masala.png', '/products/saffron.png'],
    chilli: ['/products/chilli.png', '/products/pepper.png', '/products/garam_masala.png'],
    pepper: ['/products/pepper.png', '/products/chilli.png', '/products/cardamom.png'],
    garam: ['/products/garam_masala.png', '/products/turmeric.png', '/products/cardamom.png'],
    cardamom: ['/products/cardamom.png', '/products/saffron.png', '/products/garam_masala.png'],
    saffron: ['/products/saffron.png', '/products/cardamom.png', '/products/turmeric.png'],
    ghee: ['/products/ghee.png', '/products/coconut_oil.png', '/products/cashews.png'],
    coconut: ['/products/coconut_oil.png', '/products/ghee.png', '/products/cashews.png'],
    cashew: ['/products/cashews.png', '/products/amla_candy.png', '/products/ghee.png'],
    amla: ['/products/amla_candy.png', '/products/cashews.png', '/products/coconut_oil.png'],
  };
  for (const [key, val] of Object.entries(imgs)) {
    if (n.includes(key)) return val;
  }
  return ['/products/turmeric.png'];
};

const WEIGHT_OPTIONS = ['50g', '100g', '250g', '500g', '1kg'];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'usage'>('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.get(`/api/products/${id}`);
        if (data.error) throw new Error(data.error);
        setProduct(data);
      } catch (err: any) {
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="pd-page container">
      <div className="pd-loading"><div className="pd-spinner"></div><p>Loading...</p></div>
    </div>
  );

  if (error || !product) return (
    <div className="pd-page container">
      <div className="pd-error">
        <h2>Oops!</h2><p>{error}</p>
        <button onClick={() => navigate('/shop')}>← Back to Shop</button>
      </div>
    </div>
  );

  const images = getProductImages(product.name);
  const description = getDescription(product.name);
  const rating = 4.8;
  const numPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => { handleAddToCart(); navigate('/cart'); };

  return (
    <div className="pd-page">
      {/* ── Breadcrumb ── */}
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
      </div>

      <div className="pd-grid">

        {/* ════════════ LEFT: Image Gallery ════════════ */}
        <div className="pd-gallery">
          {/* Thumbnails */}
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="pd-main-img-wrap">
            <button className="pd-back-btn" onClick={() => navigate(-1)}>← Back</button>
            <div className="pd-img-badge">Premium Quality</div>
            <img
              src={images[activeImg]}
              alt={product.name}
              className="pd-main-img"
            />
            {/* Prev/Next arrows */}
            <button className="pd-arrow pd-arrow-left" onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}>‹</button>
            <button className="pd-arrow pd-arrow-right" onClick={() => setActiveImg(i => (i + 1) % images.length)}>›</button>
          </div>
        </div>

        {/* ════════════ RIGHT: Product Info ════════════ */}
        <div className="pd-info">

          {/* Category & Title */}
          <span className="pd-category">{product.category}</span>
          <h1 className="pd-title">{product.name}</h1>

          {/* Rating */}
          <div className="pd-rating-row">
            <div className="pd-stars">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={s <= Math.round(rating) ? 'star-on' : 'star-off'}>★</span>
              ))}
            </div>
            <span className="pd-rating-num">{rating}</span>
            <span className="pd-review-count">(124 Reviews)</span>
            <span className="pd-in-stock">✓ In Stock</span>
          </div>

          {/* Price */}
          <div className="pd-price-row">
            <span className="pd-price">₹{numPrice}</span>
            <span className="pd-price-old">₹{Math.round(numPrice * 1.2)}</span>
            <span className="pd-discount-badge">20% OFF</span>
          </div>
          <p className="pd-tax-note">Inclusive of all taxes. Free delivery on orders above ₹999.</p>

          {/* Weight Options */}
          <div className="pd-options-block">
            <p className="pd-option-label">WEIGHT: <strong>{selectedWeight}</strong></p>
            <div className="pd-weight-options">
              {WEIGHT_OPTIONS.map(w => (
                <button
                  key={w}
                  className={`pd-weight-btn ${selectedWeight === w ? 'active' : ''}`}
                  onClick={() => setSelectedWeight(w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Actions */}
          <div className="pd-purchase-row">
            <div className="pd-qty">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button className={`pd-btn-cart ${addedToCart ? 'added' : ''}`} onClick={handleAddToCart}>
              {addedToCart ? '✓ Added!' : '🛒 Add to Cart'}
            </button>
            <button className="pd-btn-buy" onClick={handleBuyNow}>Buy Now</button>
          </div>

          {/* Payment Methods */}
          <div className="pd-payment-block">
            <p className="pd-payment-label">SECURE PAYMENT:</p>
            <div className="pd-payment-icons">
              <div className="pd-pay-icon">
                <span className="pi-visa">VISA</span>
              </div>
              <div className="pd-pay-icon pi-mc">
                <div className="pi-circle c1"></div>
                <div className="pi-circle c2"></div>
              </div>
              <div className="pd-pay-icon pi-upi">UPI</div>
              <div className="pd-pay-icon pi-text">Net Banking</div>
              <div className="pd-pay-icon pi-text">Wallets</div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="pd-guarantees">
            <div className="pd-guarantee-item"><span>🚚</span><div><strong>Free Delivery</strong><small>On orders above ₹999</small></div></div>
            <div className="pd-guarantee-item"><span>↩️</span><div><strong>Easy Returns</strong><small>7-day return policy</small></div></div>
            <div className="pd-guarantee-item"><span>🌿</span><div><strong>100% Organic</strong><small>No artificial additives</small></div></div>
            <div className="pd-guarantee-item"><span>🏆</span><div><strong>FSSAI Certified</strong><small>Quality guaranteed</small></div></div>
          </div>
        </div>
      </div>

      {/* ════════════ TABS: Description / Nutrition / Usage ════════════ */}
      <div className="pd-tabs-section">
        <div className="pd-tabs-inner">
          <div className="pd-tabs">
            {(['description', 'nutrition', 'usage'] as const).map(tab => (
              <button
                key={tab}
                className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">
            {activeTab === 'description' && (
              <div className="pd-description">
                <h3>About This Product</h3>
                <p>{description}</p>
                <div className="pd-key-features">
                  <div className="pd-feature"><span>🌱</span><p><strong>Sourcing</strong><br />Directly from certified farms in South India</p></div>
                  <div className="pd-feature"><span>🧪</span><p><strong>Lab Tested</strong><br />Third-party quality &amp; purity certified</p></div>
                  <div className="pd-feature"><span>📦</span><p><strong>Packaging</strong><br />Nitrogen-flushed, airtight, biodegradable</p></div>
                  <div className="pd-feature"><span>⏳</span><p><strong>Shelf Life</strong><br />18 months from date of manufacture</p></div>
                </div>
              </div>
            )}
            {activeTab === 'nutrition' && (
              <div className="pd-nutrition">
                <h3>Nutrition Facts <small>(per 100g)</small></h3>
                <table className="pd-nutrition-table">
                  <tbody>
                    {[
                      ['Energy', '354 kcal'], ['Protein', '7.8g'], ['Carbohydrates', '64.9g'],
                      ['Dietary Fibre', '22.7g'], ['Total Fat', '9.9g'], ['Saturated Fat', '2.1g'],
                      ['Sodium', '38mg'], ['Calcium', '182mg'], ['Iron', '47.5mg'],
                    ].map(([label, value]) => (
                      <tr key={label}><td>{label}</td><td><strong>{value}</strong></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'usage' && (
              <div className="pd-usage">
                <h3>How to Use</h3>
                <div className="pd-usage-steps">
                  <div className="pd-step"><span className="step-num">1</span><p><strong>Measure</strong> — Use ½–1 tsp per serving for optimal flavour.</p></div>
                  <div className="pd-step"><span className="step-num">2</span><p><strong>Temper</strong> — Add to hot oil or ghee at the start of cooking to bloom the spice.</p></div>
                  <div className="pd-step"><span className="step-num">3</span><p><strong>Finish</strong> — Sprinkle a pinch near the end of cooking to brighten aroma.</p></div>
                  <div className="pd-step"><span className="step-num">4</span><p><strong>Store</strong> — Keep in a cool, dry, airtight container away from sunlight.</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════ REVIEWS ════════════ */}
      <div className="pd-reviews-section">
        <div className="pd-reviews-inner">
          <div className="pd-reviews-header">
            <div>
              <h2 className="pd-reviews-title">Customer Reviews</h2>
              <p className="pd-reviews-sub">Based on 124 verified purchases</p>
            </div>
            <div className="pd-overall-rating">
              <span className="pd-big-rating">{rating}</span>
              <div>
                <div className="pd-stars-lg">{[1,2,3,4,5].map(s=><span key={s} className={s<=Math.round(rating)?'star-on':'star-off'}>★</span>)}</div>
                <p>4.8 out of 5</p>
              </div>
            </div>
          </div>

          {/* Rating bars */}
          <div className="pd-rating-bars">
            {[[5,78],[4,18],[3,3],[2,1],[1,0]].map(([stars, pct])=>(
              <div key={stars} className="pd-bar-row">
                <span>{stars}★</span>
                <div className="pd-bar-track"><div className="pd-bar-fill" style={{width:`${pct}%`}}></div></div>
                <span>{pct}%</span>
              </div>
            ))}
          </div>

          {/* Review cards */}
          <div className="pd-review-cards">
            {STATIC_REVIEWS.map(r => (
              <div key={r.id} className="pd-review-card">
                <div className="pd-review-top">
                  <div className="pd-reviewer-avatar">{r.avatar}</div>
                  <div>
                    <strong>{r.name}</strong>
                    {r.verified && <span className="pd-verified">✓ Verified Purchase</span>}
                    <p className="pd-review-date">{r.date}</p>
                  </div>
                  <div className="pd-review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</div>
                </div>
                <p className="pd-review-text">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

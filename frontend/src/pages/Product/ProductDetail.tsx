import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { getProductAllImages } from '../../utils/imageLoader';
import './ProductDetail.css';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  inventory?: { quantity: number }[];
}


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

// Dynamic image loading is handled by getProductAllImages

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'package'>('description');
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
    <div className="pd-loading" style={{ flexDirection: 'column', textAlign: 'center', padding: '100px 20px', color: '#57534E' }}>
      <div className="pd-spinner" style={{ margin: '0 auto 20px' }}></div>
      <h3 style={{ margin: '0 0 10px', color: '#1C1917' }}>Waking up our servers... ☕</h3>
      <p style={{ margin: 0 }}>This might take up to a minute. Thank you for your patience!</p>
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

  const images = getProductAllImages(product.image);
  const description = getDescription(product.name);
  const numPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
  
  // Extract weight from the product name
  const weightMatch = product.name.match(/(\d+\s*(?:kg|g|gm|ml|l))/i);
  const actualWeight = weightMatch ? weightMatch[1].toLowerCase() : 'N/A';

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
            {images.length > 1 && (
              <>
                <button className="pd-arrow pd-arrow-left" onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}>‹</button>
                <button className="pd-arrow pd-arrow-right" onClick={() => setActiveImg(i => (i + 1) % images.length)}>›</button>
              </>
            )}
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
                <span key={s} className="star-on">★</span>
              ))}
            </div>
            <span className="pd-rating-num">5.0</span>
            <span className="pd-review-count">(Verified Quality)</span>
            {(() => {
              const qty = product.inventory?.[0]?.quantity ?? null;
              if (qty === null) return null;
              return qty > 0
                ? <span className="pd-in-stock">✓ In Stock ({qty} left)</span>
                : <span className="pd-out-of-stock">✕ Out of Stock</span>;
            })()}
          </div>

          {/* Price */}
          <div className="pd-price-row">
            <span className="pd-price">₹{numPrice}</span>
          </div>
          <p className="pd-tax-note">Inclusive of all taxes.</p>

          {/* Actual Weight */}
          <div className="pd-options-block">
            <p className="pd-option-label">NET WEIGHT: <strong style={{color: '#E8600A', fontSize: '1.1rem'}}>{actualWeight}</strong></p>
          </div>

          {/* Offers */}
          <div className="pd-offers-block">
            <p className="pd-offers-label">AVAILABLE OFFERS:</p>
            <ul className="pd-offers-list">
              <li><span className="pd-offer-icon">🏷️</span> <strong>Bank Offer:</strong> 10% instant discount on HDFC Bank Credit Cards.</li>
              <li><span className="pd-offer-icon">🎉</span> <strong>Special Price:</strong> Get extra 5% off on buying 3 or more units.</li>
              <li><span className="pd-offer-icon">🚚</span> <strong>Free Shipping:</strong> On all orders above ₹999.</li>
            </ul>
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

          {/* Delivery Options */}
          <div className="pd-delivery-block">
            <p className="pd-delivery-label">DELIVERY & RETURNS:</p>
            <div className="pd-delivery-info">
              <p><span>📍</span> Standard Delivery by <strong>{new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}</strong></p>
              <p><span>⚡</span> Usually dispatched within 24 hours.</p>
              <p><span>📦</span> 7 Days Replacement Policy</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="pd-payment-block">
            <p className="pd-payment-label">SECURE PAYMENT:</p>
            <div className="pd-payment-icons">
              <div className="pd-pay-icon"><span className="pi-visa">VISA</span></div>
              <div className="pd-pay-icon pi-mc"><div className="pi-circle c1"></div><div className="pi-circle c2"></div></div>
              <div className="pd-pay-icon pi-upi">UPI</div>
              <div className="pd-pay-icon pi-text">Net Banking</div>
              <div className="pd-pay-icon pi-text">Wallets</div>
            </div>
            <p className="pd-secure-note">🔒 SSL Secured Checkout</p>
          </div>

          {/* Guarantees */}
          <div className="pd-guarantees">
            <div className="pd-guarantee-item"><span>🌿</span><div><strong>100% Organic</strong><small>No artificial additives</small></div></div>
            <div className="pd-guarantee-item"><span>🏆</span><div><strong>FSSAI Certified</strong><small>Quality guaranteed</small></div></div>
          </div>
        </div>
      </div>

      {/* ════════════ TABS: Description / Package Details ════════════ */}
      <div className="pd-tabs-section">
        <div className="pd-tabs-inner">
          <div className="pd-tabs">
            {(['description', 'package'] as const).map(tab => (
              <button
                key={tab}
                className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab === 'description' ? 'Description' : 'Package Details'}
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
                  <div className="pd-feature"><span>⏳</span><p><strong>Shelf Life</strong><br />Best before 9 months from packaging</p></div>
                </div>
              </div>
            )}
            {activeTab === 'package' && (
              <div className="pd-nutrition">
                <h3>Package Information</h3>
                <div className="pd-package-info">
                  <div className="pd-pkg-block">
                    <h4>Processed and Marketed By:</h4>
                    <p><strong>Rajasuvai Foods Pvt Ltd</strong></p>
                    <p>Door No: 3/122, Balakrishna Street, Balakrishna Nagar,</p>
                    <p>Periyapanichery, Kovur, Chennai - 600128.</p>
                  </div>

                  <div className="pd-pkg-block">
                    <h4>Customer Care:</h4>
                    <p><strong>Mobile:</strong> +91 87544 15050</p>
                    <p><strong>Email ID:</strong> rajasuvaifoods@gmail.com</p>
                    <p><strong>Website:</strong> www.Rajasuvai.com</p>
                  </div>

                  <div className="pd-pkg-block">
                    <h4>Certifications & Licences:</h4>
                    <p><strong>fssai Lic. No:</strong> 12421008000801</p>
                    <p>An ISO 9001:2015, ISO 14001:2015, ISO 22000:2018 Certified Company</p>
                    <div className="pd-cert-logos">
                      <span className="pd-fssai-text">fssai</span>
                      <span className="pd-iso-text">ISO Certified</span>
                    </div>
                  </div>

                  <div className="pd-pkg-block">
                    <h4>Other Information:</h4>
                    <p><strong>Shelf Life:</strong> Best Before 9 Months From Packaging</p>
                    <p>Photograph shown on this pack is of raw materials and final product.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

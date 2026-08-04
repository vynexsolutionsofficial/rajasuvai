import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Star, Minus, Plus, ShoppingCart, Check,
  Tag, PartyPopper, Truck, MapPin, Zap, Package, Sprout, FlaskConical, Leaf, Award, Clock,
} from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { getProductAllImages } from '../../utils/imageLoader';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { cn } from '../../lib/cn';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  inventory?: { quantity: number }[];
}

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
        setActiveImg(0);
      } catch {
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-(--container-page) px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <h2 className="font-display text-2xl font-bold text-brand-950">Oops!</h2>
        <p className="mt-2 text-sm text-black/55">{error}</p>
        <Button className="mt-6" onClick={() => navigate('/shop')}>← Back to Shop</Button>
      </div>
    );
  }

  const images = getProductAllImages(product.image);
  const description = getDescription(product.name);
  const numPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
  const weightMatch = product.name.match(/(\d+\s*(?:kg|g|gm|ml|l))/i);
  const actualWeight = weightMatch ? weightMatch[1].toLowerCase() : 'N/A';
  const stockQty = product.inventory?.[0]?.quantity ?? null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 flex items-center gap-1.5 text-xs text-black/45">
        <Link to="/" className="hover:text-brand-600">Home</Link> /
        <Link to="/shop" className="hover:text-brand-600">Shop</Link> /
        <span className="text-brand-950">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          {images.length > 1 && (
            <div className="flex gap-2.5 sm:flex-col">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                    activeImg === i ? 'border-brand-500' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={img} alt={`View ${i + 1}`} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-brand-50">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-950 shadow-sm backdrop-blur"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <span className="absolute top-3 right-3 z-10 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold text-white">
              Premium Quality
            </span>
            <img src={images[activeImg]} alt={product.name} className="size-full object-cover" />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                  className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-950 shadow-sm hover:bg-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                  className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-950 shadow-sm hover:bg-white"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="text-xs font-bold tracking-wide text-brand-500 uppercase">{product.category}</span>
          <h1 className="mt-1 font-display text-2xl font-bold text-brand-950 sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={15} className="fill-amber-400" />)}
            </div>
            <span className="font-semibold text-brand-950">5.0</span>
            <span className="text-black/40">(Verified Quality)</span>
            {stockQty !== null && (
              <span className={cn('ml-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', stockQty > 0 ? 'bg-fresh-100 text-fresh-700' : 'bg-error-50 text-error-600')}>
                {stockQty > 0 ? `In Stock (${stockQty} left)` : 'Out of Stock'}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-brand-950">₹{numPrice}</span>
            <span className="text-xs text-black/40">Inclusive of all taxes</span>
          </div>

          <p className="mt-3 text-sm text-black/60">
            Net weight: <strong className="text-brand-600">{actualWeight}</strong>
          </p>

          <div className="mt-5 space-y-2 rounded-xl border border-black/5 bg-brand-50/40 p-4">
            <p className="text-xs font-bold tracking-wide text-black/40">AVAILABLE OFFERS</p>
            <OfferRow icon={<Tag size={14} />}><strong>Bank Offer:</strong> 10% instant discount on HDFC Bank Credit Cards.</OfferRow>
            <OfferRow icon={<PartyPopper size={14} />}><strong>Special Price:</strong> Get extra 5% off on buying 3 or more units.</OfferRow>
            <OfferRow icon={<Truck size={14} />}><strong>Free Shipping:</strong> On all orders above ₹999.</OfferRow>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-black/10">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex size-11 items-center justify-center text-brand-950 hover:bg-black/5">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="flex size-11 items-center justify-center text-brand-950 hover:bg-black/5">
                <Plus size={16} />
              </button>
            </div>
            <Button variant={addedToCart ? 'secondary' : 'outline'} size="lg" onClick={handleAddToCart} className="flex-1">
              {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </Button>
            <Button size="lg" onClick={handleBuyNow} className="flex-1">Buy Now</Button>
          </div>

          <div className="mt-6 space-y-2 border-t border-black/5 pt-5 text-sm text-black/65">
            <p className="text-xs font-bold tracking-wide text-black/40">DELIVERY &amp; RETURNS</p>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-brand-500" />
              Standard Delivery by{' '}
              <strong className="text-brand-950">
                {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </strong>
            </div>
            <div className="flex items-center gap-2"><Zap size={14} className="text-brand-500" /> Usually dispatched within 24 hours.</div>
            <div className="flex items-center gap-2"><Package size={14} className="text-brand-500" /> 7 Days Replacement Policy</div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-black/5 pt-5">
            <div className="flex items-center gap-2.5">
              <Leaf size={20} className="text-fresh-600" />
              <div>
                <p className="text-sm font-bold text-brand-950">100% Organic</p>
                <p className="text-xs text-black/45">No artificial additives</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Award size={20} className="text-brand-500" />
              <div>
                <p className="text-sm font-bold text-brand-950">FSSAI Certified</p>
                <p className="text-xs text-black/45">Quality guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-6 border-b border-black/10">
          {(['description', 'package'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'border-b-2 pb-3 text-sm font-semibold transition-colors',
                activeTab === tab ? 'border-brand-500 text-brand-950' : 'border-transparent text-black/45 hover:text-brand-950'
              )}
            >
              {tab === 'description' ? 'Description' : 'Package Details'}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="max-w-3xl">
              <h3 className="font-display text-lg font-bold text-brand-950">About This Product</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/65">{description}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <FeatureItem icon={<Sprout size={18} />} title="Sourcing" desc="Directly from certified farms in South India" />
                <FeatureItem icon={<FlaskConical size={18} />} title="Lab Tested" desc="Third-party quality & purity certified" />
                <FeatureItem icon={<Package size={18} />} title="Packaging" desc="Nitrogen-flushed, airtight, biodegradable" />
                <FeatureItem icon={<Clock size={18} />} title="Shelf Life" desc="Best before 9 months from packaging" />
              </div>
            </div>
          )}
          {activeTab === 'package' && (
            <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
              <PkgBlock title="Processed and Marketed By">
                <p className="font-semibold text-brand-950">Rajasuvai Foods Pvt Ltd</p>
                <p>Door No: 3/122, Balakrishna Street, Balakrishna Nagar,</p>
                <p>Periyapanichery, Kovur, Chennai - 600128.</p>
              </PkgBlock>
              <PkgBlock title="Customer Care">
                <p><strong className="text-brand-950">Mobile:</strong> +91 87544 15050</p>
                <p><strong className="text-brand-950">Email ID:</strong> rajasuvaifoods@gmail.com</p>
                <p><strong className="text-brand-950">Website:</strong> www.Rajasuvai.com</p>
              </PkgBlock>
              <PkgBlock title="Certifications & Licences">
                <p><strong className="text-brand-950">FSSAI Lic. No:</strong> 12421008000801</p>
                <p>An ISO 9001:2015, ISO 14001:2015, ISO 22000:2018 Certified Company</p>
              </PkgBlock>
              <PkgBlock title="Other Information">
                <p><strong className="text-brand-950">Shelf Life:</strong> Best Before 9 Months From Packaging</p>
                <p>Photograph shown on this pack is of raw materials and final product.</p>
              </PkgBlock>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OfferRow: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-start gap-2 text-sm text-black/70">
    <span className="mt-0.5 text-brand-500">{icon}</span>
    <span>{children}</span>
  </div>
);

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div>
    <div className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-brand-500">{icon}</div>
    <p className="mt-2 text-sm font-bold text-brand-950">{title}</p>
    <p className="text-xs text-black/50">{desc}</p>
  </div>
);

const PkgBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-black/5 bg-brand-50/30 p-4">
    <h4 className="text-xs font-bold tracking-wide text-black/40">{title.toUpperCase()}</h4>
    <div className="mt-2 space-y-1 text-sm text-black/65">{children}</div>
  </div>
);

export default ProductDetail;

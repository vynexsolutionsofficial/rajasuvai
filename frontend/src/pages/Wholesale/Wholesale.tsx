import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, Phone, Mail, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { getProductCoverImage } from '../../utils/imageLoader';
import { Skeleton } from '../../components/ui/Skeleton';

interface Product {
  id: number;
  name: string;
  image: string;
  description?: string;
}

const bulkSizes = ['5kg', '10kg', '25kg', '50kg', '100kg+'];

const Wholesale: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const data = await api.get('/api/products', { limit: 100 });
        if (data.products) setProducts(data.products);
      } catch (err) {
        console.error('Error fetching wholesale products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-(--container-page) px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-display text-3xl font-bold text-brand-950">Our Wholesale Catalog</h1>
          <p className="mt-2 text-sm text-black/55">Explore our premium range of spices available in large-scale packaging for businesses of all sizes.</p>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                <div className="aspect-video bg-brand-50">
                  <img src={getProductCoverImage(product.image)} alt={product.name} className="size-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-brand-950">{product.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-black/50">
                    {product.description || `Premium wholesale ${product.name.toLowerCase()} sourced directly from farms.`}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-brand-950">
                    Wholesale Price: <span className="text-brand-600">₹--- / kg</span>
                  </p>
                  <div className="mt-3">
                    <p className="text-xs font-bold tracking-wide text-black/40">AVAILABLE BULK SIZES</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {bulkSizes.map((qty) => (
                        <span key={qty} className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-black/60">{qty}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => (window.location.href = '/contact')}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-500 py-2.5 text-xs font-bold text-white hover:bg-brand-600"
                  >
                    Request Quote <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-brand-50/50 py-14">
        <div className="mx-auto max-w-(--container-page) px-6">
          <h2 className="text-center font-display text-2xl font-bold text-brand-950 sm:text-3xl">Why Partner With Us?</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <BenefitCard icon={<Package size={30} />} title="Bulk Quantities" desc="Whether you're a restaurant, retailer, or distributor, we can supply the volume you need without compromising on quality." />
            <BenefitCard icon={<TrendingUp size={30} />} title="Wholesale Discounts" desc="Enjoy exclusive wholesale pricing on every product in our catalog. Better margins mean better business for you." />
            <BenefitCard icon={<Phone size={30} />} title="Dedicated Support" desc="Get personalized assistance, marketing materials, and support from our dedicated B2B team to help you succeed." />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
          <h2 className="font-display text-2xl font-bold text-brand-950">Ready to Order?</h2>
          <p className="mt-2 text-sm text-black/55">Contact us today for a custom quote, full product catalog, and more details on our wholesale program.</p>
          <div className="mt-5 flex flex-col items-center gap-2 text-sm text-black/70 sm:flex-row sm:justify-center sm:gap-6">
            <span className="flex items-center gap-2"><Phone size={16} className="text-brand-500" /> +91 98765 43210</span>
            <span className="flex items-center gap-2"><Mail size={16} className="text-brand-500" /> wholesale@rajasuvai.com</span>
          </div>
          <button
            onClick={() => (window.location.href = '/contact')}
            className="mt-6 rounded-full bg-brand-500 px-7 py-3 text-sm font-bold text-white hover:bg-brand-600"
          >
            Inquire Now
          </button>
        </div>
      </section>
    </div>
  );
};

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="rounded-2xl bg-white p-6 text-center">
    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">{icon}</div>
    <h3 className="mt-4 text-base font-bold text-brand-950">{title}</h3>
    <p className="mt-1.5 text-sm text-black/55">{desc}</p>
  </div>
);

export default Wholesale;

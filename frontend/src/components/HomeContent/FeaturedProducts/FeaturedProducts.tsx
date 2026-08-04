import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../../../services/api';
import ShopProductCard from '../../../pages/Shop/ShopProductCard';
import { Skeleton } from '../../ui/Skeleton';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products', { limit: 8, offset: 0 })
      .then((data) => {
        if (data?.products) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-brand-50/40 py-12 sm:py-16">
      <div className="mx-auto max-w-(--container-page) px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-brand-500">FRESH FROM THE SPICE TRAIL</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-brand-950 sm:text-3xl">Featured Products</h2>
          </div>
          <Link
            to="/shop"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex"
          >
            Shop all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                <Skeleton className="aspect-square rounded-none" />
                <div className="space-y-2 p-3.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ShopProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            to="/shop"
            className="flex items-center gap-1.5 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600"
          >
            Shop All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

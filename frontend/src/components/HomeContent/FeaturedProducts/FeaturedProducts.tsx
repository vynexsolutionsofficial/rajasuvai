import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../../../services/api';
import ShopProductCard from '../../../pages/Shop/ShopProductCard';
import './FeaturedProducts.css';

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
    <section className="featured-section">
      <div className="featured-inner container">
        <div className="featured-header">
          <span className="featured-eyebrow">FRESH FROM THE SPICE TRAIL</span>
          <h2 className="featured-title">Featured Products</h2>
          <p className="featured-sub">Handpicked, lab-tested, and delivered directly from South Indian farms.</p>
        </div>

        {loading ? (
          <div className="featured-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="featured-grid">
            {products.map((p) => (
              <ShopProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : null}

        <div className="featured-footer">
          <Link to="/shop" className="featured-shop-btn">
            Shop All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

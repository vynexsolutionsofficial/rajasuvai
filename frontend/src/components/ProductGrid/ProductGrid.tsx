import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

interface ProductGridProps {
  category?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get('/api/products', { category });
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return (
    <div className="loading container" style={{ textAlign: 'center', padding: '100px 20px', color: '#57534E' }}>
      <div className="spinner" style={{ margin: '0 auto 20px', width: '40px', height: '40px', border: '4px solid #F5F4F2', borderTopColor: '#E8600A', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <h3 style={{ margin: '0 0 10px', color: '#1C1917' }}>Waking up our servers... ☕</h3>
      <p style={{ margin: 0 }}>This might take up to a minute. Thank you for your patience!</p>
    </div>
  );
  if (error) return <div className="error container">{error}</div>;

  return (
    <section className="product-grid-section container">
      <div className="section-header">
        <h2 className="section-title">The Collection</h2>
        <a href="/shop" className="view-all">View All Products</a>
      </div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;

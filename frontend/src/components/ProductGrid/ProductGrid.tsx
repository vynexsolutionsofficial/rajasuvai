import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading container">Loading Collection...</div>;
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

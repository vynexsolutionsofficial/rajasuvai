import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
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
    // Initial fetch from Supabase
    const fetchProducts = async () => {
      try {
        let query = supabase.from('products').select('*');
        
        if (category && category !== 'All') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Subscribe to REALTIME changes
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', table: 'products', schema: 'public' },
        (payload) => {
          console.log('Change received!', payload);
          // Refresh products on any change
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

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

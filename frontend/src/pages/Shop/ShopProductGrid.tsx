import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import ShopProductCard from './ShopProductCard';
import './ShopProductGrid.css';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface ShopProductGridProps {
  category: string;
}

const ShopProductGrid: React.FC<ShopProductGridProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');
      
      if (category !== 'All') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="shop-grid-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="shop-product-grid">
      {products.map((product) => (
        <ShopProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ShopProductGrid;

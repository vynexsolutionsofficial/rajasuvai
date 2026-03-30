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
  currentPage: number;
  itemsPerPage: number;
  onTotalItems: (total: number) => void;
}

const ShopProductGrid: React.FC<ShopProductGridProps> = ({ category, currentPage, itemsPerPage, onTotalItems }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*', { count: 'exact' });
      
      if (category !== 'All') {
        query = query.eq('category', category);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
        if (count !== null) onTotalItems(count);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, currentPage, itemsPerPage, onTotalItems]);

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

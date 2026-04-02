import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
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
  priceRange?: [number, number | null];
  minRating?: number;
  currentPage: number;
  itemsPerPage: number;
  onTotalItems: (total: number) => void;
}

const ShopProductGrid: React.FC<ShopProductGridProps> = ({ 
  category, 
  priceRange,
  minRating,
  currentPage, 
  itemsPerPage, 
  onTotalItems 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          category,
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage
        };

        if (priceRange) {
          params.priceMin = priceRange[0];
          if (priceRange[1]) params.priceMax = priceRange[1];
        }

        const data = await api.get('/api/products', params);
        if (data.products) {
          setProducts(data.products);
          onTotalItems(data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage, itemsPerPage, priceRange, onTotalItems]);

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

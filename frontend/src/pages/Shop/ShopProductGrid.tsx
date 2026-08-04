import React, { useEffect, useState } from 'react';
import { SearchX } from 'lucide-react';
import { api } from '../../services/api';
import ShopProductCard from './ShopProductCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

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
  sort?: string;
  search?: string;
  currentPage: number;
  itemsPerPage: number;
  onTotalItems: (total: number) => void;
}

const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  category,
  priceRange,
  sort,
  search,
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
        const params: Record<string, any> = {
          category,
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage
        };

        if (search) params.search = search;
        if (sort) params.sort = sort;

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
        setProducts([]);
        onTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage, itemsPerPage, priceRange, sort, search, onTotalItems]);

  if (loading) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<SearchX size={28} />}
        title="No products found"
        description={search ? `No results for "${search}". Try a different search term.` : 'No products match the selected filters.'}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ShopProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ShopProductGrid;

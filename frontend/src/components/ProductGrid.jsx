import React, { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { addToCart } = useCart();
  const [added, setAdded] = useState({});

  const handleAdd = (product) => {
    addToCart(product);
    setAdded(p => ({ ...p, [product.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [product.id]: false })), 1500);
  };

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdded={!!added[product.id]}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  );
}

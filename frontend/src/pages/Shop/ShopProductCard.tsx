import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getProductCoverImage } from '../../utils/imageLoader';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/cn';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

const ShopProductCard: React.FC<ProductCardProps> = (product) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const { id, name, price, image } = product;

  let badge: { label: string; variant: 'brand' | 'error' | 'fresh' } | null = null;
  if (name.includes('Turmeric') || name.includes('Coconut')) badge = { label: 'NEW', variant: 'fresh' };
  else if (name.includes('Chilli')) badge = { label: 'HOT', variant: 'error' };
  else if (name.includes('Cashew')) badge = { label: 'SALE', variant: 'brand' };
  else if (name.includes('Amla')) badge = { label: 'BESTSELLER', variant: 'brand' };

  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

  const weightMatch = name.match(/(\d+\s*(?:kg|g|gm|ml|l))/i);
  const weight = weightMatch ? weightMatch[1].toLowerCase() : '';

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-50">
        {badge && (
          <Badge variant={badge.variant} className="absolute top-2.5 left-2.5 z-10">
            {badge.label}
          </Badge>
        )}
        <img
          src={getProductCoverImage(image)}
          alt={name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-950">{name}</h3>
        {weight && <p className="text-xs text-black/45">{weight}</p>}

        <div className="flex items-center gap-1 text-xs text-black/45">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="font-medium text-black/60">4.5</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1.5">
          <span className="text-base font-bold text-brand-950">₹{numericPrice}</span>
          <button
            disabled={added}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await addToCart(product);
                showToast(`${name} added to cart!`, 'success');
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              } catch {
                showToast('Failed to add to cart. Please try again.', 'error');
              }
            }}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
              added ? 'bg-fresh-100 text-fresh-700' : 'bg-brand-500 text-white hover:bg-brand-600'
            )}
          >
            {added ? <Check size={13} strokeWidth={2.5} /> : <Plus size={13} strokeWidth={2.5} />}
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;

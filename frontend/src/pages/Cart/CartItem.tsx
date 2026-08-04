import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getProductCoverImage } from '../../utils/imageLoader';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const weightMatch = item.name.match(/(\d+\s*(?:kg|g|gm|ml|l))/i);
  const weight = weightMatch ? weightMatch[1].toLowerCase() : '';

  return (
    <div className="flex gap-4 py-4">
      <Link to={`/product/${item.id}`} className="size-20 shrink-0 overflow-hidden rounded-xl bg-brand-50 sm:size-24">
        <img src={getProductCoverImage(item.image)} alt={item.name} className="size-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${item.id}`} className="text-sm font-semibold text-brand-950 hover:text-brand-600">
            {item.name}
          </Link>
          <button
            onClick={() => removeFromCart(item.id)}
            aria-label="Remove"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-black/35 hover:bg-error-50 hover:text-error-600"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
        {weight && <p className="mt-0.5 text-xs text-black/45">{weight}</p>}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-full border border-black/10">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex size-8 items-center justify-center text-brand-950 disabled:opacity-30"
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="flex size-8 items-center justify-center text-brand-950"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-sm font-bold text-brand-950">₹{(item.price * item.quantity).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

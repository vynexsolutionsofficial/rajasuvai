import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function MobileCartBar() {
  const { cart } = useCart();
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  if (count === 0) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pointer-events-none">
      <Link
        to="/cart"
        className="pointer-events-auto flex items-center justify-between w-full bg-amber-600 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-amber-800/40 hover:bg-amber-700 active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart size={20} strokeWidth={2.5} />
            <span className="absolute -top-2.5 -right-2.5 bg-white text-amber-700 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {count}
            </span>
          </div>
          <span className="font-bold text-sm">{count} item{count > 1 ? 's' : ''} in cart</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-lg">₹{total}</span>
          <span className="text-white/60">›</span>
        </div>
      </Link>
    </div>
  );
}

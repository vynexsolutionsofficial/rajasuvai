import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ConfirmationState {
  orderId: string | number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  convenienceFee: number;
  total: number;
  address?: string;
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ConfirmationState | null;

  const expectedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  if (!state) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <h2 className="font-display text-xl font-bold text-brand-950">Order details not found.</h2>
        <p className="mt-2 text-sm text-black/55">If you completed a payment, check your Order History in your profile.</p>
        <Link to="/profile" className="mt-6"><Button>Go to Profile</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-center sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-fresh-100 text-fresh-600">
          <CheckCircle size={32} />
        </div>

        <h1 className="mt-5 font-display text-2xl font-bold text-brand-950">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-black/55">
          Thank you for your purchase. Your order <strong className="text-brand-950">#{String(state.orderId).padStart(6, '0')}</strong> is being processed.
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-50/60 px-4 py-3 text-sm text-brand-950">
          <Package size={16} className="text-brand-500" />
          Expected delivery by <strong>{expectedDelivery()}</strong>
        </div>

        <div className="mt-6 text-left">
          <h3 className="text-xs font-bold tracking-wide text-black/40">ITEMS ORDERED</h3>
          <div className="mt-2 space-y-1.5">
            {state.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-brand-600">{item.quantity}×</span>
                <span className="flex-1 text-black/70">{item.name}</span>
                <span className="font-medium text-brand-950">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-black/5 pt-4 text-left">
          <h3 className="text-xs font-bold tracking-wide text-black/40">PRICE BREAKDOWN</h3>
          <div className="mt-2 space-y-1.5 text-sm">
            <div className="flex justify-between text-black/60"><span>Subtotal</span><span>₹{state.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-black/60"><span>Shipping</span><span>₹{state.shipping}</span></div>
            <div className="flex justify-between text-black/60"><span>Convenience fee</span><span>₹{state.convenienceFee}</span></div>
            <div className="flex justify-between border-t border-black/5 pt-2 text-base font-extrabold text-brand-950"><span>Total Paid</span><span>₹{state.total.toLocaleString()}</span></div>
          </div>
        </div>

        {state.address && (
          <div className="mt-4 flex items-start gap-2 border-t border-black/5 pt-4 text-left text-sm text-black/60">
            <MapPin size={16} className="mt-0.5 shrink-0 text-brand-500" />
            <span>{state.address}</span>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/profile', { state: { tab: 'orders' } })}>
            Track My Order
          </Button>
          <Link to="/shop" className="flex-1">
            <Button className="w-full">Continue Shopping <ArrowRight size={16} /></Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

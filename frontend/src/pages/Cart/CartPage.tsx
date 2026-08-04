import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Gift, Truck, Wallet, Building2, Calculator, Tag, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import CartItem from './CartItem';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

const CartPage: React.FC = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const shipping = cart.length > 0 ? 50 : 0;
  const convenienceFee = 23;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError(null);
    try {
      const data = await api.get(`/api/coupons/verify/${couponCode}`, { cartTotal });
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
      }
    } catch {
      setCouponError('Error validating coupon. Please try again.');
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === 'percentage') {
      return cartTotal * (appliedCoupon.discount_value / 100);
    }
    return appliedCoupon.discount_value;
  };

  const finalTotalBeforeTax = cartTotal + shipping - calculateDiscount();
  const tax = Math.round(finalTotalBeforeTax * 0.05);
  const totalPayable = Math.round(finalTotalBeforeTax + tax + convenienceFee);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-(--container-page) px-4 py-6 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold text-brand-950 sm:text-3xl">Your Cart</h1>
        <EmptyState
          icon={<ShoppingBag size={28} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start exploring our spices and staples."
          action={<Button onClick={() => navigate('/shop')}>Return to Shop</Button>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-950 sm:text-3xl">Your Cart</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-black/5 bg-white px-4 sm:px-5">
            <div className="divide-y divide-black/5">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={() => navigate('/shop')}>Continue Shopping</Button>
            <Button size="lg" className="sm:hidden" onClick={() => navigate('/checkout/address')}>Proceed to Checkout</Button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-5 rounded-2xl border border-black/5 bg-white p-5">
            {/* Coupon */}
            <div>
              <label className="text-xs font-bold tracking-wide text-black/40">COUPONS &amp; OFFERS</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Code (e.g. SUVAI50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="h-10 flex-1 rounded-lg border border-black/10 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button onClick={handleApplyCoupon} className="rounded-lg bg-brand-500 px-4 text-xs font-bold text-white hover:bg-brand-600">
                  APPLY
                </button>
              </div>
              <button className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700">
                <Gift size={14} /> View Offers
              </button>
              {couponError && <p className="mt-1.5 text-xs font-medium text-error-600">{couponError}</p>}
            </div>

            {/* Order summary */}
            <div className="border-t border-black/5 pt-4">
              <h3 className="mb-3 text-sm font-bold text-brand-950">Order Summary</h3>
              <div className="space-y-3">
                <BillRow icon={<Truck size={16} />} label="Subtotal" sub="Standard (3-5 days)" value={`₹${cartTotal.toLocaleString()}`} />
                <BillRow icon={<Wallet size={16} />} label="Delivery Fee" sub="Standard (3-5 days)" value={`₹${shipping}`} />
                <BillRow icon={<Building2 size={16} />} label="Convenience Fee" sub="Payment Processing" value={`₹${convenienceFee}`} />
                <BillRow icon={<Calculator size={16} />} label="Estimated Tax" sub="GST @ 5%" value={`₹${tax}`} />
                {appliedCoupon && (
                  <BillRow
                    icon={<Tag size={16} />}
                    label="Discount"
                    sub={`${appliedCoupon.code} Applied`}
                    value={`-₹${calculateDiscount()}`}
                    highlight="fresh"
                  />
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                <span className="text-sm font-bold text-brand-950">Total Payable</span>
                <span className="font-display text-xl font-extrabold text-brand-950">₹{totalPayable.toLocaleString()}</span>
              </div>
            </div>

            <Button size="lg" className="hidden w-full sm:flex" onClick={() => navigate('/checkout/address')}>
              Proceed to Address
            </Button>

            <div className="rounded-xl bg-brand-50/60 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <ShieldCheck size={16} className="text-brand-500" /> Safe &amp; Secure Payments
              </div>
              <ul className="mt-2 space-y-1 text-xs text-black/55">
                <li>No hidden charges</li>
                <li>100% PCI DSS &amp; SSL secure</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-black/40">
              <Lock size={12} /> Secure Step-by-Step Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BillRow: React.FC<{ icon: React.ReactNode; label: string; sub: string; value: string; highlight?: 'fresh' }> = ({
  icon, label, sub, value, highlight,
}) => (
  <div className="flex items-center gap-3">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-brand-950">{label}</p>
      <p className="text-xs text-black/40">{sub}</p>
    </div>
    <span className={`text-sm font-bold ${highlight === 'fresh' ? 'text-fresh-600' : 'text-brand-950'}`}>{value}</span>
  </div>
);

export default CartPage;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Smartphone, CreditCard, Landmark, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';
import CheckoutStepper from './CheckoutStepper';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [selectedSubMethod, setSelectedSubMethod] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [manualUpiId, setManualUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const addressId = location.state?.addressId;

  const safeCartTotal = cartTotal || 0;
  const shipping = 50;
  const platformFeeRate = 0.015;
  const convenienceFee = Math.round((safeCartTotal + shipping) * platformFeeRate);
  const finalTotal = safeCartTotal + shipping + convenienceFee;

  const popularBanks = [
    { id: 'HDFC', name: 'HDFC' },
    { id: 'SBIN', name: 'SBI' },
    { id: 'ICIC', name: 'ICICI' },
    { id: 'AXIS', name: 'Axis' },
    { id: 'KKBK', name: 'Kotak' },
  ];

  const paymentMethods = [
    { id: 'upi', label: 'UPI', sub: 'Pay by UPI (Google Pay, PhonePe, etc.)', icon: <Smartphone size={20} />, badge: 'INSTANT' },
    { id: 'cards', label: 'Cards', sub: 'Pay with credit or debit card', icon: <CreditCard size={20} /> },
    { id: 'netbanking', label: 'Netbanking', sub: 'Pay via any Indian bank', icon: <Landmark size={20} /> },
  ];

  const loadRazorpayScript = (src: string) =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (selectedMethod === 'upi' && selectedSubMethod === 'manual' && !manualUpiId) {
      showToast('Please enter your UPI ID', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        showToast('Payment system offline. Please check your connection.', 'error');
        setLoading(false);
        return;
      }

      const orderData = await api.post('/api/payments/create-order', {
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        address_id: addressId,
      });

      if (!orderData.success || !orderData.razorOrder) {
        showToast(orderData.error || 'Failed to initialize payment.', 'error');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
        amount: orderData.razorOrder.amount,
        currency: orderData.razorOrder.currency,
        name: 'Suvai Artisan Spices',
        description: 'Your order from Suvai',
        order_id: orderData.razorOrder.id,
        handler: async function (response: any) {
          const verifyData = await api.post('/api/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId: orderData.dbOrderId,
            method: selectedMethod + (selectedMethod === 'upi' ? `_${selectedSubMethod}` : selectedMethod === 'netbanking' ? `_${selectedBank}` : ''),
          });

          if (verifyData.success) {
            clearCart();
            navigate('/order-confirmation', {
              state: {
                orderId: String(orderData.dbOrderId),
                items: cart.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price || 0 })),
                subtotal: safeCartTotal,
                shipping,
                convenienceFee,
                total: finalTotal,
              },
            });
          } else {
            showToast('Payment completed. Confirmation via email shortly.', 'info');
            navigate('/profile');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        prefill: {
          name: 'Customer',
          email: 'support@suvai.com',
          contact: '9999999999',
          method: selectedMethod === 'upi' ? 'upi' : selectedMethod,
          bank: selectedMethod === 'netbanking' ? selectedBank : undefined,
        },
        theme: { color: '#e67e00' },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('PAYMENT_ERROR:', err);
      showToast('A technical error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const upiString = `upi://pay?pa=suvai@upi&pn=Suvai&am=${finalTotal}&cu=INR`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <CheckoutStepper current={3} />

      <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-brand-950 sm:text-2xl">Secure Payment</h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-fresh-600">
            <ShieldCheck size={16} /> 100% Secure
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          {/* Methods */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <React.Fragment key={method.id}>
                  <button
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-colors',
                      selectedMethod === method.id ? 'border-brand-500 bg-brand-50/40' : 'border-black/10 hover:border-black/20'
                    )}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">{method.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brand-950">{method.label}</span>
                        {method.badge && <span className="rounded-full bg-fresh-100 px-2 py-0.5 text-[10px] font-bold text-fresh-700">{method.badge}</span>}
                      </div>
                      <span className="text-xs text-black/50">{method.sub}</span>
                    </div>
                  </button>

                  {method.id === 'upi' && selectedMethod === 'upi' && (
                    <div className="rounded-xl bg-black/[0.02] p-3">
                      <div className="flex flex-wrap gap-2">
                        {['gpay', 'phonepe', 'paytm', 'manual'].map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubMethod(sub)}
                            className={cn(
                              'rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize',
                              selectedSubMethod === sub ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/10 text-black/60'
                            )}
                          >
                            {sub === 'manual' ? 'Other UPI' : sub === 'phonepe' ? 'PhonePe' : sub}
                          </button>
                        ))}
                      </div>
                      {selectedSubMethod === 'manual' && (
                        <input
                          type="text"
                          placeholder="user@upi"
                          value={manualUpiId}
                          onChange={(e) => setManualUpiId(e.target.value)}
                          className="mt-3 h-10 w-full rounded-lg border border-black/10 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                      )}
                    </div>
                  )}

                  {method.id === 'netbanking' && selectedMethod === 'netbanking' && (
                    <div className="rounded-xl bg-black/[0.02] p-3">
                      <div className="flex flex-wrap gap-2">
                        {popularBanks.map((bank) => (
                          <button
                            key={bank.id}
                            onClick={() => setSelectedBank(bank.id)}
                            className={cn(
                              'rounded-full border px-3.5 py-1.5 text-xs font-semibold',
                              selectedBank === bank.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/10 text-black/60'
                            )}
                          >
                            {bank.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Summary / action */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-black/5 bg-brand-50/30 p-5">
              {selectedMethod === 'upi' ? (
                <div className="flex flex-col items-center gap-2 pb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiString)}`}
                    alt="UPI QR Code"
                    className="size-32 rounded-lg bg-white p-1.5"
                  />
                  <p className="text-sm font-semibold text-brand-950">{isMobile ? 'Pay using App' : 'Scan to Pay'}</p>
                </div>
              ) : selectedMethod === 'cards' ? (
                <div className="flex flex-col items-center gap-2 pb-4 text-center">
                  <div className="flex gap-2">
                    {['VISA', 'Mastercard', 'RuPay'].map((brand) => (
                      <span key={brand} className="rounded-md border border-black/10 bg-white px-2.5 py-1 text-[10px] font-bold text-black/60">{brand}</span>
                    ))}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-brand-950">Enter card details on next step</p>
                  <p className="text-xs text-black/45">Secured by 256-bit encryption</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 pb-4 text-center">
                  <h3 className="text-sm font-bold text-brand-950">{popularBanks.find((b) => b.id === selectedBank)?.name} Bank</h3>
                  <p className="text-sm text-black/55">You will be redirected to your bank</p>
                </div>
              )}

              <div className="space-y-2 border-t border-black/10 pt-4 text-sm">
                <div className="flex justify-between text-black/60"><span>Items</span><span>₹{safeCartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-black/60"><span>Shipping</span><span>₹{shipping}</span></div>
                <div className="flex justify-between text-black/60"><span>Convenience (1.5%)</span><span>₹{convenienceFee}</span></div>
                <div className="flex justify-between border-t border-black/10 pt-2 text-base font-extrabold text-brand-950">
                  <span>Total</span><span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Button size="lg" className="mt-4 w-full" onClick={handlePayment} disabled={loading} loading={loading}>
                {loading ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString()}`}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 border-t border-black/5 pt-5 text-xs text-black/45">
          <span className="flex items-center gap-1"><Lock size={12} /> PCI DSS</span>
          <span>SSL Secured</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

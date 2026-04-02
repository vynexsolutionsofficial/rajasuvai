import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Smartphone, CreditCard, Landmark, Wallet, Banknote, CalendarDays, MapPin } from 'lucide-react';
import { api } from '../../services/api';
import './checkout.css';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [selectedSubMethod, setSelectedSubMethod] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [manualUpiId, setManualUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const addressId = location.state?.addressId;

  // Prices
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
    { id: 'KKBK', name: 'Kotak' }
  ];

  const paymentMethods = [
    { id: 'upi', label: 'UPI', sub: 'Pay by UPI (Google Pay, PhonePe, etc.)', icon: <Smartphone />, badge: 'INSTANT' },
    { id: 'cards', label: 'Cards', sub: 'Pay with credit or debit card', icon: <CreditCard />, logos: ['visa', 'mastercard', 'rupay'] },
    { id: 'netbanking', label: 'Netbanking', sub: 'Pay via any Indian bank', icon: <Landmark /> }
  ];

  const handlePayment = async () => {
    if (selectedMethod === 'upi' && selectedSubMethod === 'manual' && !manualUpiId) {
      alert('Please enter your UPI ID');
      return;
    }

    try {
      setLoading(true);
      const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Payment system offline. Please check your connection.');
        setLoading(false);
        return;
      }

      const orderData = await api.post('/api/payments/create-order', {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        address_id: addressId
      });

      if (!orderData.success || !orderData.razorOrder) {
        alert(orderData.error || 'Failed to initialize payment.');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
        amount: orderData.razorOrder.amount,
        currency: orderData.razorOrder.currency,
        name: 'Suvai Artisan Spices',
        description: 'Elite Transaction',
        order_id: orderData.razorOrder.id,
        handler: async function (response: any) {
          const verifyData = await api.post('/api/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId: orderData.dbOrderId,
            method: selectedMethod + (selectedMethod === 'upi' ? `_${selectedSubMethod}` : selectedMethod === 'netbanking' ? `_${selectedBank}` : '')
          });

          if (verifyData.success) {
            alert('Your order is successful! 🌿');
            navigate('/profile');
          } else {
            alert('Verification failed. System handles this via Webhook.');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        prefill: {
          name: 'Customer',
          email: 'support@suvai.com',
          contact: '9999999999',
          method: selectedMethod === 'upi' ? 'upi' : selectedMethod,
          bank: selectedMethod === 'netbanking' ? selectedBank : undefined
        },
        theme: { color: '#e65c00' }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error('PAYMENT_ERROR:', err);
      alert('Technical error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const upiString = `upi://pay?pa=suvai@upi&pn=Suvai&am=${finalTotal}&cu=INR`;

  return (
    <div className="checkout-page-container">
      <div className="checkout-main-card">
        <h1 className="checkout-title">SECURE PAYMENT</h1>
        
        <div className="checkout-badge-row">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="brand-logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="brand-logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="Rupay" className="brand-logo" />
        </div>

        <div className="checkout-split-view">
          <div className="checkout-left">
            <div className="methods-list">
              {paymentMethods.map((method) => (
                <React.Fragment key={method.id}>
                  <div 
                    className={`payment-method-item ${selectedMethod === method.id ? 'active' : ''}`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="method-icon-wrap">{method.icon}</div>
                    <div className="method-info">
                      <div className="method-label-row">
                          <span className="method-label">{method.label}</span>
                          {method.badge && <span className="method-badge">{method.badge}</span>}
                      </div>
                      <span className="method-subtitle">{method.sub}</span>
                    </div>
                  </div>

                  {method.id === 'upi' && selectedMethod === 'upi' && (
                    <div className="upi-app-selection-expanded">
                      <div className="sub-pills-row">
                        {['gpay', 'phonepe', 'paytm', 'manual'].map(sub => (
                          <button 
                            key={sub} 
                            className={`upi-app-pill ${selectedSubMethod === sub ? 'active' : ''}`} 
                            onClick={() => setSelectedSubMethod(sub)}
                          >
                            {sub === 'manual' ? '•••' : sub === 'phonepe' ? 'Pe' : sub.charAt(0).toUpperCase() + sub.slice(1)}
                          </button>
                        ))}
                      </div>
                      {selectedSubMethod === 'manual' && (
                        <div className="manual-upi-input-container">
                           <input 
                              type="text" 
                              placeholder="user@upi" 
                              value={manualUpiId}
                              onChange={(e) => setManualUpiId(e.target.value)}
                              className="manual-upi-input"
                           />
                        </div>
                      )}
                    </div>
                  )}

                  {method.id === 'netbanking' && selectedMethod === 'netbanking' && (
                    <div className="upi-app-selection-expanded">
                      <div className="sub-pills-row grid">
                        {popularBanks.map(bank => (
                          <button 
                            key={bank.id} 
                            className={`upi-app-pill ${selectedBank === bank.id ? 'active' : ''}`} 
                            onClick={() => setSelectedBank(bank.id)}
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

          <div className="checkout-right">
            <div className="payment-action-card">
              {selectedMethod === 'upi' ? (
                <div className="qr-checkout-box">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiString)}`} alt="QR" className="qr-code-img" />
                    <p className="scan-primary">{isMobile ? 'Pay using App' : 'Scan to Pay'}</p>
                </div>
              ) : selectedMethod === 'cards' ? (
                <div className="qr-checkout-box card-preview">
                    <div className="card-logos-row">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="Rupay" />
                    </div>
                    <p className="scan-primary">Enter card details on next step</p>
                    <p className="scan-secondary">Secured by 256-bit encryption</p>
                </div>
              ) : (
                <div className="qr-checkout-box bank-preview">
                    <h3>{popularBanks.find(b => b.id === selectedBank)?.name} Bank</h3>
                    <p className="scan-primary">You will be redirected to your bank</p>
                </div>
              )}

              <div className="price-summary-breakdown">
                <div className="summary-row"><span>Items</span><span>₹{safeCartTotal.toLocaleString()}</span></div>
                <div className="summary-row"><span>Shipping</span><span>₹{shipping}</span></div>
                <div className="summary-row highlight"><span>Convenience (1.5%)</span><span>₹{convenienceFee}</span></div>
                <div className="summary-row total"><span>Total</span><span>₹{finalTotal.toLocaleString()}</span></div>
              </div>

              <button className={`btn-pay-secure ${loading ? 'loading' : ''}`} onClick={handlePayment} disabled={loading}>
                {loading ? "..." : `PAY ₹${finalTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>

        <div className="checkout-trust-footer">
            <div className="trust-badge">
                <ShieldCheck size={18} />
                <span>100% Secure</span>
            </div>
            <div className="security-badges">
                <span className="pci-badge">PCI DSS</span>
                <span className="ssl-badge">🔒 SSL</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Gift, Truck, Wallet, Building2, Calculator, Tag, Lock } from 'lucide-react';
import { api } from '../../services/api';
import CartItem from './CartItem';
import './cart.css';

const CartPage: React.FC = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const shipping = cart.length > 0 ? 50 : 0;

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
    } catch (err) {
      setCouponError('Error validating coupon. Please try again.');
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === 'percentage') {
      return (cartTotal * (appliedCoupon.discount_value / 100));
    }
    return appliedCoupon.discount_value;
  };

  const finalTotalBeforeTax = cartTotal + shipping - calculateDiscount();

  return (
    <div className="cart-page-wrapper">
      <div className="cart-container container">
        {/* Left Side: Cart Items */}
        <div className="cart-left-section">
          <h1 className="cart-page-title">YOUR <span>CART</span></h1>

          <div className="cart-items-card">
            {cart.length === 0 ? (
              <div className="empty-cart-message">
                <p>Your cart is currently empty.</p>
                <button className="btn-continue-shopping" onClick={() => navigate('/shop')}>
                  RETURN TO SHOP
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="cart-totals-section">
                  <div className="cart-totals-row">
                    <span>Order Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                <div className="cart-bottom-actions">
                  <button className="btn-continue-shopping" onClick={() => navigate('/shop')}>
                    CONTINUE SHOPPING
                  </button>
                  <button className="btn-checkout" onClick={() => navigate('/checkout/address')}>
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: High-Fidelity Artisan Summary */}
        <div className="cart-right-section">
          <div className="artisan-summary-card">
            
            {/* 1. Coupons & Offers */}
            <div className="summary-promo-section">
              <label className="promo-label">COUPONS & OFFERS</label>
              <div className="promo-input-group">
                <input 
                  type="text" 
                  placeholder="Enter Code (e.g. SUVAI50)" 
                  className="promo-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <button className="btn-apply-promo" onClick={handleApplyCoupon}>APPLY</button>
              </div>
              <button className="btn-view-offers">
                <Gift size={16} /> <span>View Offers</span>
              </button>
              {couponError && <p className="promo-error-hint">{couponError}</p>}
            </div>

            {/* 2. Nested Order Summary Box */}
            <div className="inner-summary-box">
              <h3 className="inner-title">Order Summary</h3>
              
              <div className="billing-rows-list">
                <div className="artisan-billing-row">
                  <div className="row-icon-box"><Truck size={18} /></div>
                  <div className="row-info">
                    <span className="row-label">Subtotal</span>
                    <span className="row-sub">Standard (3-5 days)</span>
                  </div>
                  <span className="row-value">₹{cartTotal.toLocaleString()}</span>
                </div>

                <div className="artisan-billing-row">
                  <div className="row-icon-box"><Wallet size={18} /></div>
                  <div className="row-info">
                    <span className="row-label">Delivery Fee</span>
                    <span className="row-sub">Standard (3-5 days)</span>
                  </div>
                  <span className="row-value">₹{shipping}</span>
                </div>

                <div className="artisan-billing-row">
                  <div className="row-icon-box"><Building2 size={18} /></div>
                  <div className="row-info">
                    <span className="row-label">Convenience Fee</span>
                    <span className="row-sub">Payment Processing</span>
                  </div>
                  <span className="row-value">₹23</span>
                </div>

                <div className="artisan-billing-row">
                  <div className="row-icon-box"><Calculator size={18} /></div>
                  <div className="row-info">
                    <span className="row-label">Estimated Tax</span>
                    <span className="row-sub">GST @ 5%</span>
                  </div>
                  <span className="row-value">₹{Math.round(finalTotalBeforeTax * 0.05)}</span>
                </div>

                {appliedCoupon && (
                  <div className="artisan-billing-row discount">
                    <div className="row-icon-box"><Tag size={18} /></div>
                    <div className="row-info">
                      <span className="row-label">Discount</span>
                      <span className="row-sub">{appliedCoupon.code} Applied</span>
                    </div>
                    <span className="row-value">-₹{calculateDiscount()}</span>
                  </div>
                )}
              </div>

              <div className="inner-final-total">
                <span className="total-payable-label">Total Payable</span>
                <span className="total-payable-value">₹{Math.round(finalTotalBeforeTax * 1.05 + 23).toLocaleString()}</span>
              </div>
            </div>

            {/* 3. Action Button */}
            <div className="floating-action-box">
              <button className="btn-artisan-proceed" onClick={() => navigate('/checkout/address')}>
                PROCEED TO ADDRESS
              </button>
            </div>

            {/* 4. Trust Badges */}
            <div className="summary-trust-footer">
              <div className="trust-head">
                <ShieldCheck size={18} className="trust-icon" />
                <span>Safe & Secure Payments</span>
              </div>
              <ul className="trust-check-list">
                <li>No hidden charges</li>
                <li>100% PCI DSS & SSL secure</li>
              </ul>
            </div>

            {/* 5. Sticky Footer */}
            <div className="summary-sticky-footer">
              <Lock size={14} /> <span>Secure Step-by-Step Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

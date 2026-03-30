import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import './cart.css';

const CartPage: React.FC = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  const shipping = cart.length > 0 ? 50 : 0;
  const finalTotal = cartTotal + shipping;

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
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="cart-totals-row">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className="cart-totals-row cart-final-total">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <div className="cart-bottom-actions">
                  <button className="btn-continue-shopping" onClick={() => navigate('/shop')}>
                    CONTINUE SHOPPING
                  </button>
                  <button className="btn-checkout">
                    CHECKOUT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="cart-right-section">
          <h1 className="cart-page-title">PAYMENT</h1>

          <div className="payment-card">
            <div className="payment-methods">
              <div className="payment-icon visa">VISA</div>
              <div className="payment-icon mastercard">
                <div className="mc-circle-1"></div>
                <div className="mc-circle-2"></div>
              </div>
              <div className="payment-icon folder">📁</div>
            </div>

            <div className="payment-form-group">
              <input type="text" placeholder="1234 5678 8765 4321" className="payment-input" />
            </div>

            <div className="payment-form-group">
              <label className="input-floating-label">NAME ON CARD</label>
              <input type="text" placeholder="John Doe" className="payment-input" />
            </div>

            <div className="payment-form-row">
              <div className="payment-form-group half">
                <label className="input-floating-label">EXPIRY DATE</label>
                <input type="text" placeholder="MM / YY" className="payment-input" />
              </div>
              <div className="payment-form-group half">
                <input type="text" placeholder="CVV" className="payment-input cvv-input" />
              </div>
            </div>

            <div className="billing-divider"></div>
            <h3 className="billing-title">BILLING ADDRESS</h3>

            <div className="payment-form-group">
              <input type="text" placeholder="John Doe" className="payment-input" />
            </div>
            <div className="payment-form-group">
              <input type="email" placeholder="john@example.com" className="payment-input" />
            </div>
            <div className="payment-form-group">
              <input type="text" placeholder="123 Main Street" className="payment-input" />
            </div>
            <div className="payment-form-group">
              <input type="text" placeholder="Coimbatore, TN 641002" className="payment-input" />
            </div>

            <button className="btn-place-order" onClick={() => alert('Order Placed! (Demo)')}>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

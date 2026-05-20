import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react';
import './OrderConfirmation.css';

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
      <div className="oc-page">
        <div className="oc-card">
          <h2>Order details not found.</h2>
          <p>If you completed a payment, check your Order History in your profile.</p>
          <Link to="/profile" className="oc-btn-primary">Go to Profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="oc-page">
      <div className="oc-card">
        <div className="oc-success-icon">
          <CheckCircle size={56} strokeWidth={1.5} />
        </div>

        <h1 className="oc-title">Order Confirmed!</h1>
        <p className="oc-subtitle">
          Thank you for your purchase. Your order <strong>#{String(state.orderId).padStart(6, '0')}</strong> is being processed.
        </p>

        <div className="oc-delivery-banner">
          <Package size={18} />
          <span>Expected delivery by <strong>{expectedDelivery()}</strong></span>
        </div>

        <div className="oc-section">
          <h3 className="oc-section-title">Items Ordered</h3>
          <div className="oc-items-list">
            {state.items.map((item, i) => (
              <div key={i} className="oc-item-row">
                <span className="oc-item-qty">{item.quantity}×</span>
                <span className="oc-item-name">{item.name}</span>
                <span className="oc-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="oc-section">
          <h3 className="oc-section-title">Price Breakdown</h3>
          <div className="oc-breakdown">
            <div className="oc-row"><span>Subtotal</span><span>₹{state.subtotal.toLocaleString()}</span></div>
            <div className="oc-row"><span>Shipping</span><span>₹{state.shipping}</span></div>
            <div className="oc-row"><span>Convenience fee</span><span>₹{state.convenienceFee}</span></div>
            <div className="oc-row oc-total"><span>Total Paid</span><span>₹{state.total.toLocaleString()}</span></div>
          </div>
        </div>

        {state.address && (
          <div className="oc-section oc-address">
            <MapPin size={16} />
            <span>{state.address}</span>
          </div>
        )}

        <div className="oc-actions">
          <button className="oc-btn-secondary" onClick={() => navigate('/profile', { state: { tab: 'orders' } })}>
            Track My Order
          </button>
          <Link to="/shop" className="oc-btn-primary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

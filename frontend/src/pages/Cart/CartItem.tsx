import React from 'react';
import { useCart } from '../../context/CartContext';
import { Minus, Plus, X } from 'lucide-react';

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

  const getWeight = (name: string) => {
    if (name.includes('Powder') || name.includes('Masala')) return '100g';
    if (name.includes('Oil') || name.includes('Ghee')) return '500ml';
    return '250g';
  };

  return (
    <div className="cart-item-row">
      <div className="cart-item-image-box">
        <img src={item.image} alt={item.name} className="cart-item-image" />
      </div>

      <div className="cart-item-details">
        <div className="cart-item-top">
          <h3 className="cart-item-name">{item.name}</h3>
          <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} title="Remove">
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
        <p className="cart-item-weight">{getWeight(item.name)}</p>
        <div className="cart-item-bottom">
          <div className="cart-qty-selector">
            <button
              className="qty-btn-small"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span className="qty-value-small">{item.quantity}</span>
            <button
              className="qty-btn-small"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>
          <p className="cart-item-price">₹{(item.price * item.quantity).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

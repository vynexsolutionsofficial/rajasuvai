import React from 'react';
import { useCart } from '../../context/CartContext';

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

  // Extract weight from name or mock it.
  // E.g., Garam Masala -> 100g.
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
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-weight">{getWeight(item.name)}</p>
        <button 
          className="cart-item-remove" 
          onClick={() => removeFromCart(item.id)}
        >
          <span className="remove-icon">✕</span> REMOVE
        </button>
      </div>
      
      <div className="cart-item-controls">
        <div className="cart-qty-selector">
          <button 
            className="qty-btn-small" 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            −
          </button>
          <span className="qty-value-small">{item.quantity}</span>
          <button 
            className="qty-btn-small" 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="cart-item-price-box">
        <p className="cart-item-price">₹{item.price}</p>
        <p className="cart-item-pkg">PKG/AVG</p>
      </div>
    </div>
  );
};

export default CartItem;

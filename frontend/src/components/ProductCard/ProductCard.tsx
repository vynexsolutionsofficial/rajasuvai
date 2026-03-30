import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = (product) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { id, name, price, image, category } = product;

  // Modern Badge Logic
  let badge = null;
  if (name.includes('Turmeric') || name.includes('Coconut')) badge = 'NEW ARRIVAL';
  else if (name.includes('Chilli')) badge = 'LIMITED';
  else if (name.includes('Cashews')) badge = 'SALE';
  else if (name.includes('Candy')) badge = 'BEST SELLER';

  const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
  const originalPrice = Math.round(numPrice * 1.2); // 20% markup for "original" price

  return (
    <div className="product-card-vogue" onClick={() => navigate(`/product/${id}`)}>
      <div className="product-card-media">
        {badge && <span className="product-card-badge">{badge}</span>}
        <img src={image} alt={name} className="product-card-image" />
        <div className="product-card-overlay">
          <button 
            className="product-card-cta"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            QUICK ADD +
          </button>
        </div>
      </div>
      
      <div className="product-card-details">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-name">{name}</h3>
        <div className="product-card-price-row">
          <span className="product-card-price-current">₹{numPrice}</span>
          <span className="product-card-price-old">₹{originalPrice}</span>
        </div>
        <div className="product-card-rating">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="product-card-star">★</span>
          ))}
          <span className="product-card-review-count">(48)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

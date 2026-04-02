import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ShopProductCard.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

const ShopProductCard: React.FC<ProductCardProps> = (product) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id, name, price, image } = product;
  
  // High-fidelity image mapping for trial
  const getProductImage = (img: string, productName: string) => {
    const lowerName = productName.toLowerCase();
    if (lowerName.includes('turmeric')) return '/products/turmeric.png';
    if (lowerName.includes('garam')) return '/products/garam_masala.png';
    if (lowerName.includes('coconut')) return '/products/coconut_oil.png';
    if (lowerName.includes('cashew')) return '/products/cashews.png';
    if (lowerName.includes('pepper')) return '/products/pepper.png';
    if (lowerName.includes('saffron')) return '/products/saffron.png';
    if (lowerName.includes('amla')) return '/products/amla_candy.png';
    if (lowerName.includes('chilli') || lowerName.includes('chili')) return '/products/chilli.png';
    if (lowerName.includes('ghee')) return '/products/ghee.png';
    if (lowerName.includes('cardamom')) return '/products/cardamom.png';
    return img;
  };

  // Badges matching reference screenshots
  let badge = null;
  if (name.includes('Turmeric') || name.includes('Coconut')) badge = 'NEW';
  else if (name.includes('Chilli')) badge = 'HOT';
  else if (name.includes('Cashew')) badge = 'SALE';
  else if (name.includes('Amla')) badge = 'BEST SELLER';

  const rating = name.includes('Garam') ? 4 : 0;

  return (
    <div 
      className="shop-product-card" 
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="shop-product-image-container">
        {badge && (
          <span className={`shop-badge badge-${badge.toLowerCase().replace(' ', '-')}`}>
            {badge}
          </span>
        )}
        <img src={getProductImage(image, name)} alt={name} className="shop-product-image" />
      </div>
      
      <div className="shop-product-details">
        <h3 className="shop-product-name">{name}</h3>
        {rating > 0 && (
          <div className="shop-product-rating">
            {Array(5).fill(0).map((_, i) => (
              <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>★</span>
            ))}
          </div>
        )}
        <p className="shop-product-price">₹{price.replace(/[^0-9.]/g, '')}</p>
        
        <div className="shop-product-actions">
          <button 
            className="btn-add-cart-mini" 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            Add to Cart
          </button>
          <button 
            className="btn-buy-mini"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              navigate('/cart');
            }}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;

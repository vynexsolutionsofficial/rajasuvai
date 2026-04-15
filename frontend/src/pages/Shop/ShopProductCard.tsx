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

  // Image mapping
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

  // Badge logic
  let badge: string | null = null;
  if (name.includes('Turmeric') || name.includes('Coconut')) badge = 'NEW';
  else if (name.includes('Chilli')) badge = 'HOT';
  else if (name.includes('Cashew')) badge = 'SALE';
  else if (name.includes('Amla')) badge = 'BESTSELLER';

  // Mocked weight & old price
  const weight = '250g';
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
  const oldPrice = Math.round(numericPrice * 1.2);

  return (
    <div
      className="sp-card"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Image Section */}
      <div className="sp-image-wrap">
        {badge && <span className="sp-badge">{badge}</span>}
        <img
          src={getProductImage(image, name)}
          alt={name}
          className="sp-image"
        />
      </div>

      {/* Content Section */}
      <div className="sp-content">
        <h3 className="sp-name">{name}</h3>
        <p className="sp-weight">{weight}</p>

        <div className="sp-footer">
          <div className="sp-prices">
            <span className="sp-price">₹{numericPrice}</span>
            <span className="sp-old-price">₹{oldPrice}</span>
          </div>
          <button
            className="sp-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;

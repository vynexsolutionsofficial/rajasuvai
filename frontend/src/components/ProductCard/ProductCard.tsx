import React from 'react';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, category }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={image} alt={name} className="product-image" />
        <button className="add-to-cart-overlay">Add to Cart</button>
      </div>
      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price}</p>
      </div>
    </div>
  );
};

export default ProductCard;

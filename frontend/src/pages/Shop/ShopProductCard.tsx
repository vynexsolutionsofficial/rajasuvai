import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getProductCoverImage } from '../../utils/imageLoader';
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
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const { id, name, price, image } = product;

  let badge: string | null = null;
  if (name.includes('Turmeric') || name.includes('Coconut')) badge = 'NEW';
  else if (name.includes('Chilli')) badge = 'HOT';
  else if (name.includes('Cashew')) badge = 'SALE';
  else if (name.includes('Amla')) badge = 'BESTSELLER';

  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

  // Extract weight from the product name (e.g. "Fried Gram 50gm" -> "50gm")
  const weightMatch = name.match(/(\d+\s*(?:kg|g|gm|ml|l))/i);
  const weight = weightMatch ? weightMatch[1].toLowerCase() : '';

  return (
    <div className="sp-card" onClick={() => navigate(`/product/${id}`)}>
      <div className="sp-image-wrap">
        {badge && <span className="sp-badge">{badge}</span>}
        <img
          src={getProductCoverImage(image)}
          alt={name}
          className="sp-image"
        />
      </div>

      <div className="sp-content">
        <h3 className="sp-name">{name}</h3>
        <p className="sp-weight">{weight}</p>

        <div className="sp-stars">
          <span className="sp-stars-icons">★★★★½</span>
          <span className="sp-stars-count">(4.5)</span>
        </div>

        <div className="sp-footer">
          <div className="sp-prices">
            <span className="sp-price">₹{numericPrice}</span>
          </div>
          <button
            className={`sp-add-btn${added ? ' sp-add-btn--added' : ''}`}
            disabled={added}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await addToCart(product);
                showToast(`${name} added to cart!`, 'success');
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              } catch {
                showToast('Failed to add to cart. Please try again.', 'error');
              }
            }}
          >
            {added ? '✓ Added' : <><Plus size={14} strokeWidth={2.5} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;

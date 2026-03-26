import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = (product) => {
  const { addToCart } = useCart();
  const { name, price, image, category } = product;
  
  // Random badge for demo
  const badge = name.includes('Turmeric') ? 'NEW' : name.includes('Chilli') ? 'HOT' : null;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {badge && <span className={`product-badge ${badge.toLowerCase()}`}>{badge}</span>}
        <img src={image} alt={name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">₹ {price.replace(/[^0-9.]/g, '')}</p>
      </div>
    </div>
  );
};

export default ProductCard;

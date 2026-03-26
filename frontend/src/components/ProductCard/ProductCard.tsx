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
  
  // Logic based on screenshot
  let badge = null;
  if (name.includes('Turmeric') || name.includes('Coconut')) badge = 'NEW';
  else if (name.includes('Chilli')) badge = 'HOT';
  else if (name.includes('Cashews')) badge = 'SALE';
  else if (name.includes('Candy')) badge = 'BEST SELLER';

  const rating = name.includes('Garam') ? 4 : 0;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {badge && (
          <span className={`product-badge ${badge.toLowerCase().split(' ')[0]}`}>
            {badge}
          </span>
        )}
        <img src={image} alt={name} className="product-image" />
        <button 
          className="add-to-cart-simple"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        {rating > 0 && (
          <div className="product-rating">
            {Array(5).fill(0).map((_, i) => (
              <span key={i} style={{ color: i < rating ? '#ffb400' : '#ddd' }}>★</span>
            ))}
          </div>
        )}
        <p className="product-price">₹ {price.replace(/[^0-9.]/g, '')}</p>
        
        <div className="product-actions-fixed">
          <button 
            className="btn-add-cart"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            Add to Kart
          </button>
          <button 
            className="btn-buy-now"
            onClick={(e) => {
              e.stopPropagation();
              // Handle buy now logic (e.g., add to cart and redirect to checkout)
              addToCart(product);
            }}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

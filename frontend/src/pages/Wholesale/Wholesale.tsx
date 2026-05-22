import React, { useEffect, useState } from 'react';
import './Wholesale.css';
import { Package, TrendingUp, Phone, Mail, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { getProductCoverImage } from '../../utils/imageLoader';

interface Product {
  id: number;
  name: string;
  image: string;
  description?: string;
}

const Wholesale: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const data = await api.get('/api/products', { limit: 100 });
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching wholesale products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const defaultQuantities = ['5kg', '10kg', '25kg', '50kg', '100kg+'];

  return (
    <div className="wholesale-page">
      
      {/* Catalog Section (First) */}
      <div className="wholesale-catalog-section">
        <div className="catalog-header">
          <h2>Our Wholesale Catalog</h2>
          <p>Explore our premium range of spices available in large-scale packaging for businesses of all sizes.</p>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading products...</div>
        ) : (
          <div className="catalog-grid">
            {products.map((product) => (
              <div className="catalog-card" key={product.id}>
                <div className="catalog-image-wrapper">
                  <img 
                    src={getProductCoverImage(product.image)} 
                    alt={product.name} 
                    className="catalog-image" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="catalog-details">
                  <h3>{product.name}</h3>
                  <p className="catalog-desc">{product.description || `Premium wholesale ${product.name.toLowerCase()} sourced directly from farms.`}</p>
                  <div className="catalog-price" style={{ marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600, color: '#1c1917' }}>
                    Wholesale Price: <span style={{ color: '#E8600A' }}>₹--- / kg</span>
                  </div>
                  <div className="catalog-quantities">
                    <h4>Available Bulk Sizes:</h4>
                    <div className="quantity-tags">
                      {defaultQuantities.map((qty, idx) => (
                        <span key={idx} className="quantity-tag">{qty}</span>
                      ))}
                    </div>
                  </div>
                  <button className="quote-button" onClick={() => window.location.href = '/contact'}>
                    Request Quote <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="wholesale-benefits-section">
        <h2>Why Partner With Us?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <Package size={40} className="benefit-icon" />
            <h3>Bulk Quantities</h3>
            <p>Whether you're a restaurant, retailer, or distributor, we can supply the volume you need without compromising on quality.</p>
          </div>
          <div className="benefit-card">
            <TrendingUp size={40} className="benefit-icon" />
            <h3>Wholesale Discounts</h3>
            <p>Enjoy exclusive wholesale pricing on every product in our catalog. Better margins mean better business for you.</p>
          </div>
          <div className="benefit-card">
            <Phone size={40} className="benefit-icon" />
            <h3>Dedicated Support</h3>
            <p>Get personalized assistance, marketing materials, and support from our dedicated B2B team to help you succeed.</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="wholesale-contact-section">
        <div className="contact-card">
          <h2>Ready to Order?</h2>
          <p>Contact us today for a custom quote, full product catalog, and more details on our wholesale program.</p>
          <div className="contact-methods">
            <div className="contact-method">
              <Phone className="contact-icon" />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-method">
              <Mail className="contact-icon" />
              <span>wholesale@rajasuvai.com</span>
            </div>
          </div>
          <button className="inquire-button" onClick={() => window.location.href = '/contact'}>
            Inquire Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wholesale;

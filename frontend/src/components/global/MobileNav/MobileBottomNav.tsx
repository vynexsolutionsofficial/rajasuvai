import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import './MobileBottomNav.css';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  const navItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/' },
    { icon: <ShoppingBag size={22} />, label: 'Shop', path: '/shop' },
    { icon: <ShoppingCart size={22} />, label: 'Cart', path: '/cart', count: cartCount },
    { icon: <User size={22} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrapper">
              {item.icon}
              {item.count !== undefined && item.count > 0 && (
                <span className="mobile-cart-badge">{item.count}</span>
              )}
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;

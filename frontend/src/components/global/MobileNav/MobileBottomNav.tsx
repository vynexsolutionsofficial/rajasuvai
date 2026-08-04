import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { cn } from '../../../lib/cn';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBag, label: 'Shop', path: '/shop' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', count: cartCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ icon: Icon, label, path, count }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 text-black/45',
                active && 'text-brand-600'
              )}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                {count !== undefined && count > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex size-[16px] items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

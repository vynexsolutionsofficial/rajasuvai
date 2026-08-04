import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, ShieldCheck, X } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import AuthModal from '../Auth/AuthModal';
import { cn } from '../../../lib/cn';
import logo from '../../../assets/logo.png';

const navLinks = [
  { label: 'Shop', path: '/shop' },
  { label: 'Wholesale', path: '/wholesale' },
  { label: 'Our Story', path: '/story' },
  { label: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname]);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-(--container-page) items-center gap-4 px-4 sm:h-20 sm:px-6">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Rajasuvai" className="h-9 w-auto sm:h-11" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-semibold tracking-wide text-brand-950/70 transition-colors hover:text-brand-600',
                location.pathname === link.path && 'text-brand-600'
              )}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                'flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600',
                location.pathname.startsWith('/admin') && 'text-brand-600'
              )}
            >
              <ShieldCheck size={16} /> ADMIN
            </Link>
          )}
        </nav>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="ml-auto hidden max-w-sm flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" />
            <input
              type="text"
              placeholder="Search for spices, staples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-black/10 bg-brand-50/60 pl-9 pr-4 text-sm placeholder:text-black/40 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-2">
          {/* Mobile search toggle */}
          <button
            className="flex size-10 items-center justify-center rounded-full text-brand-950 hover:bg-black/5 md:hidden"
            onClick={() => setShowSearch((v) => !v)}
            aria-label="Search"
          >
            {showSearch ? <X size={20} /> : <Search size={20} />}
          </button>

          <button
            className="hidden size-10 items-center justify-center gap-1 rounded-full text-brand-950 hover:bg-black/5 sm:flex md:size-auto md:px-3"
            onClick={() => (user ? navigate('/profile') : setShowAuthModal(true))}
          >
            <User size={20} />
            {!user && <span className="hidden text-sm font-semibold md:inline">Login</span>}
          </button>

          <Link
            to="/cart"
            className="relative flex size-10 items-center justify-center rounded-full text-brand-950 hover:bg-black/5"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/shop"
            className="hidden rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-600 lg:inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <form onSubmit={handleSearch} className="border-t border-black/5 px-4 py-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for spices, staples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-black/10 bg-brand-50/60 pl-9 pr-4 text-sm placeholder:text-black/40 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </form>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  );
};

export default Navbar;

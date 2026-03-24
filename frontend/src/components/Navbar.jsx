import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, Search, X, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/* ─── Color Palette ────────────────────────────────────────────────────
   Transparent (on Hero):
     text          → white / white-70
     accent        → amber-400
     bg            → transparent → dark blurred on scroll
   Scrolled / Non-home:
     text          → stone-900
     accent        → amber-600
     bg            → white/90 + backdrop-blur-xl
     border        → stone-100
──────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Home',        to: '/' },
  { label: 'Shop Spices', to: '/products' },
  { label: 'Our Story',   to: '/our-story' },
  { label: 'Contact',     to: '/contact' },
];

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [query,      setQuery]      = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const searchRef = useRef(null);

  const { cart }  = useCart();
  const count     = cart.reduce((s, i) => s + i.quantity, 0);
  const navigate  = useNavigate();
  const location  = useLocation();
  const prevCount = useRef(count);

  useEffect(() => {
    // Pages with immersive full-screen heroes — start transparent
    const immersivePages = ['/', '/products', '/our-story', '/contact'];
    const isImmersive = immersivePages.includes(location.pathname);
    const onScroll = () => {
      setScrolled(isImmersive ? window.scrollY > 40 : true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  /* Cart bounce */
  useEffect(() => {
    if (count > prevCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    prevCount.current = count;
  }, [count]);

  /* Search focus */
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const isHome  = location.pathname === '/';
  const isLight = scrolled; // white bg when scrolled

  return (
    <>
      {/* ── Main Header ───────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
          ${isLight
            ? 'bg-white/95 backdrop-blur-xl border-b border-stone-100/80 shadow-[0_2px_20px_rgba(0,0,0,0.06)] py-3'
            : 'bg-transparent py-5'
          }`}
      >
        <div className="page-container">
          <nav className="flex items-center gap-8">

            {/* ── Logo ─────────────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 mr-auto lg:mr-0">
              {/* Flame icon mark */}
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg
                ${isLight
                  ? 'bg-amber-600 text-white shadow-amber-600/20 group-hover:scale-110 group-hover:rotate-6'
                  : 'bg-white/15 text-amber-400 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6'
                }`}>
                <Flame size={18} strokeWidth={2.5} />
              </span>
              <div className="flex flex-col leading-none">
                <span className={`font-black text-xl md:text-2xl tracking-tighter transition-all duration-500
                  ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  Rajasuvai
                  <span className={`italic transition-colors duration-500 ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>.</span>
                </span>
                <span className={`text-[8px] font-black uppercase tracking-[0.3em] transition-colors duration-500
                  ${isLight ? 'text-stone-400' : 'text-white/40'}`}>
                  Artisan Spices
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-3 flex-grow justify-start ml-8">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`relative px-4 py-2 rounded-lg text-[12px] font-black uppercase tracking-[0.18em] transition-all duration-300 group/link
                      ${isActive
                        ? isLight
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-amber-400 bg-white/10'
                        : isLight
                          ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                          : 'text-white/60 hover:text-white hover:bg-white/8'
                      }`}
                  >
                    {link.label}
                    {/* Active dot */}
                    {isActive && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full
                        ${isLight ? 'bg-amber-600' : 'bg-amber-400'}`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Right Actions ────────────────────────────────────── */}
            <div className="flex items-center gap-3 ml-auto lg:ml-0 flex-shrink-0">

              {/* Search bar - desktop */}
              <form onSubmit={handleSearch} className="hidden md:flex relative items-center">
                <button
                  type="button"
                  onClick={() => setSearchOpen(v => !v)}
                  className={`p-2.5 rounded-xl transition-all duration-300
                    ${isLight
                      ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Search size={19} strokeWidth={2.5} />
                </button>
                <div className={`overflow-hidden transition-all duration-400 ease-in-out
                  ${searchOpen ? 'w-52 opacity-100 ml-1' : 'w-0 opacity-0'}`}>
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search spices..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className={`w-full py-2.5 px-4 rounded-xl text-[11px] font-bold tracking-wide
                      focus:outline-none focus:ring-2 transition-all duration-300
                      ${isLight
                        ? 'bg-stone-100 text-stone-900 placeholder-stone-400 focus:ring-amber-500/30 focus:bg-white border border-stone-200'
                        : 'bg-white/10 text-white placeholder-white/40 focus:ring-amber-400/30 backdrop-blur-sm border border-white/10'
                      }`}
                  />
                </div>
              </form>

              {/* Divider */}
              <div className={`hidden md:block h-6 w-px transition-colors duration-500
                ${isLight ? 'bg-stone-200' : 'bg-white/15'}`} />

              {/* Cart icon */}
              <Link
                to="/cart"
                className={`relative p-2.5 rounded-xl transition-all duration-300 group/cart
                  ${isLight
                    ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                <ShoppingCart
                  size={21}
                  strokeWidth={2.5}
                  className={`transition-transform duration-300 ${cartBounce ? 'scale-125 rotate-12' : 'group-hover/cart:scale-110'}`}
                />
                {count > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-[9px] font-black
                    w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${cartBounce ? 'scale-125 bg-green-500 border-white' : 'bg-amber-600 border-white scale-100'}`}>
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>

              {/* CTA Button - desktop */}
              <Link
                to="/products"
                className={`hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em]
                  transition-all duration-300 hover:scale-105 active:scale-95 shadow-md
                  ${isLight
                    ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/25'
                    : 'bg-amber-500 text-white hover:bg-amber-400 shadow-amber-500/30'
                  }`}
              >
                Shop Now
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                className={`lg:hidden p-2.5 rounded-xl transition-all duration-300
                  ${isLight
                    ? 'text-stone-700 hover:bg-stone-100'
                    : 'text-white hover:bg-white/10'
                  }`}
              >
                {menuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
              </button>
            </div>

          </nav>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm transition-all duration-400
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[min(340px,90vw)] bg-white flex flex-col
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-2xl
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
              <Flame size={16} strokeWidth={2.5} />
            </span>
            <span className="font-black text-lg text-stone-900 tracking-tighter">
              Rajasuvai<span className="text-amber-600 italic">.</span>
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-all"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="px-8 py-5 border-b border-stone-100">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search spices..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full py-3 pl-10 pr-4 rounded-xl bg-stone-100 text-stone-900 text-sm font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </form>

        {/* Mobile nav links */}
        <div className="flex flex-col px-6 py-4 flex-1 gap-1">
          {NAV_LINKS.map((link, i) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: `${i * 50}ms` }}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-black text-base uppercase tracking-wider transition-all duration-300
                  ${isActive
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                  }`}
              >
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-600 flex-shrink-0" />}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Drawer footer */}
        <div className="px-8 py-6 border-t border-stone-100 space-y-3">
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-600/20"
          >
            Shop All Spices
          </Link>
          <p className="text-center text-[9px] font-black text-stone-300 uppercase tracking-[0.4em]">
            Premium Artisanal Spices
          </p>
        </div>
      </div>
    </>
  );
}

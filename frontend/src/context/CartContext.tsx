import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, qty?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  loading: boolean;
  syncMessage: string | null;
  clearSyncMessage: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const wasLoggedIn = previousUserId.current !== null;
    const isLoggedIn = !!user;
    previousUserId.current = user?.id ?? null;

    if (!wasLoggedIn && isLoggedIn) {
      syncGuestCart();
    } else if (wasLoggedIn && !isLoggedIn) {
      setCart([]);
      localStorage.removeItem('rajasuvai_cart');
    } else if (isLoggedIn) {
      fetchCartFromDB();
    } else {
      const local = localStorage.getItem('rajasuvai_cart');
      if (local) setCart(JSON.parse(local));
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchCartFromDB = async () => {
    try {
      setLoading(true);
      const dbCart = await api.get('/api/cart');
      setCart(dbCart);
    } catch (err) {
      console.error('Failed to fetch DB cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncGuestCart = async () => {
    try {
      setLoading(true);
      const local = localStorage.getItem('rajasuvai_cart');
      const items = local ? JSON.parse(local) : [];

      if (items.length > 0) {
        await api.post('/api/cart/sync', { items });
        localStorage.removeItem('rajasuvai_cart');
        setSyncMessage(`${items.length} item${items.length !== 1 ? 's' : ''} synced to your cart!`);
      }

      const finalCart = await api.get('/api/cart');
      setCart(finalCart);
    } catch (err) {
      console.error('Cart sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: any, qty: number = 1) => {
    const numericPrice = typeof product.price === 'string'
      ? parseFloat(product.price.replace(/[^0-9.]/g, ''))
      : product.price;

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: numericPrice,
      image: product.image || '',
      quantity: qty
    };

    if (user) {
      await api.post('/api/cart', { product_id: product.id, quantity: qty });
      await fetchCartFromDB();
    } else {
      const updatedCart = [...cart];
      const existing = updatedCart.find(i => i.id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        updatedCart.push(newItem);
      }
      setCart(updatedCart);
      localStorage.setItem('rajasuvai_cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = async (productId: number) => {
    if (user) {
      await api.delete(`/api/cart/${productId}`);
      await fetchCartFromDB();
    } else {
      const updatedCart = cart.filter(item => item.id !== productId);
      setCart(updatedCart);
      localStorage.setItem('rajasuvai_cart', JSON.stringify(updatedCart));
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    if (user) {
      await api.put('/api/cart', { product_id: productId, quantity });
      await fetchCartFromDB();
    } else {
      const updatedCart = cart.map(item => item.id === productId ? { ...item, quantity } : item);
      setCart(updatedCart);
      localStorage.setItem('rajasuvai_cart', JSON.stringify(updatedCart));
    }
  };

  const clearCart = async () => {
    if (user) {
      await api.delete('/api/cart');
      setCart([]);
    } else {
      setCart([]);
      localStorage.removeItem('rajasuvai_cart');
    }
  };

  const clearSyncMessage = () => setSyncMessage(null);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, loading, syncMessage, clearSyncMessage }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

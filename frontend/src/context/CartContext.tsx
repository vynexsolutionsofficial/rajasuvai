import React, { createContext, useContext, useState, useEffect } from 'react';

import { api } from '../services/api';
import { supabase } from '../supabaseClient';

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initial Sync and Auth Listener
  useEffect(() => {
    // 1. Initial Auth Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
         fetchCartFromDB();
      } else {
         const local = localStorage.getItem('rajasuvai_cart');
         if (local) setCart(JSON.parse(local));
         setLoading(false);
      }
    });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      
      if (!user && newUser) {
        // User just logged in - Merge guest cart
        syncGuestCart(newUser);
      } else if (user && !newUser) {
        // User just logged out - Reset to empty (or local storage if preferred)
        setCart([]);
        localStorage.removeItem('rajasuvai_cart');
      }
      setUser(newUser);
    });

    return () => subscription.unsubscribe();
  }, [user]);

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

  const syncGuestCart = async (targetUser: any) => {
    try {
      setLoading(true);
      const local = localStorage.getItem('rajasuvai_cart');
      const items = local ? JSON.parse(local) : [];
      
      if (items.length > 0) {
        await api.post('/api/cart/sync', { items });
        localStorage.removeItem('rajasuvai_cart');
      }
      
      // Refresh state from DB after merge
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

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

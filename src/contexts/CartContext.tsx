import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, TABLES, CartItem, Product } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

interface LocalCartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorage key for cart
const CART_STORAGE_KEY = 'keyiflikutu_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage or Supabase
  const loadCart = async () => {
    if (!user) {
      // Load from localStorage for non-authenticated users
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      if (localCart) {
        try {
          const parsed: LocalCartItem[] = JSON.parse(localCart);
          // Fetch product details for each item
          const itemsWithProducts = await Promise.all(
            parsed.map(async (item) => {
              const { data: product } = await supabase
                .from(TABLES.PRODUCT)
                .select('*')
                .eq('id', item.product_id)
                .single();
              return { ...item, product, user_id: '' };
            })
          );
          setCartItems(itemsWithProducts);
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(TABLES.CART)
        .select(`
          *,
          product:${TABLES.PRODUCT}(*)
        `)
        .eq('user_id', user.id);

        if (error) throw error;

        if (Array.isArray(data)) {
          setCartItems(data as unknown as CartItem[]);
        } else {
          console.error('Unexpected Supabase response format:', data);
          setCartItems([]);
        }
        
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Sync localStorage cart to Supabase on login
  const syncLocalCartToSupabase = async () => {
    if (!user) return;

    const localCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!localCart) return;

    try {
      const parsed: LocalCartItem[] = JSON.parse(localCart);
      for (const item of parsed) {
        await supabase.from(TABLES.CART).upsert({
          user_id: user.id,
          product_id: item.product_id,
          quantity: item.quantity,
        }, { onConflict: 'user_id,product_id' });
      }
      localStorage.removeItem(CART_STORAGE_KEY);
      await loadCart();
      toast.success('Cart synced successfully');
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  useEffect(() => {
    if (user) {
      syncLocalCartToSupabase();
    }
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      // Add to localStorage
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      const cart: LocalCartItem[] = localCart ? JSON.parse(localCart) : [];
      const existingIndex = cart.findIndex((item) => item.product_id === productId);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          id: `local_${Date.now()}`,
          product_id: productId,
          quantity,
          created_at: new Date().toISOString(),
        });
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      await loadCart();
      toast.success('Added to cart');
      return;
    }

    try {
      const existingItem = cartItems.find((item) => item.product_id === productId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        await updateQuantity(productId, newQuantity);
      } else {
        const { error } = await supabase.from(TABLES.CART).insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        });

        if (error) throw error;
        await loadCart();
        toast.success('Added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!user) {
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      if (localCart) {
        const cart: LocalCartItem[] = JSON.parse(localCart);
        const itemIndex = cart.findIndex((item) => item.product_id === productId);
        if (itemIndex >= 0) {
          cart[itemIndex].quantity = quantity;
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
          await loadCart();
          toast.success('Cart updated');
        }
      }
      return;
    }

    try {
      const { error } = await supabase
        .from(TABLES.CART)
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await loadCart();
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      if (localCart) {
        const cart: LocalCartItem[] = JSON.parse(localCart);
        const filtered = cart.filter((item) => item.product_id !== productId);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
        await loadCart();
        toast.success('Removed from cart');
      }
      return;
    }

    try {
      const { error } = await supabase
        .from(TABLES.CART)
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await loadCart();
      toast.success('Removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartItems([]);
      toast.success('Cart cleared');
      return;
    }

    try {
      const { error } = await supabase.from(TABLES.CART).delete().eq('user_id', user.id);

      if (error) throw error;
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  itemsCount: number;
  cartTotal: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Debug: Log cart items changes (remove in production)
  useEffect(() => {
    console.log('CartContext - Cart items count:', cartItems.length);
  }, [cartItems]);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.cart_items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Don't show error toast if user is not authenticated
      if (user) {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart();
      toast.success('Added to cart');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add to cart';
      toast.error(message);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    // Optimistic update
    const oldCartItems = [...cartItems];
    const updatedItems = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity, subtotal: (item.product?.price || 0) * quantity }
        : item
    );
    setCartItems(updatedItems);

    try {
      await cartService.updateCartItem(itemId, quantity);
      // Fetch fresh data to ensure consistency
      await fetchCart();
      // Don't show toast for every update to avoid spam
    } catch (error: any) {
      // Revert optimistic update on error
      setCartItems(oldCartItems);
      const message = error.response?.data?.error || 'Failed to update cart';
      toast.error(message);
    }
  };

  const removeFromCart = async (itemId: number) => {
    // Optimistic update
    const oldCartItems = [...cartItems];
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);

    try {
      await cartService.removeFromCart(itemId);
      // Fetch fresh data to ensure consistency
      await fetchCart();
      toast.success('Removed from cart');
    } catch (error: any) {
      // Revert optimistic update on error
      setCartItems(oldCartItems);
      const message = error.response?.data?.error || 'Failed to remove from cart';
      toast.error(message);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart();
      toast.success('Cart cleared');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to clear cart';
      toast.error(message);
    }
  };

  // Fetch cart when user changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  // Calculate derived values
  const itemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.subtotal, 0);

  const value: CartContextType = {
    cartItems,
    loading,
    itemsCount,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
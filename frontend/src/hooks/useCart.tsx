import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart');
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
    try {
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart();
      toast.success('Cart updated');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update cart';
      toast.error(message);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await cartService.removeFromCart(itemId);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to remove from cart';
      toast.error(message);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to clear cart';
      toast.error(message);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetchCart: fetchCart,
    cartTotal: getCartTotal(),
    itemsCount: getCartItemsCount(),
  };
};

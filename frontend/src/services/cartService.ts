import apiService from './api';
import { 
  ApiResponse, 
  CartItem, 
  CartItemRequest 
} from '../types';

class CartService {
  async getCart(): Promise<{ cart_items: CartItem[], total_amount: number, total_items: number }> {
    try {
      const response = await apiService.get('/cart');
      console.log('Cart API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  async addToCart(productId: string | number, quantity: number): Promise<CartItem> {
    try {
      const cartData = { 
        product_id: typeof productId === 'string' ? parseInt(productId) : productId, 
        quantity 
      };
      console.log('Adding to cart:', cartData);
      const response = await apiService.post('/cart/add', cartData);
      console.log('Add to cart response:', response);
      return response.cart_item;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(itemId: string | number, quantity: number): Promise<CartItem> {
    try {
      const response = await apiService.put(`/cart/item/${itemId}`, { quantity });
      console.log('Update cart item response:', response);
      return response.cart_item;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async removeFromCart(itemId: string | number): Promise<void> {
    try {
      const response = await apiService.delete(`/cart/item/${itemId}`);
      console.log('Remove from cart response:', response);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      const response = await apiService.delete('/cart/clear');
      console.log('Clear cart response:', response);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  async getCartTotal(): Promise<number> {
    try {
      const response = await this.getCart();
      return response.total_amount || 0;
    } catch (error) {
      console.error('Error getting cart total:', error);
      return 0;
    }
  }

  async getCartItemCount(): Promise<number> {
    try {
      const response = await this.getCart();
      return response.total_items || 0;
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return 0;
    }
  }

  // Local storage methods for offline cart (optional)
  getLocalCart(): CartItem[] {
    const cartStr = localStorage.getItem('cart');
    if (cartStr) {
      try {
        return JSON.parse(cartStr);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    return [];
  }

  saveLocalCart(cartItems: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  clearLocalCart(): void {
    localStorage.removeItem('cart');
  }

  async syncLocalCartWithServer(): Promise<void> {
    const localCart = this.getLocalCart();
    
    if (localCart.length > 0) {
      try {
        // Add each local cart item to server
        for (const item of localCart) {
          await this.addToCart(item.productId, item.quantity);
        }
        
        // Clear local cart after successful sync
        this.clearLocalCart();
      } catch (error) {
        console.error('Failed to sync cart with server:', error);
        throw error;
      }
    }
  }
}

export const cartService = new CartService();
export default cartService;

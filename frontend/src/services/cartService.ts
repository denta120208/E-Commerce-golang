import apiService from './api';
import { 
  ApiResponse, 
  CartItem, 
  CartItemRequest 
} from '../types';

class CartService {
  async getCart(): Promise<ApiResponse<{ items: CartItem[] }>> {
    const response = await apiService.get<ApiResponse<{ items: CartItem[] }>>('/cart');
    return response;
  }

  async addToCart(productId: string | number, quantity: number): Promise<CartItem> {
    const cartData: CartItemRequest = { productId: productId.toString(), quantity };
    const response = await apiService.post<ApiResponse<CartItem>>('/cart', cartData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add item to cart');
  }

  async updateCartItem(itemId: string | number, quantity: number): Promise<CartItem> {
    const response = await apiService.put<ApiResponse<CartItem>>(`/cart/${itemId}`, { quantity });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update cart item');
  }

  async removeFromCart(itemId: string | number): Promise<void> {
    const response = await apiService.delete<ApiResponse<null>>(`/cart/${itemId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to remove item from cart');
    }
  }

  async clearCart(): Promise<void> {
    const response = await apiService.delete<ApiResponse<null>>('/cart');
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to clear cart');
    }
  }

  async getCartTotal(): Promise<number> {
    const response = await this.getCart();
    const cartItems = response.data?.items || [];
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  }

  async getCartItemCount(): Promise<number> {
    const response = await this.getCart();
    const cartItems = response.data?.items || [];
    return cartItems.reduce((count, item) => count + item.quantity, 0);
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

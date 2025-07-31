import apiService from './api';
import { 
  ApiResponse, 
  PaginatedResponse, 
  Order, 
  OrderRequest 
} from '../types';

class OrderService {
  async getOrders(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return apiService.get<PaginatedResponse<Order[]>>(`/orders?${params.toString()}`);
  }

  async getOrder(id: string): Promise<Order> {
    const response = await apiService.get<ApiResponse<Order>>(`/orders/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get order');
  }

  async createOrder(orderData: OrderRequest): Promise<Order> {
    try {
      const response = await apiService.post<any>('/orders', orderData);
      
      // Handle backend response format: { message: "...", order: {...} }
      if (response.order) {
        return response.order;
      }
      
      // Handle standard API response format: { success: true, data: {...} }
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create order');
    } catch (error: any) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string | number, status: Order['status']): Promise<Order> {
    const response = await apiService.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update order status');
  }

  async getAllOrders(options?: { 
    page?: number; 
    limit?: number; 
    status?: Order['status'];
  }): Promise<PaginatedResponse<Order[]>> {
    const { page = 1, limit = 10, status } = options || {};
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) params.append('status', status);
    
    return apiService.get<PaginatedResponse<Order[]>>(`/admin/orders?${params.toString()}`);
  }

  async cancelOrder(id: string): Promise<Order> {
    return this.updateOrderStatus(id, 'cancelled');
  }

  async getUserOrders(page: number = 1, limit: number = 10): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    try {
      const response = await apiService.get<any>(`/orders?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('getUserOrders error:', error);
      throw error;
    }
  }

  async getUserOrderHistory(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return apiService.get<PaginatedResponse<Order[]>>(`/users/${userId}/orders?${params.toString()}`);
  }

  async getOrdersByStatus(status: Order['status'], page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order[]>> {
    return this.getAllOrders({ page, limit, status });
  }

  async getOrderStatistics(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  }> {
    const response = await apiService.get<ApiResponse<{
      totalOrders: number;
      totalRevenue: number;
      pendingOrders: number;
      completedOrders: number;
      cancelledOrders: number;
    }>>('/admin/orders/statistics');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get order statistics');
  }

  async processPayment(orderId: string, paymentData: {
    paymentMethod: string;
    paymentDetails?: any;
  }): Promise<{ success: boolean; transactionId?: string }> {
    const response = await apiService.post<ApiResponse<{ 
      success: boolean; 
      transactionId?: string; 
    }>>(`/orders/${orderId}/payment`, paymentData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Payment processing failed');
  }
}

export const orderService = new OrderService();
export default orderService;

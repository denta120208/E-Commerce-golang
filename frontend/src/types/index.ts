export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
  createdAt?: string; // For backward compatibility
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category_id: number;
  categoryId?: number; // For backward compatibility
  category?: Category;
  created_at: string;
  createdAt?: string; // For backward compatibility
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product?: Product;
  created_at: string;
  subtotal: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
  
  // Backward compatibility
  productId?: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
  
  // Backward compatibility
  userId?: number;
  totalAmount?: number;
  shippingAddress?: string;
  paymentMethod?: string;
  createdAt?: string;
  orderItems?: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  image?: string;
}

export interface CartItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  shippingAddress: string;
  paymentMethod: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

import apiService from './api';
import { 
  ApiResponse, 
  PaginatedResponse, 
  Product, 
  ProductRequest 
} from '../types';

class ProductService {
  async getProducts(options?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    categoryIds?: string;
  }): Promise<{ products: Product[]; total: number; page: number; limit: number; total_pages: number }> {
    try {
      const { page = 1, limit = 10, category, search, categoryIds } = options || {};
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (category) params.append('category_id', category);
      if (search) params.append('search', search);
      if (categoryIds) params.append('category_id', categoryIds);
      
      console.log('API call URL:', `/products?${params.toString()}`);
      const response = await apiService.get(`/products?${params.toString()}`);
      console.log('Raw API response:', response);
      
      // Handle response structure - backend returns direct object
      let products: Product[] = [];
      let total = 0;
      let totalPages = 1;
      
      if (response) {
        // Backend returns direct object with products array
        products = response.products || [];
        total = response.total || 0;
        totalPages = response.total_pages || 1;
      }
      
      return {
        products,
        total,
        page: page,
        limit: limit,
        total_pages: totalPages,
      };
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  }

  async getProduct(id: string | number): Promise<ApiResponse<Product>> {
    const response = await apiService.get<ApiResponse<Product>>(`/products/${id}`);
    return response;
  }

  async createProduct(productData: ProductRequest): Promise<Product> {
    const response = await apiService.post<ApiResponse<Product>>('/products', productData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create product');
  }

  async updateProduct(id: string | number, productData: Partial<ProductRequest>): Promise<Product> {
    const response = await apiService.put<ApiResponse<Product>>(`/products/${id}`, productData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update product');
  }

  async deleteProduct(id: string | number): Promise<void> {
    const response = await apiService.delete<ApiResponse<null>>(`/products/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete product');
    }
  }

  async uploadProductImage(productId: string, imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiService.post<ApiResponse<{ imageUrl: string }>>(
      `/products/${productId}/image`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    if (response.success && response.data) {
      return response.data.imageUrl;
    }
    
    throw new Error(response.message || 'Failed to upload image');
  }

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const response = await apiService.get<ApiResponse<Product[]>>(`/products/featured?limit=${limit}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get featured products');
  }

  async getProductsByCategory(categoryId: string, page: number = 1, limit: number = 10): Promise<{ products: Product[]; total: number; page: number; limit: number; total_pages: number }> {
    return this.getProducts({ page, limit, category: categoryId });
  }
}

export const productService = new ProductService();
export default productService;

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
    const { page = 1, limit = 10, category, search, categoryIds } = options || {};
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (categoryIds) params.append('categoryIds', categoryIds);
    const response: import('axios').AxiosResponse<any> = await apiService.get(`/products?${params.toString()}`);
    return {
      products: response.data?.products || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      limit: response.data?.limit || 10,
      total_pages: response.data?.total_pages || 1,
    };
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

import apiService from './api';
import { 
  ApiResponse, 
  Category, 
  CategoryRequest 
} from '../types';

class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiService.get('/categories');
      console.log('Categories API response:', response);
      
      // Backend returns { categories: [...] }
      return response.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategory(id: string): Promise<Category> {
    const response = await apiService.get<ApiResponse<Category>>(`/categories/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get category');
  }

  async createCategory(categoryData: CategoryRequest): Promise<Category> {
    const response = await apiService.post<ApiResponse<Category>>('/categories', categoryData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create category');
  }

  async updateCategory(id: string, categoryData: Partial<CategoryRequest>): Promise<Category> {
    const response = await apiService.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update category');
  }

  async deleteCategory(id: string): Promise<void> {
    const response = await apiService.delete<ApiResponse<null>>(`/categories/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete category');
    }
  }

  async uploadCategoryImage(categoryId: string, imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiService.post<ApiResponse<{ imageUrl: string }>>(
      `/categories/${categoryId}/image`, 
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
}

export const categoryService = new CategoryService();
export default categoryService;

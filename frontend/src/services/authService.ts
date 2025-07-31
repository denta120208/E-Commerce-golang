import apiService from './api';
import { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  UpdateProfileRequest, 
  User 
} from '../types';

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const loginData: LoginRequest = { email, password };
      const response = await apiService.post('/auth/login', loginData);
      console.log('Login response:', response);
      
      if (response && response.user && response.token) {
        const { user, token } = response;
        apiService.setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        return { user, token };
      }
      throw new Error(response?.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post('/auth/register', userData);
      console.log('Register response:', response);
      
      if (response && response.user && response.token) {
        const { user, token } = response;
        // Don't auto-login after registration, let user login manually
        return { user, token };
      }
      throw new Error(response?.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      apiService.removeAuthToken();
      localStorage.removeItem('user');
    }
  }

  async getProfile(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/auth/profile');
    
    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get profile');
  }

  async updateProfile(userData: UpdateProfileRequest): Promise<User> {
    const response = await apiService.put<ApiResponse<User>>('/auth/profile', userData);
    
    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!apiService.getAuthToken() && !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export const authService = new AuthService();
export default authService; 

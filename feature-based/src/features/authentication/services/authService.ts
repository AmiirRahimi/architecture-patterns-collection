// Feature-specific service for authentication
import { User, LoginCredentials, SignupCredentials } from '../types/auth.types';

class AuthService {
  private currentUser: User | null = null;

  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      const user: User = {
        id: '1',
        email: credentials.email,
        name: 'Test User',
        isAuthenticated: true,
      };
      
      this.currentUser = user;
      localStorage.setItem('auth_token', 'fake_token');
      return user;
    }
    
    throw new Error('Invalid credentials');
  }

  async signup(credentials: SignupCredentials): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.name,
      isAuthenticated: true,
    };
    
    this.currentUser = user;
    localStorage.setItem('auth_token', 'fake_token');
    return user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }
    
    // Simulate API call to get current user
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.currentUser || {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      isAuthenticated: true,
    };
  }
}

export const authService = new AuthService();

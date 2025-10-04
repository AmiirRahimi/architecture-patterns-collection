// Module-specific service
import { User, CreateUserData, UpdateUserData } from '../types/user.types';

class UserService {
  private users: User[] = [];

  async getAllUsers(): Promise<User[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.users];
  }

  async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(data: CreateUserData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.push(user);
    
    // Emit event for other modules
    this.emitUserCreated(user);
    
    return user;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    
    const updatedUser = {
      ...this.users[userIndex],
      ...data,
      updatedAt: new Date(),
    };
    
    this.users[userIndex] = updatedUser;
    this.emitUserUpdated(updatedUser);
    
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    
    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    this.emitUserDeleted(deletedUser);
    
    return true;
  }

  private emitUserCreated(user: User): void {
    // Event-driven communication with other modules
    const event = new CustomEvent('user:created', { detail: user });
    window.dispatchEvent(event);
  }

  private emitUserUpdated(user: User): void {
    const event = new CustomEvent('user:updated', { detail: user });
    window.dispatchEvent(event);
  }

  private emitUserDeleted(user: User): void {
    const event = new CustomEvent('user:deleted', { detail: user });
    window.dispatchEvent(event);
  }
}

export const userService = new UserService();

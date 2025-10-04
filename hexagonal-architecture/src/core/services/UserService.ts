// Core business logic service
import { IUserRepository, User } from '../ports/repositories/IUserRepository';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(email: string, name: string): Promise<User> {
    // Business logic validation
    if (!email || !name) {
      throw new Error('Email and name are required');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user: User = {
      id: this.generateId(),
      email,
      name,
      createdAt: new Date(),
    };

    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = { ...user, ...updates };
    await this.userRepository.save(updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

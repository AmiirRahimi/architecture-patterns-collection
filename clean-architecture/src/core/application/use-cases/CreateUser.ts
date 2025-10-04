// Use Case - Application layer
import { UserEntity } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export interface CreateUserRequest {
  email: string;
  name: string;
}

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: CreateUserRequest): Promise<UserEntity> {
    // Business logic validation
    if (!request.email || !request.name) {
      throw new Error('Email and name are required');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user entity
    const user = new UserEntity(
      this.generateId(),
      request.email,
      request.name,
      new Date(),
      new Date()
    );

    // Save user
    await this.userRepository.save(user);

    return user;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

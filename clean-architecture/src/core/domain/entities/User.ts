// Domain Entity - Pure business logic
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Business logic methods
  updateEmail(newEmail: string): UserEntity {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }
    
    return new UserEntity(
      this.id,
      newEmail,
      this.name,
      this.createdAt,
      new Date()
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

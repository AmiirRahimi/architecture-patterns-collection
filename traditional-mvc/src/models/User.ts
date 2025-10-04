// Model - Data and business logic
export interface UserData {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private data: UserData;

  constructor(data: UserData) {
    this.data = data;
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get email(): string {
    return this.data.email;
  }

  get name(): string {
    return this.data.name;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }

  get updatedAt(): Date {
    return this.data.updatedAt;
  }

  // Business logic methods
  updateEmail(newEmail: string): void {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }

    if (this.data.email === newEmail) {
      throw new Error('Email is the same as current email');
    }

    this.data.email = newEmail;
    this.data.updatedAt = new Date();
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    this.data.name = newName.trim();
    this.data.updatedAt = new Date();
  }

  isActive(): boolean {
    return true; // Business logic for user status
  }

  getDisplayName(): string {
    return this.data.name || this.data.email;
  }

  // Validation methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Serialization
  toJSON(): UserData {
    return { ...this.data };
  }

  static fromJSON(data: UserData): User {
    return new User(data);
  }

  static create(email: string, name: string): User {
    const now = new Date();
    const userData: UserData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: now,
      updatedAt: now,
    };

    return new User(userData);
  }
}

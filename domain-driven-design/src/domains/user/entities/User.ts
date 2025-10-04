// Domain Entity with business logic
export class User {
  constructor(
    private readonly _id: UserId,
    private _email: Email,
    private _profile: UserProfile,
    private _status: UserStatus = UserStatus.ACTIVE
  ) {}

  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get profile(): UserProfile {
    return this._profile;
  }

  get status(): UserStatus {
    return this._status;
  }

  // Business logic methods
  changeEmail(newEmail: Email): void {
    if (this._email.equals(newEmail)) {
      throw new Error('New email must be different from current email');
    }
    
    this._email = newEmail;
    // Raise domain event
    DomainEvents.raise(new UserEmailChanged(this._id, newEmail));
  }

  updateProfile(profile: UserProfile): void {
    this._profile = profile;
    DomainEvents.raise(new UserProfileUpdated(this._id, profile));
  }

  deactivate(): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new Error('User is already inactive');
    }
    
    this._status = UserStatus.INACTIVE;
    DomainEvents.raise(new UserDeactivated(this._id));
  }

  activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      throw new Error('User is already active');
    }
    
    this._status = UserStatus.ACTIVE;
    DomainEvents.raise(new UserActivated(this._id));
  }

  canAccessFeature(feature: string): boolean {
    // Business rule: only active users can access features
    return this._status === UserStatus.ACTIVE;
  }
}

// Value Objects
export class UserId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class UserProfile {
  constructor(
    private readonly firstName: string,
    private readonly lastName: string,
    private readonly dateOfBirth?: Date
  ) {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get age(): number | null {
    if (!this.dateOfBirth) {
      return null;
    }
    
    const today = new Date();
    const age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
      return age - 1;
    }
    
    return age;
  }

  isAdult(): boolean {
    const userAge = this.age;
    return userAge !== null && userAge >= 18;
  }
}

// Enums
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Domain Events
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  
  constructor() {
    this.occurredOn = new Date();
  }
}

export class UserEmailChanged extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly newEmail: Email
  ) {
    super();
  }
}

export class UserProfileUpdated extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly profile: UserProfile
  ) {
    super();
  }
}

export class UserDeactivated extends DomainEvent {
  constructor(public readonly userId: UserId) {
    super();
  }
}

export class UserActivated extends DomainEvent {
  constructor(public readonly userId: UserId) {
    super();
  }
}

// Domain Events Manager
export class DomainEvents {
  private static handlers: Map<string, Array<(event: DomainEvent) => void>> = new Map();

  static subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => void
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler as any);
  }

  static raise(event: DomainEvent): void {
    const eventType = event.constructor.name;
    const handlers = this.handlers.get(eventType) || [];
    
    handlers.forEach(handler => handler(event));
  }
}

# Domain-Driven Design (DDD)

## Overview
Domain-Driven Design focuses on modeling complex business domains and organizing code around business concepts rather than technical concerns. DDD emphasizes the use of ubiquitous language and rich domain models to reflect business logic accurately.

## Architecture Principles
- **Domain-Centric**: Business domain is the primary organizing principle
- **Ubiquitous Language**: Code reflects business terminology
- **Bounded Contexts**: Clear boundaries between different business domains
- **Rich Domain Models**: Business logic lives in domain entities

## Project Structure
```
src/
├── domains/                   # Business domains (Bounded Contexts)
│   ├── user/                 # User management domain
│   │   ├── entities/         # Domain entities
│   │   │   ├── User.ts
│   │   │   ├── UserProfile.ts
│   │   │   └── UserPreferences.ts
│   │   ├── repositories/     # Repository interfaces
│   │   │   ├── IUserRepository.ts
│   │   │   └── IUserProfileRepository.ts
│   │   ├── services/         # Domain services
│   │   │   ├── UserDomainService.ts
│   │   │   └── UserValidationService.ts
│   │   ├── components/       # Domain-specific components
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserSettings.tsx
│   │   │   └── UserList.tsx
│   │   ├── use-cases/        # Application use cases
│   │   │   ├── CreateUser.ts
│   │   │   ├── UpdateUser.ts
│   │   │   └── DeleteUser.ts
│   │   ├── events/           # Domain events
│   │   │   ├── UserCreated.ts
│   │   │   └── UserUpdated.ts
│   │   └── index.ts          # Domain public API
│   ├── product/              # Product catalog domain
│   │   ├── entities/
│   │   │   ├── Product.ts
│   │   │   ├── Category.ts
│   │   │   └── Inventory.ts
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── components/
│   │   ├── use-cases/
│   │   ├── events/
│   │   └── index.ts
│   └── order/                # Order management domain
│       ├── entities/
│       │   ├── Order.ts
│       │   ├── OrderItem.ts
│       │   └── Payment.ts
│       ├── repositories/
│       ├── services/
│       ├── components/
│       ├── use-cases/
│       ├── events/
│       └── index.ts
├── shared/                   # Shared across domains
│   ├── infrastructure/       # Technical infrastructure
│   │   ├── database/         # Database implementations
│   │   ├── api/              # API clients
│   │   ├── events/           # Event bus
│   │   └── logging/          # Logging utilities
│   ├── types/                # Shared types
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── events.types.ts
│   ├── utils/                # Shared utilities
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   └── constants/            # Shared constants
│       ├── domains.ts
│       └── events.ts
├── app/                      # Next.js 13+ app directory
└── lib/                      # Core library code
    ├── domain/               # Domain base classes
    ├── infrastructure/       # Infrastructure base classes
    └── application/          # Application base classes
```

## Domain Design Patterns

### 1. Entities
Domain entities with business logic:
```typescript
// domains/user/entities/User.ts
export class User {
  constructor(
    private readonly id: UserId,
    private email: Email,
    private profile: UserProfile
  ) {}

  changeEmail(newEmail: Email): void {
    if (this.email.equals(newEmail)) {
      throw new Error('Email is the same')
    }
    this.email = newEmail
    // Raise domain event
    DomainEvents.raise(new UserEmailChanged(this.id, newEmail))
  }

  updateProfile(profile: UserProfile): void {
    this.profile = profile
    DomainEvents.raise(new UserProfileUpdated(this.id, profile))
  }
}
```

### 2. Value Objects
Immutable objects that represent concepts:
```typescript
// domains/user/entities/Email.ts
export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format')
    }
  }

  private isValid(email: string): boolean {
    // Email validation logic
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
```

### 3. Domain Services
Services that contain domain logic that doesn't belong to entities:
```typescript
// domains/user/services/UserDomainService.ts
export class UserDomainService {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async isEmailUnique(email: Email): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email)
    return existingUser === null
  }

  async validateUserCreation(userData: CreateUserData): Promise<void> {
    if (!(await this.isEmailUnique(userData.email))) {
      throw new Error('Email already exists')
    }
    // Additional validation logic
  }
}
```

### 4. Repository Pattern
Abstract data access:
```typescript
// domains/user/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: UserId): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
  save(user: User): Promise<void>
  delete(id: UserId): Promise<void>
}
```

### 5. Domain Events
Events that represent business occurrences:
```typescript
// domains/user/events/UserCreated.ts
export class UserCreated implements DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly occurredOn: Date = new Date()
  ) {}
}
```

## Bounded Contexts
Each domain represents a bounded context with:
- **Clear Boundaries**: Well-defined scope and responsibilities
- **Ubiquitous Language**: Consistent terminology within the context
- **Independent Models**: Each context has its own domain model
- **Context Mapping**: Defined relationships between contexts

## Benefits
- **Business Alignment**: Code structure reflects business structure
- **Domain Expertise**: Encourages domain knowledge in code
- **Maintainability**: Clear boundaries prevent architectural decay
- **Scalability**: Domains can be extracted to separate services
- **Team Autonomy**: Teams can own complete domains

## Best Practices
1. **Domain First**: Start with domain modeling, not technical concerns
2. **Ubiquitous Language**: Use business terminology consistently
3. **Rich Domain Models**: Put business logic in entities and value objects
4. **Event-Driven**: Use domain events for loose coupling
5. **Repository Pattern**: Abstract data access with repositories


## Use Cases
- **Complex Business Logic**: Applications with rich domain models
- **Large Teams**: Multiple teams working on different domains
- **Long-term Projects**: Applications that will evolve over time
- **Domain Expertise**: Teams with deep business knowledge

## Trade-offs
- **Pros**: Business-aligned, maintainable, scalable
- **Cons**: Complex setup, requires domain expertise, can be overkill for simple apps

## Domain Modeling Guidelines

### Entities
- Have identity (ID)
- Can change over time
- Contain business logic
- Are mutable

### Value Objects
- Have no identity
- Are immutable
- Represent concepts
- Are compared by value

### Domain Services
- Contain domain logic that doesn't belong to entities
- Are stateless
- Coordinate between entities
- Are part of the domain layer

### Repositories
- Abstract data access
- Are defined in the domain layer
- Are implemented in the infrastructure layer
- Return domain entities
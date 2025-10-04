# Colocated Structure

## Overview
The Colocated Structure organizes code by technical concerns rather than business features, grouping similar types of files together for easy discovery and maintenance. This approach provides a predictable and straightforward way to organize code.

## Architecture Principles
- **Technical Grouping**: Files are organized by their technical purpose
- **Easy Discovery**: Similar files are grouped together
- **Simple Navigation**: Clear, predictable folder structure
- **Shared Resources**: Common utilities and components are easily accessible

## Project Structure
```
src/
├── components/             # React components organized by type
│   ├── ui/                # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── index.ts       # Barrel exports
│   ├── forms/             # Form-related components
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ContactForm.tsx
│   │   └── index.ts
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   └── index.ts
│   └── common/            # Common/shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── index.ts
├── lib/                   # Core library code
│   ├── api/              # API configuration and clients
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── types.ts
│   ├── auth/             # Authentication utilities
│   │   ├── config.ts
│   │   ├── providers.ts
│   │   └── utils.ts
│   ├── database/         # Database configuration
│   │   ├── connection.ts
│   │   ├── models.ts
│   │   └── migrations.ts
│   ├── utils/            # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   └── config/           # Configuration files
│       ├── env.ts
│       ├── database.ts
│       └── auth.ts
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   ├── useApi.ts
│   ├── useDebounce.ts
│   └── index.ts
├── types/                # TypeScript type definitions
│   ├── api.types.ts
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── common.types.ts
│   └── index.ts
├── styles/               # Styling files
│   ├── globals.css
│   ├── components.css
│   ├── utilities.css
│   └── themes/
│       ├── light.css
│       └── dark.css
├── app/                  # Next.js 13+ app directory
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
└── public/               # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

## Organization Principles

### 1. Technical Grouping
- **Components**: Organized by UI purpose (ui, forms, layout)
- **Hooks**: All custom hooks in one place
- **Types**: All TypeScript definitions together
- **Utils**: All utility functions grouped
- **Styles**: All styling files together

### 2. Barrel Exports
Each folder uses `index.ts` files for clean imports:
```typescript
// components/ui/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Modal } from './Modal'

// Usage
import { Button, Input, Modal } from '@/components/ui'
```

### 3. Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useAuth.ts`)
- **Types**: camelCase with '.types.ts' suffix (e.g., `user.types.ts`)
- **Utils**: camelCase (e.g., `formatters.ts`)

## Benefits
- **Easy Discovery**: Know exactly where to find specific types of files
- **Simple Navigation**: Predictable folder structure
- **Code Reusability**: Shared components and utilities are easily accessible
- **Team Onboarding**: New developers can quickly understand the structure
- **Tool Support**: Works well with IDE features and code generators

## Import Patterns
```typescript
// Component imports
import { Button } from '@/components/ui'
import { LoginForm } from '@/components/forms'
import { Header } from '@/components/layout'

// Hook imports
import { useAuth, useLocalStorage } from '@/hooks'

// Type imports
import type { User, ApiResponse } from '@/types'

// Utility imports
import { formatDate, validateEmail } from '@/lib/utils'
```

## Best Practices
1. **Consistent Naming**: Use consistent naming conventions across all files
2. **Barrel Exports**: Use index.ts files for clean imports
3. **Type Organization**: Group related types in the same file
4. **Component Categories**: Use clear categories for component organization
5. **Utility Grouping**: Group related utility functions together


## Use Cases
- **Small to Medium Applications**: Simple, straightforward projects
- **Rapid Prototyping**: Quick development and iteration
- **Team Consistency**: Teams that prefer predictable structure
- **Tool Integration**: Applications using code generators and tools

## Trade-offs
- **Pros**: Simple, predictable, easy to navigate
- **Cons**: Can become cluttered as the application grows, less feature-focused

## File Organization Guidelines

### Components
- **ui/**: Basic, reusable UI components
- **forms/**: Form-specific components
- **layout/**: Layout and navigation components
- **common/**: Shared/common components

### Lib
- **api/**: API-related configuration and clients
- **auth/**: Authentication utilities
- **database/**: Database configuration and models
- **utils/**: General utility functions
- **config/**: Application configuration

### Hooks
- Group related hooks in the same file when appropriate
- Use descriptive names starting with 'use'
- Export hooks individually for better tree-shaking

### Types
- Group related types in the same file
- Use descriptive file names with '.types.ts' suffix
- Export types individually for better tree-shaking
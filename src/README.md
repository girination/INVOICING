# Authentication Architecture

This document outlines the authentication architecture implemented in the Simple Invoicing application, following best practices with proper separation of concerns.

## Architecture Overview

The authentication system follows a layered architecture pattern:

```
Pages/Components → Controllers → Services → Supabase Client
```

## Directory Structure

```
src/
├── constants/
│   └── auth.constants.ts          # Authentication constants and configuration
├── controllers/
│   └── auth.controller.ts         # Authentication business logic and validation
├── services/
│   ├── auth.service.ts            # Supabase authentication service layer
│   ├── validation.service.ts      # Form validation service
│   └── error.service.ts           # Error handling and logging service
├── contexts/
│   └── AuthContext.tsx            # React context for auth state management
└── lib/
    └── supabase.ts                # Supabase client configuration
```

## Layer Responsibilities

### 1. Constants Layer (`constants/`)

- **Purpose**: Centralized configuration and constants
- **Files**: `auth.constants.ts`
- **Responsibilities**:
  - Password requirements
  - Email validation regex
  - Error codes and messages
  - Route definitions
  - Validation rules

### 2. Services Layer (`services/`)

- **Purpose**: Direct interaction with external services and utilities
- **Files**:
  - `auth.service.ts` - Supabase authentication operations
  - `validation.service.ts` - Form validation logic
  - `error.service.ts` - Error handling and logging
- **Responsibilities**:
  - API calls to Supabase
  - Data validation
  - Error processing and logging
  - Business rule enforcement

### 3. Controllers Layer (`controllers/`)

- **Purpose**: Business logic and request/response handling
- **Files**: `auth.controller.ts`
- **Responsibilities**:
  - Input validation
  - Service orchestration
  - Response formatting
  - Error handling
  - Business logic coordination

### 4. Context Layer (`contexts/`)

- **Purpose**: React state management and component integration
- **Files**: `AuthContext.tsx`
- **Responsibilities**:
  - Global auth state management
  - Component state synchronization
  - Auth state persistence
  - Real-time auth updates

### 5. Pages/Components Layer

- **Purpose**: User interface and user interactions
- **Files**: `SignIn.tsx`, `SignUp.tsx`, `AppSidebar.tsx`
- **Responsibilities**:
  - User interface rendering
  - Form handling
  - User interaction management
  - Navigation control

## Data Flow

### Sign Up Flow

1. **User** fills signup form
2. **SignUp Page** validates form using `ValidationService`
3. **SignUp Page** calls `AuthContext.signUp()`
4. **AuthContext** calls `AuthController.signUp()`
5. **AuthController** validates data and calls `AuthService.signUp()`
6. **AuthService** makes API call to Supabase
7. **Response** flows back through layers with proper error handling

### Sign In Flow

1. **User** fills signin form
2. **SignIn Page** validates form using `ValidationService`
3. **SignIn Page** calls `AuthContext.signIn()`
4. **AuthContext** calls `AuthController.signIn()`
5. **AuthController** validates data and calls `AuthService.signIn()`
6. **AuthService** makes API call to Supabase
7. **Response** flows back through layers with proper error handling

### Sign Out Flow

1. **User** clicks logout button
2. **AppSidebar** calls `AuthContext.signOut()`
3. **AuthContext** calls `AuthController.signOut()`
4. **AuthController** calls `AuthService.signOut()`
5. **AuthService** makes API call to Supabase
6. **Response** flows back through layers with proper error handling

## Key Features

### 1. Type Safety

- Full TypeScript implementation
- Strongly typed interfaces and responses
- Type-safe error handling

### 2. Error Handling

- Centralized error processing
- User-friendly error messages
- Comprehensive error logging
- Context-aware error responses

### 3. Validation

- Client-side form validation
- Server-side validation through controllers
- Real-time validation feedback
- Password strength requirements

### 4. Security

- Secure password requirements
- Email validation
- Input sanitization
- Proper error message handling (no sensitive data exposure)

### 5. Maintainability

- Clear separation of concerns
- Reusable services and utilities
- Centralized configuration
- Comprehensive error handling

## Usage Examples

### Using Auth Context in Components

```typescript
import { useAuth } from "@/contexts/AuthContext";

const MyComponent = () => {
  const { user, signIn, signOut, loading } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    const response = await signIn(email, password);
    if (response.success) {
      // Handle success
    } else {
      // Handle error
    }
  };
};
```

### Using Validation Service

```typescript
import { ValidationService } from "@/services/validation.service";

const isValid = ValidationService.validateEmail("user@example.com");
const passwordReqs = ValidationService.getPasswordRequirements("password123");
```

### Using Error Service

```typescript
import { ErrorService } from "@/services/error.service";

try {
  // Some operation
} catch (error) {
  ErrorService.logError(error, "component-name");
  const message = ErrorService.getContextualErrorMessage(error, "signin");
}
```

## Benefits

1. **Scalability**: Easy to add new authentication features
2. **Maintainability**: Clear separation makes code easy to understand and modify
3. **Testability**: Each layer can be tested independently
4. **Reusability**: Services and utilities can be reused across components
5. **Type Safety**: TypeScript ensures compile-time error checking
6. **Error Handling**: Comprehensive error handling throughout the application
7. **Security**: Proper validation and secure error handling

## Future Enhancements

- Add unit tests for each layer
- Implement refresh token handling
- Add social authentication providers
- Implement password reset functionality
- Add two-factor authentication
- Implement role-based access control

# Testing Guide

This document provides comprehensive information about testing in the OnlineStoreApp React Native application.

## Overview

The app uses a comprehensive testing strategy with:
- **Unit Tests**: Individual functions and hooks
- **Component Tests**: React components and screens
- **Integration Tests**: Redux store and API interactions
- **Mock Service Worker (MSW)**: API mocking for consistent testing

## Test Structure

```
src/__tests__/
├── components/           # Component tests
│   ├── LoginScreen.test.tsx
│   ├── ProductsScreen.test.tsx
│   └── CategorySelectionScreen.test.tsx
├── hooks/               # Hook tests
│   ├── useAuth.test.ts
│   └── useProducts.test.ts
├── store/               # Redux store tests
│   ├── authSlice.test.ts
│   ├── productsSlice.test.ts
│   └── store.test.ts
├── mocks/               # Mock configurations
│   ├── handlers.ts
│   └── server.ts
└── utils/               # Test utilities
    └── test-utils.tsx
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci

# Debug tests
npm run test:debug

# Update snapshots
npm run test:update
```

### Test Coverage

The project is configured to generate coverage reports in multiple formats:
- **Text**: Console output
- **LCOV**: For CI integration
- **HTML**: Detailed browser report in `coverage/` directory

## Test Categories

### 1. Unit Tests

Test individual functions, hooks, and utilities in isolation.

**Example: Testing a custom hook**
```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { useLogin } from '../../hooks/useAuth';

describe('useLogin', () => {
  it('should login successfully with valid credentials', async () => {
    const { result } = renderHook(() => useLogin());
    
    result.current.mutate({ username: 'testuser', password: 'password' });
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

### 2. Component Tests

Test React components with user interactions and rendering.

**Example: Testing a screen component**
```typescript
import { renderWithProviders } from '../utils/test-utils';
import LoginScreen from '../../screens/LoginScreen';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);
    
    expect(getByText('Login')).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
  });
});
```

### 3. Integration Tests

Test Redux store actions and reducers.

**Example: Testing Redux slice**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setCredentials } from '../../features/auth/authSlice';

describe('authSlice', () => {
  it('should set user and token', () => {
    const store = configureStore({ reducer: { auth: authReducer } });
    
    store.dispatch(setCredentials({ user: mockUser, token: 'token' }));
    
    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
  });
});
```

## Mocking Strategy

### API Mocking with MSW

The project uses Mock Service Worker (MSW) to mock API calls:

```typescript
// src/__tests__/mocks/handlers.ts
export const handlers = [
  http.post('https://dummyjson.com/auth/login', () => {
    return HttpResponse.json(mockLoginResponse);
  }),
  http.get('https://dummyjson.com/products', () => {
    return HttpResponse.json(mockProductsResponse);
  }),
];
```

### Component Mocking

Common mocks are set up in `jest.setup.js`:
- React Native components
- Navigation
- Redux store
- React Query
- Third-party libraries

## Test Utilities

### Custom Render Function

The `renderWithProviders` utility wraps components with all necessary providers:

```typescript
import { renderWithProviders } from '../utils/test-utils';

const { getByText } = renderWithProviders(<MyComponent />, {
  preloadedState: { auth: { user: mockUser } },
  queryClient: customQueryClient,
});
```

### Mock Data

Predefined mock data is available in `test-utils.tsx`:
- `mockUser`: User object
- `mockProduct`: Product object
- `mockProducts`: Array of products
- `mockCategories`: Array of categories

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### 2. Mocking
- Mock external dependencies
- Use MSW for API mocking
- Keep mocks simple and focused

### 3. Assertions
- Test behavior, not implementation
- Use appropriate matchers
- Test error cases

### 4. Async Testing
- Use `waitFor` for async operations
- Test loading states
- Test error states

## CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that:
- Runs tests on multiple Node.js versions
- Generates coverage reports
- Builds Android and iOS apps
- Uploads coverage to Codecov

### Coverage Requirements

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Debugging Tests

### Common Issues

1. **Async operations not completing**
   - Use `waitFor` instead of `setTimeout`
   - Check if promises are properly awaited

2. **Mock not working**
   - Verify mock is set up before the test
   - Check mock implementation

3. **Component not rendering**
   - Ensure all required providers are included
   - Check for missing dependencies

### Debug Commands

```bash
# Run specific test file
npm test -- LoginScreen.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="login"

# Debug with verbose output
npm run test:debug
```

## Performance Testing

### Memory Leaks
- Use `--detectOpenHandles` flag
- Check for unclosed timers and subscriptions

### Test Speed
- Use `--maxWorkers` to parallelize tests
- Mock heavy operations
- Use `--runInBand` for debugging

## Continuous Integration

The CI pipeline runs:
1. **Linting**: ESLint checks
2. **Unit Tests**: All test suites
3. **Coverage**: Coverage report generation
4. **Build Tests**: Android and iOS builds

## Contributing

When adding new tests:
1. Follow existing patterns
2. Add appropriate mocks
3. Test both success and error cases
4. Update documentation if needed
5. Ensure CI passes

## Resources

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MSW Documentation](https://mswjs.io/)
- [Redux Testing](https://redux.js.org/usage/writing-tests)

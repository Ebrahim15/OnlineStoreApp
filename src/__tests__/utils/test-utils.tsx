import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from '../../store/store';
import { createCustomTheme } from '../../utils/theme';

// Create a test store
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: store.getState,
    preloadedState,
  });
};

// Create a test query client
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  queryClient?: QueryClient;
  theme?: any;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    queryClient = createTestQueryClient(),
    theme = createCustomTheme(false),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const testStore = createTestStore(preloadedState);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={testStore}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              {children}
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );

  return {
    store: testStore,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Mock data
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'admin',
};

export const mockProduct = {
  id: 1,
  title: 'Test Product',
  description: 'A test product',
  price: 29.99,
  category: 'electronics',
  thumbnail: 'https://example.com/image.jpg',
  images: ['https://example.com/image.jpg'],
  brand: 'Test Brand',
  rating: 4.5,
  stock: 100,
};

export const mockProducts = [
  mockProduct,
  {
    id: 2,
    title: 'Another Product',
    description: 'Another test product',
    price: 19.99,
    category: 'clothing',
    thumbnail: 'https://example.com/image2.jpg',
    images: ['https://example.com/image2.jpg'],
    brand: 'Test Brand 2',
    rating: 4.0,
    stock: 50,
  },
];

export const mockCategories = [
  'electronics',
  'clothing',
  'books',
  'home',
  'sports',
];

// Mock API responses
export const mockApiResponses = {
  login: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    gender: 'male',
    image: 'https://example.com/avatar.jpg',
    token: 'mock-jwt-token',
  },
  user: mockUser,
  products: {
    products: mockProducts,
    total: 2,
    skip: 0,
    limit: 20,
  },
  categories: mockCategories,
};

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock navigation
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

// Mock route
export const mockRoute = {
  key: 'test-route',
  name: 'TestScreen',
  params: {},
};

// Re-export everything from testing library
export * from '@testing-library/react-native';

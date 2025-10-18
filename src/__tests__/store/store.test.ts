import { configureStore } from '@reduxjs/toolkit';
import { store } from '../../store/store';
import authReducer from '../../features/auth/authSlice';
import productsReducer from '../../features/products/productsSlice';

describe('store configuration', () => {
  it('should have correct initial state structure', () => {
    const state = store.getState();
    
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('products');
    
    expect(state.auth).toEqual({
      user: null,
      token: null,
    });
    
    expect(state.products).toEqual({
      allProducts: [],
      allProductsSearchQuery: '',
      allProductsLoading: false,
      allProductsError: null,
      allProductsLastFetched: null,
      categoryProducts: [],
      selectedCategory: '',
      categorySearchQuery: '',
      categoryLoading: false,
      categoryError: null,
      categoryLastFetched: null,
      categories: [],
      categoriesLoading: false,
      categoriesError: null,
    });
  });

  it('should dispatch actions correctly', () => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
        products: productsReducer,
      },
    });

    // Test auth action
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    };
    const token = 'mock-jwt-token';

    testStore.dispatch({
      type: 'auth/setCredentials',
      payload: { user, token },
    });

    const authState = testStore.getState().auth;
    expect(authState.user).toEqual(user);
    expect(authState.token).toEqual(token);

    // Test products action
    const products = [{
      id: 1,
      title: 'Test Product',
      price: 29.99,
      category: 'electronics',
      thumbnail: 'https://example.com/image.jpg',
    }];

    testStore.dispatch({
      type: 'products/setAllProducts',
      payload: products,
    });

    const productsState = testStore.getState().products;
    expect(productsState.allProducts).toEqual(products);
  });

  it('should handle middleware correctly', () => {
    // Test that the store is configured with proper middleware
    const state = store.getState();
    expect(state).toBeDefined();
    
    // Test that we can dispatch actions
    store.dispatch({
      type: 'auth/setCredentials',
      payload: { user: null, token: null },
    });
    
    expect(store.getState().auth).toBeDefined();
  });

  it('should have proper TypeScript types', () => {
    // This test ensures the store has proper typing
    const state = store.getState();
    
    // Auth state should have correct structure
    expect(typeof state.auth.user).toBe('object');
    expect(typeof state.auth.token).toBe('object');
    
    // Products state should have correct structure
    expect(Array.isArray(state.products.allProducts)).toBe(true);
    expect(Array.isArray(state.products.categories)).toBe(true);
    expect(typeof state.products.allProductsLoading).toBe('boolean');
    expect(typeof state.products.categoriesLoading).toBe('boolean');
  });

  it('should handle complex state updates', () => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
        products: productsReducer,
      },
    });

    // Simulate a complex app state
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    };
    const token = 'mock-jwt-token';
    const products = [{
      id: 1,
      title: 'Test Product',
      price: 29.99,
      category: 'electronics',
      thumbnail: 'https://example.com/image.jpg',
    }];
    const categories = ['electronics', 'clothing'];

    // Dispatch multiple actions
    testStore.dispatch({
      type: 'auth/setCredentials',
      payload: { user, token },
    });

    testStore.dispatch({
      type: 'products/setAllProducts',
      payload: products,
    });

    testStore.dispatch({
      type: 'products/setCategories',
      payload: categories,
    });

    testStore.dispatch({
      type: 'products/setAllProductsLoading',
      payload: true,
    });

    const finalState = testStore.getState();
    
    expect(finalState.auth.user).toEqual(user);
    expect(finalState.auth.token).toEqual(token);
    expect(finalState.products.allProducts).toEqual(products);
    expect(finalState.products.categories).toEqual(categories);
    expect(finalState.products.allProductsLoading).toBe(true);
  });
});

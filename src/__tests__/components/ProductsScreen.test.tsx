import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { server } from '../mocks/server';
import { renderWithProviders, mockProducts } from '../utils/test-utils';
import ProductsScreen from '../../screens/ProductsScreen';

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock Redux store with products
const mockStore = {
  auth: {
    user: { role: 'admin' },
    token: 'mock-token',
  },
  products: {
    allProducts: mockProducts,
    allProductsSearchQuery: '',
    allProductsLoading: false,
    allProductsError: null,
  },
};

describe('ProductsScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: mockStore }
    );

    await waitFor(() => {
      expect(getByText('All Products')).toBeTruthy();
      expect(getByPlaceholderText('Search products...')).toBeTruthy();
      expect(getByText('Categories')).toBeTruthy();
    });
  });

  it('displays products list', async () => {
    const { getByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: mockStore }
    );

    await waitFor(() => {
      expect(getByText('iPhone 15 Pro')).toBeTruthy();
      expect(getByText('$999')).toBeTruthy();
      expect(getByText('electronics')).toBeTruthy();
    });
  });

  it('handles search input', async () => {
    const { getByPlaceholderText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: mockStore }
    );

    const searchInput = getByPlaceholderText('Search products...');
    fireEvent.changeText(searchInput, 'iPhone');

    await waitFor(() => {
      expect(searchInput.props.value).toBe('iPhone');
    });
  });

  it('filters products based on search query', async () => {
    const { getByPlaceholderText, queryByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: mockStore }
    );

    const searchInput = getByPlaceholderText('Search products...');
    fireEvent.changeText(searchInput, 'iPhone');

    await waitFor(() => {
      expect(getByText('iPhone 15 Pro')).toBeTruthy();
      expect(queryByText('Samsung Galaxy S24')).toBeNull();
    });
  });

  it('shows delete button for admin users', async () => {
    const { getByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: mockStore }
    );

    await waitFor(() => {
      expect(getByText('Delete')).toBeTruthy();
    });
  });

  it('does not show delete button for non-admin users', async () => {
    const nonAdminStore = {
      ...mockStore,
      auth: {
        user: { role: 'user' },
        token: 'mock-token',
      },
    };

    const { queryByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: nonAdminStore }
    );

    await waitFor(() => {
      expect(queryByText('Delete')).toBeNull();
    });
  });

  it('handles product deletion', async () => {
    const { getByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: mockStore }
    );

    await waitFor(() => {
      const deleteButton = getByText('Delete');
      fireEvent.press(deleteButton);
    });

    // Should show confirmation alert
    await waitFor(() => {
      expect(getByText('Delete Product')).toBeTruthy();
      expect(getByText('Are you sure you want to delete "iPhone 15 Pro"?')).toBeTruthy();
    });
  });

  it('navigates to categories screen', async () => {
    const { getByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: mockStore }
    );

    const categoriesButton = getByText('Categories');
    fireEvent.press(categoriesButton);

    expect(mockNavigate).toHaveBeenCalledWith('CategorySelection');
  });

  it('shows loading state', () => {
    const loadingStore = {
      ...mockStore,
      products: {
        ...mockStore.products,
        allProductsLoading: true,
        allProducts: [],
      },
    };

    const { getByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: loadingStore }
    );

    expect(getByText('Loading products...')).toBeTruthy();
  });

  it('shows error state', () => {
    const errorStore = {
      ...mockStore,
      products: {
        ...mockStore.products,
        allProductsError: 'Failed to load products',
        allProducts: [],
      },
    };

    const { getByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: errorStore }
    );

    expect(getByText('Failed to load products')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('shows empty state when no products', () => {
    const emptyStore = {
      ...mockStore,
      products: {
        ...mockStore.products,
        allProducts: [],
      },
    };

    const { getByText } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: emptyStore }
    );

    expect(getByText('No products found')).toBeTruthy();
  });

  it('handles pull to refresh', async () => {
    const { getByTestId } = renderWithProviders(
      <ProductsScreen />,
      { preloadedState: mockStore }
    );

    // Simulate pull to refresh
    const flatList = getByTestId('products-flatlist');
    fireEvent(flatList, 'onRefresh');

    // Should trigger refresh
    await waitFor(() => {
      // Refresh logic would be tested here
    });
  });
});

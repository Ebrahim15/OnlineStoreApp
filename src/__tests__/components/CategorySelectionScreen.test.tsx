import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { server } from '../mocks/server';
import { renderWithProviders, mockCategories } from '../utils/test-utils';
import CategorySelectionScreen from '../../screens/CategorySelectionScreen';

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

// Mock Redux store with categories
const mockStore = {
  auth: {
    user: { role: 'user' },
    token: 'mock-token',
  },
  products: {
    categories: mockCategories,
    categoriesLoading: false,
    categoriesError: null,
  },
};

describe('CategorySelectionScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: mockStore }
    );

    await waitFor(() => {
      expect(getByText('Categories')).toBeTruthy();
      expect(getByPlaceholderText('Search categories...')).toBeTruthy();
    });
  });

  it('displays categories list', async () => {
    const { getByText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: mockStore }
    );

    await waitFor(() => {
      expect(getByText('Electronics')).toBeTruthy();
      expect(getByText('Clothing')).toBeTruthy();
      expect(getByText('Books')).toBeTruthy();
    });
  });

  it('handles search input', async () => {
    const { getByPlaceholderText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: mockStore }
    );

    const searchInput = getByPlaceholderText('Search categories...');
    fireEvent.changeText(searchInput, 'electronics');

    await waitFor(() => {
      expect(searchInput.props.value).toBe('electronics');
    });
  });

  it('filters categories based on search query', async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: mockStore }
    );

    const searchInput = getByPlaceholderText('Search categories...');
    fireEvent.changeText(searchInput, 'electronics');

    await waitFor(() => {
      expect(getByText('Electronics')).toBeTruthy();
      expect(queryByText('Clothing')).toBeNull();
    });
  });

  it('navigates to category screen when category is selected', async () => {
    const { getByText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: mockStore }
    );

    await waitFor(() => {
      const electronicsCategory = getByText('Electronics');
      fireEvent.press(electronicsCategory);
    });

    expect(mockNavigate).toHaveBeenCalledWith('Category', { category: 'electronics' });
  });

  it('shows loading state', () => {
    const loadingStore = {
      ...mockStore,
      products: {
        ...mockStore.products,
        categoriesLoading: true,
        categories: [],
      },
    };

    const { getByText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: loadingStore }
    );

    expect(getByText('Loading categories...')).toBeTruthy();
  });

  it('shows error state', () => {
    const errorStore = {
      ...mockStore,
      products: {
        ...mockStore.products,
        categoriesError: 'Failed to load categories',
        categories: [],
      },
    };

    const { getByText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: errorStore }
    );

    expect(getByText('Failed to load categories')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('shows empty state when no categories', () => {
    const emptyStore = {
      ...mockStore,
      products: {
        ...mockStore.products,
        categories: [],
      },
    };

    const { getByText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: emptyStore }
    );

    expect(getByText('No categories found')).toBeTruthy();
  });

  it('handles retry on error', async () => {
    const errorStore = {
      ...mockStore,
      products: {
        ...mockStore.products,
        categoriesError: 'Failed to load categories',
        categories: [],
      },
    };

    const { getByText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: errorStore }
    );

    const retryButton = getByText('Retry');
    fireEvent.press(retryButton);

    // Should trigger refetch
    await waitFor(() => {
      // Retry logic would be tested here
    });
  });

  it('capitalizes category names correctly', async () => {
    const { getByText } = renderWithProviders(
      <CategorySelectionScreen navigation={{ navigate: mockNavigate }} />,
      { preloadedState: mockStore }
    );

    await waitFor(() => {
      expect(getByText('Electronics')).toBeTruthy();
      expect(getByText('Clothing')).toBeTruthy();
      expect(getByText('Books')).toBeTruthy();
    });
  });
});

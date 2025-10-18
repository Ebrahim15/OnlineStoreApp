import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { server } from '../mocks/server';
import { 
  useProductsWithRedux, 
  useProductsByCategoryWithRedux, 
  useCategoriesWithRedux,
  useDeleteProductWithRedux 
} from '../../hooks/useProductsWithRedux';
import { mockProducts, mockCategories } from '../utils/test-utils';

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createWrapper = (queryClient: QueryClient, store: any) => {
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
};

describe('useProducts hooks', () => {
  let queryClient: QueryClient;
  let store: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    store = configureStore({
      reducer: {
        products: (state = {
          allProducts: [],
          allProductsSearchQuery: '',
          allProductsLoading: false,
          allProductsError: null,
          categoryProducts: [],
          selectedCategory: '',
          categorySearchQuery: '',
          categoryLoading: false,
          categoryError: null,
          categories: [],
          categoriesLoading: false,
          categoriesError: null,
        }, action) => {
          switch (action.type) {
            case 'products/setAllProducts':
              return { ...state, allProducts: action.payload };
            case 'products/setAllProductsLoading':
              return { ...state, allProductsLoading: action.payload };
            case 'products/setAllProductsError':
              return { ...state, allProductsError: action.payload };
            case 'products/setCategoryProducts':
              return { ...state, categoryProducts: action.payload };
            case 'products/setCategories':
              return { ...state, categories: action.payload };
            case 'products/removeAllProduct':
              return {
                ...state,
                allProducts: state.allProducts.filter(p => p.id !== action.payload),
              };
            case 'products/removeCategoryProduct':
              return {
                ...state,
                categoryProducts: state.categoryProducts.filter(p => p.id !== action.payload),
              };
            default:
              return state;
          }
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('useProductsWithRedux', () => {
    it('should fetch products successfully', async () => {
      const { result } = renderHook(() => useProductsWithRedux(20, 0), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.products).toHaveLength(3);
      expect(result.current.products[0]).toMatchObject({
        id: 1,
        title: 'iPhone 15 Pro',
        price: 999,
      });
    });

    it('should handle search query', async () => {
      const { result } = renderHook(() => useProductsWithRedux(20, 0), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Test search functionality
      result.current.setSearchQuery('iPhone');

      await waitFor(() => {
        expect(result.current.searchQuery).toBe('iPhone');
      });
    });

    it('should handle loading state', () => {
      const { result } = renderHook(() => useProductsWithRedux(20, 0), {
        wrapper: createWrapper(queryClient, store),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should handle error state', async () => {
      // Mock server error
      server.use(
        server.use(
          server.get('https://dummyjson.com/products', () => {
            return new Response(null, { status: 500 });
          })
        )
      );

      const { result } = renderHook(() => useProductsWithRedux(20, 0), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useProductsByCategoryWithRedux', () => {
    it('should fetch products by category successfully', async () => {
      const { result } = renderHook(() => useProductsByCategoryWithRedux('electronics', 20, 0), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].category).toBe('electronics');
    });

    it('should not fetch when category is empty', () => {
      const { result } = renderHook(() => useProductsByCategoryWithRedux('', 20, 0), {
        wrapper: createWrapper(queryClient, store),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useCategoriesWithRedux', () => {
    it('should fetch categories successfully', async () => {
      const { result } = renderHook(() => useCategoriesWithRedux(), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.categories).toEqual(mockCategories);
    });
  });

  describe('useDeleteProductWithRedux', () => {
    it('should delete product successfully', async () => {
      const { result } = renderHook(() => useDeleteProductWithRedux(), {
        wrapper: createWrapper(queryClient, store),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toMatchObject({
        id: 1,
        isDeleted: true,
      });
    });

    it('should handle delete error', async () => {
      // Mock server error
      server.use(
        server.delete('https://dummyjson.com/products/:id', () => {
          return new Response(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useDeleteProductWithRedux(), {
        wrapper: createWrapper(queryClient, store),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

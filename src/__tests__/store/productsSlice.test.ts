import { configureStore } from '@reduxjs/toolkit';
import productsReducer, {
  setAllProducts,
  setAllProductsSearchQuery,
  setAllProductsLoading,
  setAllProductsError,
  setCategoryProducts,
  setSelectedCategory,
  setCategorySearchQuery,
  setCategoryLoading,
  setCategoryError,
  setCategories,
  setCategoriesLoading,
  setCategoriesError,
  removeAllProduct,
  removeCategoryProduct,
  ProductsState,
} from '../../features/products/productsSlice';

const mockProduct = {
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

const mockProducts = [mockProduct];

describe('productsSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().products;
      expect(state).toEqual({
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
  });

  describe('allProducts actions', () => {
    it('should set all products', () => {
      store.dispatch(setAllProducts(mockProducts));

      const state = store.getState().products;
      expect(state.allProducts).toEqual(mockProducts);
    });

    it('should set all products search query', () => {
      const searchQuery = 'test search';
      store.dispatch(setAllProductsSearchQuery(searchQuery));

      const state = store.getState().products;
      expect(state.allProductsSearchQuery).toBe(searchQuery);
    });

    it('should set all products loading state', () => {
      store.dispatch(setAllProductsLoading(true));

      const state = store.getState().products;
      expect(state.allProductsLoading).toBe(true);
    });

    it('should set all products error', () => {
      const error = 'Failed to fetch products';
      store.dispatch(setAllProductsError(error));

      const state = store.getState().products;
      expect(state.allProductsError).toBe(error);
    });
  });

  describe('categoryProducts actions', () => {
    it('should set category products', () => {
      store.dispatch(setCategoryProducts(mockProducts));

      const state = store.getState().products;
      expect(state.categoryProducts).toEqual(mockProducts);
    });

    it('should set selected category', () => {
      const category = 'electronics';
      store.dispatch(setSelectedCategory(category));

      const state = store.getState().products;
      expect(state.selectedCategory).toBe(category);
    });

    it('should set category search query', () => {
      const searchQuery = 'test search';
      store.dispatch(setCategorySearchQuery(searchQuery));

      const state = store.getState().products;
      expect(state.categorySearchQuery).toBe(searchQuery);
    });

    it('should set category loading state', () => {
      store.dispatch(setCategoryLoading(true));

      const state = store.getState().products;
      expect(state.categoryLoading).toBe(true);
    });

    it('should set category error', () => {
      const error = 'Failed to fetch category products';
      store.dispatch(setCategoryError(error));

      const state = store.getState().products;
      expect(state.categoryError).toBe(error);
    });
  });

  describe('categories actions', () => {
    it('should set categories', () => {
      const categories = ['electronics', 'clothing', 'books'];
      store.dispatch(setCategories(categories));

      const state = store.getState().products;
      expect(state.categories).toEqual(categories);
    });

    it('should set categories loading state', () => {
      store.dispatch(setCategoriesLoading(true));

      const state = store.getState().products;
      expect(state.categoriesLoading).toBe(true);
    });

    it('should set categories error', () => {
      const error = 'Failed to fetch categories';
      store.dispatch(setCategoriesError(error));

      const state = store.getState().products;
      expect(state.categoriesError).toBe(error);
    });
  });

  describe('product removal actions', () => {
    beforeEach(() => {
      // Set up initial state with products
      store.dispatch(setAllProducts(mockProducts));
      store.dispatch(setCategoryProducts(mockProducts));
    });

    it('should remove product from all products', () => {
      store.dispatch(removeAllProduct(1));

      const state = store.getState().products;
      expect(state.allProducts).toHaveLength(0);
    });

    it('should remove product from category products', () => {
      store.dispatch(removeCategoryProduct(1));

      const state = store.getState().products;
      expect(state.categoryProducts).toHaveLength(0);
    });

    it('should not remove non-existent product', () => {
      const initialState = store.getState().products;
      
      store.dispatch(removeAllProduct(999));

      const state = store.getState().products;
      expect(state.allProducts).toEqual(initialState.allProducts);
    });
  });

  describe('state immutability', () => {
    it('should not mutate state when setting products', () => {
      const initialState = store.getState().products;
      
      store.dispatch(setAllProducts(mockProducts));

      expect(initialState.allProducts).toEqual([]);
    });

    it('should not mutate state when removing products', () => {
      store.dispatch(setAllProducts(mockProducts));
      const stateBeforeRemoval = store.getState().products;
      
      store.dispatch(removeAllProduct(1));

      expect(stateBeforeRemoval.allProducts).toEqual(mockProducts);
    });
  });

  describe('complex state updates', () => {
    it('should handle multiple state updates correctly', () => {
      const products = [mockProduct];
      const categories = ['electronics', 'clothing'];
      const searchQuery = 'test';

      store.dispatch(setAllProducts(products));
      store.dispatch(setCategories(categories));
      store.dispatch(setAllProductsSearchQuery(searchQuery));
      store.dispatch(setAllProductsLoading(true));

      const state = store.getState().products;
      expect(state.allProducts).toEqual(products);
      expect(state.categories).toEqual(categories);
      expect(state.allProductsSearchQuery).toBe(searchQuery);
      expect(state.allProductsLoading).toBe(true);
    });

    it('should handle error states correctly', () => {
      const productsError = 'Failed to fetch products';
      const categoriesError = 'Failed to fetch categories';

      store.dispatch(setAllProductsError(productsError));
      store.dispatch(setCategoriesError(categoriesError));

      const state = store.getState().products;
      expect(state.allProductsError).toBe(productsError);
      expect(state.categoriesError).toBe(categoriesError);
    });
  });
});

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../services/productsApi';

interface ProductsState {
  // Main products screen state
  allProducts: Product[];
  allProductsSearchQuery: string;
  allProductsLoading: boolean;
  allProductsError: string | null;
  allProductsLastFetched: number | null;
  
  // Category-specific screen state
  categoryProducts: Product[];
  selectedCategory: string | null;
  categorySearchQuery: string;
  categoryLoading: boolean;
  categoryError: string | null;
  categoryLastFetched: number | null;
  
  // Categories list state
  categories: string[];
  categoriesLoading: boolean;
  categoriesError: string | null;
}

const initialState: ProductsState = {
  // Main products screen state
  allProducts: [],
  allProductsSearchQuery: '',
  allProductsLoading: false,
  allProductsError: null,
  allProductsLastFetched: null,
  
  // Category-specific screen state
  categoryProducts: [],
  selectedCategory: null,
  categorySearchQuery: '',
  categoryLoading: false,
  categoryError: null,
  categoryLastFetched: null,
  
  // Categories list state
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Main products screen actions
    setAllProducts: (state, action: PayloadAction<Product[]>) => {
      state.allProducts = action.payload;
      state.allProductsLastFetched = Date.now();
    },
    addAllProducts: (state, action: PayloadAction<Product[]>) => {
      state.allProducts = [...state.allProducts, ...action.payload];
    },
    removeAllProduct: (state, action: PayloadAction<number>) => {
      state.allProducts = state.allProducts.filter(product => product.id !== action.payload);
    },
    setAllProductsSearchQuery: (state, action: PayloadAction<string>) => {
      state.allProductsSearchQuery = action.payload;
    },
    setAllProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.allProductsLoading = action.payload;
    },
    setAllProductsError: (state, action: PayloadAction<string | null>) => {
      state.allProductsError = action.payload;
    },
    
    // Category-specific screen actions
    setCategoryProducts: (state, action: PayloadAction<Product[]>) => {
      state.categoryProducts = action.payload;
      state.categoryLastFetched = Date.now();
    },
    addCategoryProducts: (state, action: PayloadAction<Product[]>) => {
      state.categoryProducts = [...state.categoryProducts, ...action.payload];
    },
    removeCategoryProduct: (state, action: PayloadAction<number>) => {
      state.categoryProducts = state.categoryProducts.filter(product => product.id !== action.payload);
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setCategorySearchQuery: (state, action: PayloadAction<string>) => {
      state.categorySearchQuery = action.payload;
    },
    setCategoryLoading: (state, action: PayloadAction<boolean>) => {
      state.categoryLoading = action.payload;
    },
    setCategoryError: (state, action: PayloadAction<string | null>) => {
      state.categoryError = action.payload;
    },
    
    // Categories list actions
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.categoriesLoading = action.payload;
    },
    setCategoriesError: (state, action: PayloadAction<string | null>) => {
      state.categoriesError = action.payload;
    },
    
    // Clear actions
    clearAllProducts: (state) => {
      state.allProducts = [];
      state.allProductsSearchQuery = '';
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
      state.selectedCategory = null;
      state.categorySearchQuery = '';
    },
  },
});

export const {
  // Main products screen actions
  setAllProducts,
  addAllProducts,
  removeAllProduct,
  setAllProductsSearchQuery,
  setAllProductsLoading,
  setAllProductsError,
  
  // Category-specific screen actions
  setCategoryProducts,
  addCategoryProducts,
  removeCategoryProduct,
  setSelectedCategory,
  setCategorySearchQuery,
  setCategoryLoading,
  setCategoryError,
  
  // Categories list actions
  setCategories,
  setCategoriesLoading,
  setCategoriesError,
  
  // Clear actions
  clearAllProducts,
  clearCategoryProducts,
} = productsSlice.actions;

export default productsSlice.reducer;

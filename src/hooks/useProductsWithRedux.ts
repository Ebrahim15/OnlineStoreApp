import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { productsApi } from '../services/productsApi';
import { RootState } from '../store/store';
import {
  setAllProducts,
  removeAllProduct,
  setAllProductsSearchQuery,
  setAllProductsLoading,
  setAllProductsError,
  setCategoryProducts,
  removeCategoryProduct,
  setSelectedCategory,
  setCategorySearchQuery,
  setCategoryLoading,
  setCategoryError,
  setCategories,
  setCategoriesLoading,
  setCategoriesError,
} from '../features/products/productsSlice';

export const useProductsWithRedux = (limit: number = 20, skip: number = 0) => {
  const dispatch = useDispatch();
  const { allProducts, allProductsSearchQuery } = useSelector((state: RootState) => state.products);

  const query = useQuery({
    queryKey: ['products', limit, skip],
    queryFn: () => productsApi.getProducts(limit, skip),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(setAllProducts(query.data.products));
      dispatch(setAllProductsLoading(false));
      dispatch(setAllProductsError(null));
    }
    if (query.isError) {
      dispatch(setAllProductsError(query.error?.message || 'Failed to fetch products'));
      dispatch(setAllProductsLoading(false));
    }
    if (query.isLoading) {
      dispatch(setAllProductsLoading(true));
    }
  }, [query.isSuccess, query.isError, query.isLoading, query.data, query.error, dispatch]);

  return {
    ...query,
    products: allProducts,
    searchQuery: allProductsSearchQuery,
    setSearchQuery: (searchQuery: string) => dispatch(setAllProductsSearchQuery(searchQuery)),
  };
};

export const useProductsByCategoryWithRedux = (category: string, limit: number = 20, skip: number = 0) => {
  const dispatch = useDispatch();
  const { categoryProducts, categorySearchQuery } = useSelector((state: RootState) => state.products);

  const query = useQuery({
    queryKey: ['products', 'category', category, limit, skip],
    queryFn: () => productsApi.getProductsByCategory(category, limit, skip),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(setCategoryProducts(query.data.products));
      dispatch(setSelectedCategory(category));
      dispatch(setCategoryLoading(false));
      dispatch(setCategoryError(null));
    }
    if (query.isError) {
      dispatch(setCategoryError(query.error?.message || 'Failed to fetch category products'));
      dispatch(setCategoryLoading(false));
    }
    if (query.isLoading) {
      dispatch(setCategoryLoading(true));
    }
  }, [query.isSuccess, query.isError, query.isLoading, query.data, query.error, dispatch, category]);

  return {
    ...query,
    products: categoryProducts,
    searchQuery: categorySearchQuery,
    setSearchQuery: (searchQuery: string) => dispatch(setCategorySearchQuery(searchQuery)),
    selectedCategory: category,
  };
};

export const useCategoriesWithRedux = () => {
  const dispatch = useDispatch();
  const { categories, categoriesLoading, categoriesError } = useSelector((state: RootState) => state.products);

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(setCategories(query.data));
      dispatch(setCategoriesLoading(false));
      dispatch(setCategoriesError(null));
    }
    if (query.isError) {
      dispatch(setCategoriesError(query.error?.message || 'Failed to fetch categories'));
      dispatch(setCategoriesLoading(false));
    }
    if (query.isLoading) {
      dispatch(setCategoriesLoading(true));
    }
  }, [query.isSuccess, query.isError, query.isLoading, query.data, query.error, dispatch]);

  return {
    ...query,
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  };
};

export const useDeleteProductWithRedux = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onMutate: async (deletedId: number) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      
      // Optimistically remove from both Redux stores
      dispatch(removeAllProduct(deletedId));
      dispatch(removeCategoryProduct(deletedId));
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (err, deletedId) => {
      console.log('Delete failed (dummyData no real deletion):', err);
    },
  });
};

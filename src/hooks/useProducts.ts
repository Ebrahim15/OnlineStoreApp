import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, Product } from '../services/productsApi';
// import NetInfo from '@react-native-community/netinfo';

export const useProducts = (limit: number = 20, skip: number = 0) => {
  return useQuery({
    queryKey: ['products', limit, skip],
    queryFn: () => productsApi.getProducts(limit, skip),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onMutate: async (deletedId: number) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Get all products queries and update them
      const queries = queryClient.getQueriesData({ queryKey: ['products'] });

      // Optimistically update each products query by removing the deleted product
      queries.forEach(([queryKey, data]) => {
        if (data) {
          // Update the cache by removing the deleted product
          queryClient.setQueryData(queryKey, (old: any) => {
            if (!old || !old.products) return old;
            return {
              ...old,
              products: old.products.filter((product: Product) => product.id !== deletedId),
              total: old.total ? old.total - 1 : old.total,
            };
          });
        }
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (err, deletedId) => {
      
      console.log('Delete failed (dummyData no real deletion):', err);
    },
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productsApi.searchProducts(query),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 60 * 2, // 2 minutes for search results
  });
};

export const useProductsByCategory = (category: string, limit: number = 20, skip: number = 0) => {
  return useQuery({
    queryKey: ['products', 'category', category, limit, skip],
    queryFn: () => productsApi.getProductsByCategory(category, limit, skip),
    enabled: !!category,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes (categories don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

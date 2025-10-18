import { QueryClient } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Simple persistence using MMKV
const persistQueryClient = () => {
  // Save cache to MMKV whenever it changes
  queryClient.getQueryCache().subscribe(() => {
    try {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      const serializedCache = JSON.stringify(queries.map(query => ({
        queryKey: query.queryKey,
        queryHash: query.queryHash,
        state: query.state,
        dataUpdatedAt: query.state.dataUpdatedAt,
      })));
      storage.set('react-query-cache', serializedCache);
    } catch (error) {
      console.error('Failed to persist query cache:', error);
    }
  });
};

// Restore cache from MMKV on app start
const restoreQueryClient = () => {
  try {
    const cached = storage.getString('react-query-cache');
    if (cached) {
      const queries = JSON.parse(cached);
      queries.forEach((query: any) => {
        if (query.state.data) {
          queryClient.setQueryData(query.queryKey, query.state.data);
        }
      });
    }
  } catch (error) {
    console.error('Failed to restore query cache:', error);
  }
};

// Initialize persistence
persistQueryClient();
restoreQueryClient();

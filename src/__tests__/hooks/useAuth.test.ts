import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { server } from '../mocks/server';
import { useLogin, useUser, useLogout, useAuthStatus } from '../../hooks/useAuth';
import { mockApiResponses } from '../utils/test-utils';

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

describe('useAuth hooks', () => {
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
        auth: (state = { user: null, token: null }, action) => {
          switch (action.type) {
            case 'auth/setCredentials':
              return { ...state, ...action.payload };
            case 'auth/logout':
              return { user: null, token: null };
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

  describe('useLogin', () => {
    it('should login successfully with valid credentials', async () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(queryClient, store),
      });

      result.current.mutate({ username: 'testuser', password: 'password' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockApiResponses.login);
    });

    it('should handle login failure with invalid credentials', async () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(queryClient, store),
      });

      result.current.mutate({ username: 'invalid', password: 'invalid' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useUser', () => {
    it('should fetch user data when token is provided', async () => {
      const { result } = renderHook(() => useUser('mock-jwt-token'), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockApiResponses.user);
    });

    it('should not fetch user data when token is null', () => {
      const { result } = renderHook(() => useUser(null), {
        wrapper: createWrapper(queryClient, store),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle user fetch error', async () => {
      const { result } = renderHook(() => useUser('invalid-token'), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useLogout', () => {
    it('should logout successfully', async () => {
      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(queryClient, store),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('useAuthStatus', () => {
    it('should return null when no token exists', async () => {
      // Mock storage to return null
      const mockGet = jest.fn().mockReturnValue(null);
      jest.doMock('../../services/storage', () => ({
        get: mockGet,
      }));

      const { result } = renderHook(() => useAuthStatus(), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should return auth data when valid token exists', async () => {
      // Mock storage to return token
      const mockGet = jest.fn().mockReturnValue('mock-jwt-token');
      jest.doMock('../../services/storage', () => ({
        get: mockGet,
      }));

      const { result } = renderHook(() => useAuthStatus(), {
        wrapper: createWrapper(queryClient, store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        token: 'mock-jwt-token',
        user: mockApiResponses.user,
      });
    });
  });
});

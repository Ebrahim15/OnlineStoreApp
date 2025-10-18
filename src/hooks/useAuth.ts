import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { login, getMe } from '../services/authApi';
import { setCredentials, logout } from '../features/auth/authSlice';
import { set, remove, get } from '../services/storage';

export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => 
      login(username, password),
    onSuccess: async (data) => {
      try {
        // Store token first
        set('token', data.accessToken);
        
        // Fetch user details with role information
        const userDetails = await getMe(data.accessToken);
        
        // Dispatch complete user information including role
        dispatch(setCredentials({ 
          token: data.accessToken, 
          user: userDetails 
        }));
        
        // Invalidate and refetch user queries
        queryClient.invalidateQueries({ queryKey: ['user'] });
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        // If getMe fails, still set basic credentials but log the error
        dispatch(setCredentials({ 
          token: data.accessToken, 
          user: { 
            id: data.id, 
            username: data.username, 
            email: data.email 
          } 
        }));
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useUser = (token: string | null) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['user', token],
    queryFn: () => getMe(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(setCredentials({ token: token!, user: query.data }));
    }
  }, [query.isSuccess, query.data, dispatch, token]);

  useEffect(() => {
    if (query.isError) {
      console.error('Failed to fetch user data:', query.error);
      // Clear invalid token
      dispatch(logout());
      remove('token');
    }
  }, [query.isError, query.error, dispatch]);

  return query;
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear token from storage
      remove('token');
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear Redux state
      dispatch(logout());
      
      // Clear all queries
      queryClient.clear();
    },
  });
};

export const useAuthStatus = () => {
//   const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      const token = get('token');
      if (!token) return null;
      
      try {
        const userData = await getMe(token);
        return { token, user: userData };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Token is invalid, clear it
        remove('token');
        return null;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: false,
  });
};

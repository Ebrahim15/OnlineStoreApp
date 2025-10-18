import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const api = axios.create({
  baseURL: 'https://example.com/api',
});

export const useFetchUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data,
  });
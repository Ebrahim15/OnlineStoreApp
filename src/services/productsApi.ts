import axios from 'axios';

export interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  rating: number;
  stock: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const API_BASE_URL = 'https://dummyjson.com';

export const productsApi = {
  // Fetch all products
  getProducts: async (limit: number = 20, skip: number = 0): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Fetch single product
  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  // Delete product (for superadmin)
  deleteProduct: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/products/${id}`);
  },

  // Search products
  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string, limit: number = 20, skip: number = 0): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/categories`);
    console.log('Raw categories response:', response.data);
    console.log('Response type:', typeof response.data);
    console.log('Is array:', Array.isArray(response.data));
    
    // dummyJSON returns an array of category names
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If it's an object, convert to array
    if (typeof response.data === 'object' && response.data !== null) {
      return Object.keys(response.data);
    }
    
    // Fallback
    return [];
  },
};

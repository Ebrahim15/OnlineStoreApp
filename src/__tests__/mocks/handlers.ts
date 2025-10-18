import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'https://dummyjson.com';

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.username === 'testuser' && body.password === 'password') {
      return HttpResponse.json({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        image: 'https://example.com/avatar.jpg',
        token: 'mock-jwt-token',
      });
    }
    
    return new HttpResponse(null, { status: 400 });
  }),

  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader === 'Bearer mock-jwt-token') {
      return HttpResponse.json({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
      });
    }
    
    return new HttpResponse(null, { status: 401 });
  }),

  // Products endpoints
  http.get(`${API_BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '20';
    const skip = url.searchParams.get('skip') || '0';
    const search = url.searchParams.get('q');

    const mockProducts = [
      {
        id: 1,
        title: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced features',
        price: 999,
        category: 'electronics',
        thumbnail: 'https://example.com/iphone.jpg',
        images: ['https://example.com/iphone.jpg'],
        brand: 'Apple',
        rating: 4.8,
        stock: 50,
      },
      {
        id: 2,
        title: 'Samsung Galaxy S24',
        description: 'Premium Android smartphone',
        price: 899,
        category: 'electronics',
        thumbnail: 'https://example.com/galaxy.jpg',
        images: ['https://example.com/galaxy.jpg'],
        brand: 'Samsung',
        rating: 4.6,
        stock: 30,
      },
      {
        id: 3,
        title: 'Nike Air Max',
        description: 'Comfortable running shoes',
        price: 120,
        category: 'clothing',
        thumbnail: 'https://example.com/nike.jpg',
        images: ['https://example.com/nike.jpg'],
        brand: 'Nike',
        rating: 4.4,
        stock: 100,
      },
    ];

    let filteredProducts = mockProducts;

    if (search) {
      filteredProducts = mockProducts.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    return HttpResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      skip: parseInt(skip),
      limit: parseInt(limit),
    });
  }),

  http.get(`${API_BASE_URL}/products/category/:category`, ({ params }) => {
    const { category } = params;
    
    const categoryProducts = [
      {
        id: 1,
        title: `${category} Product 1`,
        description: `A great ${category} product`,
        price: 99.99,
        category: category,
        thumbnail: 'https://example.com/product1.jpg',
        images: ['https://example.com/product1.jpg'],
        brand: 'Test Brand',
        rating: 4.5,
        stock: 50,
      },
    ];

    return HttpResponse.json({
      products: categoryProducts,
      total: categoryProducts.length,
      skip: 0,
      limit: 20,
    });
  }),

  http.delete(`${API_BASE_URL}/products/:id`, ({ params }) => {
    const { id } = params;
    
    // Mock successful deletion
    return HttpResponse.json({
      id: parseInt(id),
      title: 'Deleted Product',
      isDeleted: true,
      deletedOn: new Date().toISOString(),
    });
  }),

  // Categories endpoint
  http.get(`${API_BASE_URL}/products/categories`, () => {
    return HttpResponse.json([
      'electronics',
      'clothing',
      'books',
      'home',
      'sports',
      'beauty',
      'toys',
      'automotive',
    ]);
  }),

  // Search endpoint
  http.get(`${API_BASE_URL}/products/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';

    const mockProducts = [
      {
        id: 1,
        title: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced features',
        price: 999,
        category: 'electronics',
        thumbnail: 'https://example.com/iphone.jpg',
        images: ['https://example.com/iphone.jpg'],
        brand: 'Apple',
        rating: 4.8,
        stock: 50,
      },
    ];

    const filteredProducts = mockProducts.filter(product =>
      product.title.toLowerCase().includes(q.toLowerCase()) ||
      product.description.toLowerCase().includes(q.toLowerCase())
    );

    return HttpResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      skip: 0,
      limit: 20,
    });
  }),
];

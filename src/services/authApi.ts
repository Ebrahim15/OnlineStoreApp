const BASE_URL = 'https://dummyjson.com';

export const login = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    if (res.status === 400) {
      throw new Error('The username or password you entered is incorrect. Please try again.');
    }
    throw new Error('Unable to connect to the server. Please check your internet connection.');
  }
  return res.json();
};

export const getMe = async (token: string) => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Your session has expired. Please log in again.');
    }
    throw new Error('Unable to load user information. Please try again.');
  }
  return res.json();
};
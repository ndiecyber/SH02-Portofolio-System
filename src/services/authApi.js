import api from './api';

// Toggle this to true to use mock data instead of calling backend REST API
const USE_MOCK_AUTH = true;

export const login = async (email, password) => {
  if (USE_MOCK_AUTH) {
    // Simulate network latency (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === 'admin@lexa.com' && password === 'admin123') {
      const mockUser = {
        id: 1,
        name: 'Lexa Admin',
        email: 'admin@lexa.com',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      };
      const mockToken = 'mock_jwt_token_sh02_lexa';
      return { user: mockUser, token: mockToken };
    } else {
      throw new Error('Invalid email or password. Please use admin@lexa.com and admin123');
    }
  }

  // Real REST API integration
  const response = await api.post('/auth/login', { email, password });
  return response.data; // Expected response structure: { user, token }
};

export const logout = async () => {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const response = await api.post('/auth/logout');
  return response.data;
};

export const getProfile = async () => {
  if (USE_MOCK_AUTH) {
    const userJson = localStorage.getItem('sh02_auth_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  const response = await api.get('/auth/profile');
  return response.data;
};

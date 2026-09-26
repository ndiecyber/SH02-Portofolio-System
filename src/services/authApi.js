import api, { USE_MOCK as USE_MOCK_AUTH } from './api';
import * as mockDb from '../utils/mockDb';

// Initialize mock DB on load
mockDb.initMockDb();


export const login = async (email, password) => {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = mockDb.dbGetUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (match) {
      if (match.isActive === false) {
        throw new Error('Akun Anda dinonaktifkan. Silakan hubungi CEO.');
      }
      // Normalize legacy 'CEO' role to 'ADMIN' (from stale localStorage data)
      const normalizedRole = match.role === 'CEO' ? 'ADMIN' : match.role;
      if (normalizedRole !== 'ADMIN' && normalizedRole !== 'DEVELOPER') {
        throw new Error('Hanya Admin dan Developer yang diizinkan masuk ke portal. Silakan hubungi Administrator atau gunakan Tracking Link.');
      }
      const mockToken = `mock_jwt_token_sh02_${normalizedRole}_${match.id}`;
      // Return user details without password
      const { password: _, ...userWithoutPassword } = match;
      return { user: { ...userWithoutPassword, role: normalizedRole }, token: mockToken };
    } else {
      throw new Error('Email atau password salah.');
    }
  }

  // Real REST API integration (Better-Auth)
  const response = await api.post('/api/auth/sign-in/email', { email, password });
  const data = response.data;
  if (data?.user) {
    const rawRole = (data.user.role || 'DEVELOPER').toUpperCase();
    const normalizedRole = rawRole === 'CEO' ? 'ADMIN' : rawRole;
    return {
      ...data,
      user: {
        ...data.user,
        role: normalizedRole,
      },
    };
  }
  return data;
};

export const logout = async () => {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const response = await api.post('/api/auth/sign-out');
  return response.data;
};

export const getProfile = async () => {
  if (USE_MOCK_AUTH) {
    const userJson = localStorage.getItem('sh02_auth_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  const response = await api.get('/api/auth/get-session');
  const data = response.data;
  if (data?.user) {
    const rawRole = (data.user.role || 'DEVELOPER').toUpperCase();
    const normalizedRole = rawRole === 'CEO' ? 'ADMIN' : rawRole;
    return {
      ...data.user,
      role: normalizedRole,
    };
  }
  return data;
};

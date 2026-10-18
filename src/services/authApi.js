import api from './api';

export const login = async (email, password) => {
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
  const response = await api.post('/api/auth/sign-out');
  return response.data;
};

export const getProfile = async () => {
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

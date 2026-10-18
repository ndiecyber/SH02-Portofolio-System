import api from './api';

export const getUsers = async (params = {}) => {
  const response = await api.get('/api/users', { params });
  const raw = response.data;
  if (Array.isArray(raw)) {
    return { users: raw, total: raw.length };
  }
  if (Array.isArray(raw?.data)) {
    return {
      users: raw.data,
      total: raw.meta?.total ?? raw.total ?? raw.data.length,
    };
  }
  if (raw?.users) {
    return raw;
  }
  return { users: [], total: 0 };
};

export const createUser = async (userData) => {
  const response = await api.post('/api/users', userData);
  return response.data?.data ?? response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data?.data ?? response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data?.data ?? response.data;
};

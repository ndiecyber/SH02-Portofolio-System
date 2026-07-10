import api from './api';
import * as mockDb from '../utils/mockDb';

const USE_MOCK = true;

export const getUsers = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let users = mockDb.dbGetUsers();

    if (params.search) {
      const q = params.search.toLowerCase();
      users = users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    if (params.role) {
      users = users.filter((u) => u.role === params.role);
    }

    if (params.status) {
      users = users.filter((u) => u.status === params.status);
    }

    return {
      users,
      total: users.length
    };
  }

  const response = await api.get('/api/users', { params });
  return response.data;
};

export const getUser = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const user = mockDb.dbGetUser(id);
    if (!user) throw new Error('User tidak ditemukan.');
    return user;
  }

  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveUser(userData);
  }

  const response = await api.post('/api/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveUser({ ...userData, id });
  }

  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteUser(id);
    return { success: true };
  }

  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

import api from './api';

export const getDepartments = async (params = {}) => {
  const response = await api.get('/api/departments', { params });
  const raw = response.data;
  if (Array.isArray(raw)) {
    return { departments: raw, total: raw.length };
  }
  if (Array.isArray(raw?.data)) {
    return {
      departments: raw.data,
      total: raw.meta?.total ?? raw.total ?? raw.data.length,
    };
  }
  if (raw?.departments) {
    return raw;
  }
  return { departments: [], total: 0 };
};

export const createDepartment = async (departmentData) => {
  const response = await api.post('/api/departments', departmentData);
  return response.data?.data ?? response.data;
};

export const updateDepartment = async (id, departmentData) => {
  const response = await api.put(`/api/departments/${id}`, departmentData);
  return response.data?.data ?? response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/api/departments/${id}`);
  return response.data?.data ?? response.data;
};

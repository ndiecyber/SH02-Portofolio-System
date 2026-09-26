import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';

export const getDepartments = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let departments = mockDb.dbGetDepartments();

    if (params.search) {
      const q = params.search.toLowerCase();
      departments = departments.filter(
        (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || (d.description && d.description.toLowerCase().includes(q))
      );
    }

    if (params.status) {
      departments = departments.filter((d) => d.status === params.status);
    }

    return {
      departments,
      total: departments.length
    };
  }

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

export const getDepartment = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const dept = mockDb.dbGetDepartment(id);
    if (!dept) throw new Error('Departemen tidak ditemukan.');
    return dept;
  }

  const response = await api.get(`/api/departments/${id}`);
  return response.data?.data ?? response.data;
};

export const createDepartment = async (departmentData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveDepartment(departmentData);
  }

  const response = await api.post('/api/departments', departmentData);
  return response.data?.data ?? response.data;
};

export const updateDepartment = async (id, departmentData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveDepartment({ ...departmentData, id });
  }

  const response = await api.put(`/api/departments/${id}`, departmentData);
  return response.data?.data ?? response.data;
};

export const deleteDepartment = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteDepartment(id);
    return { success: true };
  }

  const response = await api.delete(`/api/departments/${id}`);
  return response.data?.data ?? response.data;
};

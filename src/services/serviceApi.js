import api from './api';
import * as mockDb from '../utils/mockDb';

const USE_MOCK = true;

export const getServices = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let services = mockDb.dbGetServices();

    if (params.search) {
      const q = params.search.toLowerCase();
      services = services.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }

    if (params.status) {
      services = services.filter((s) => s.status === params.status);
    }

    return {
      services,
      total: services.length
    };
  }

  const response = await api.get('/api/services', { params });
  return response.data;
};

export const getService = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const service = mockDb.dbGetService(id);
    if (!service) throw new Error('Layanan tidak ditemukan.');
    return service;
  }

  const response = await api.get(`/api/services/${id}`);
  return response.data;
};

export const createService = async (serviceData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveService(serviceData);
  }

  const response = await api.post('/api/services', serviceData);
  return response.data;
};

export const updateService = async (id, serviceData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveService({ ...serviceData, id });
  }

  const response = await api.put(`/api/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteService(id);
    return { success: true };
  }

  const response = await api.delete(`/api/services/${id}`);
  return response.data;
};

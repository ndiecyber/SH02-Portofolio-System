import api from './api';

export const getServices = async (params = {}) => {
  const response = await api.get('/api/services', { params });
  const raw = response.data;
  if (Array.isArray(raw)) {
    return { services: raw, total: raw.length };
  }
  if (Array.isArray(raw?.data)) {
    return {
      services: raw.data,
      total: raw.meta?.total ?? raw.total ?? raw.data.length,
    };
  }
  if (raw?.services) {
    return raw;
  }
  return { services: [], total: 0 };
};

export const createService = async (serviceData) => {
  const response = await api.post('/api/services', serviceData);
  return response.data?.data ?? response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await api.put(`/api/services/${id}`, serviceData);
  return response.data?.data ?? response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/api/services/${id}`);
  return response.data?.data ?? response.data;
};

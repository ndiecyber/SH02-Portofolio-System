import api from './api';
import {
  normalizeTechnology,
  serializeTechnology,
  techCategoryToApi,
} from '../utils/contractMap';

export const getTechnologies = async (params = {}) => {
  const query = { ...params, limit: params.limit ?? 100 };
  if (params.category) query.category = techCategoryToApi(params.category);

  const response = await api.get('/api/technologies', { params: query });
  const raw = response.data;
  const list = raw?.data ?? (Array.isArray(raw) ? raw : []);
  return list.map(normalizeTechnology);
};

export const createTechnology = async (techData) => {
  const response = await api.post('/api/technologies', serializeTechnology(techData));
  return normalizeTechnology(response.data?.data ?? response.data);
};

export const updateTechnology = async (id, techData) => {
  const response = await api.put(`/api/technologies/${id}`, serializeTechnology(techData));
  return normalizeTechnology(response.data?.data ?? response.data);
};

export const deleteTechnology = async (id) => {
  const response = await api.delete(`/api/technologies/${id}`);
  return response.data?.data ?? response.data;
};

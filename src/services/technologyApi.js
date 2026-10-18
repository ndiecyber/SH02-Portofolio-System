import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';
import {
  normalizeTechnology,
  serializeTechnology,
  techCategoryToApi,
} from '../utils/contractMap';

export const getTechnologies = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let techs = mockDb.dbGetTechnologies();

    if (params.search) {
      const q = params.search.toLowerCase();
      techs = techs.filter(
        (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }

    if (params.category) {
      techs = techs.filter((t) => t.category === params.category);
    }

    return techs;
  }

  const query = { ...params, limit: params.limit ?? 100 };
  if (params.category) query.category = techCategoryToApi(params.category);

  const response = await api.get('/api/technologies', { params: query });
  const raw = response.data;
  const list = raw?.data ?? (Array.isArray(raw) ? raw : []);
  return list.map(normalizeTechnology);
};

export const getTechnology = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const tech = mockDb.dbGetTechnology(id);
    if (!tech) throw new Error('Teknologi tidak ditemukan.');
    return tech;
  }

  const response = await api.get(`/api/technologies/${id}`);
  return normalizeTechnology(response.data?.data ?? response.data);
};

export const createTechnology = async (techData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveTechnology(techData);
  }

  const response = await api.post('/api/technologies', serializeTechnology(techData));
  return normalizeTechnology(response.data?.data ?? response.data);
};

export const updateTechnology = async (id, techData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveTechnology({ ...techData, id });
  }

  const response = await api.put(`/api/technologies/${id}`, serializeTechnology(techData));
  return normalizeTechnology(response.data?.data ?? response.data);
};

export const deleteTechnology = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockDb.dbDeleteTechnology(id);
    return { success: true };
  }

  const response = await api.delete(`/api/technologies/${id}`);
  return response.data?.data ?? response.data;
};

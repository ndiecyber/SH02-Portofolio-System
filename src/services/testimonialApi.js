import api from './api';
import {
  normalizeTestimonial,
  serializeTestimonial,
  contentStatusToApi,
} from '../utils/contractMap';

const buildPartial = (data = {}) => {
  const payload = {};
  if (data.clientName !== undefined) payload.clientName = data.clientName;
  if (data.rating !== undefined) payload.rating = Number(data.rating);
  if (data.message !== undefined || data.quote !== undefined) {
    payload.message = data.message ?? data.quote;
  }
  if (data.status !== undefined) payload.status = contentStatusToApi(data.status);
  return payload;
};

export const getTestimonials = async (params = {}) => {
  const query = { ...params };
  if (params.status) query.status = contentStatusToApi(params.status);
  else delete query.status;

  const response = await api.get('/api/testimonials', { params: query });
  const raw = response.data;
  const list = raw?.data ?? raw?.testimonials ?? (Array.isArray(raw) ? raw : []);
  return {
    testimonials: list.map(normalizeTestimonial),
    total: raw?.meta?.total ?? raw?.total ?? list.length,
  };
};

export const getTestimonial = async (id) => {
  const response = await api.get(`/api/testimonials/${id}`);
  return normalizeTestimonial(response.data?.data ?? response.data);
};

export const createTestimonial = async (testimonialData) => {
  const response = await api.post('/api/testimonials', serializeTestimonial(testimonialData));
  return normalizeTestimonial(response.data?.data ?? response.data);
};

export const updateTestimonial = async (id, testimonialData) => {
  const response = await api.put(`/api/testimonials/${id}`, buildPartial(testimonialData));
  return normalizeTestimonial(response.data?.data ?? response.data);
};

export const deleteTestimonial = async (id) => {
  const response = await api.delete(`/api/testimonials/${id}`);
  return response.data?.data ?? response.data;
};

export const publishTestimonial = async (id) => {
  return updateTestimonial(id, { status: 'Published' });
};

export const unpublishTestimonial = async (id) => {
  return updateTestimonial(id, { status: 'Draft' });
};

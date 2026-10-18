import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';
import {
  normalizeCaseStudy,
  serializeCaseStudy,
  contentStatusToApi,
} from '../utils/contractMap';

// Partial payload builder so status-only updates (publish/unpublish) don't need
// to resend every field.
const buildPartial = (data = {}) => {
  const payload = {};
  if (data.projectId !== undefined) payload.projectId = data.projectId;
  if (data.title !== undefined) payload.title = data.title;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.challenge !== undefined) payload.challenge = data.challenge;
  if (data.solution !== undefined) payload.solution = data.solution;
  if (data.outcome !== undefined) payload.outcome = data.outcome;
  if (data.coverImage !== undefined || data.featuredImage !== undefined) {
    payload.coverImage = data.coverImage ?? data.featuredImage;
  }
  if (data.status !== undefined) payload.status = contentStatusToApi(data.status);
  if (data.tags !== undefined) {
    payload.tags = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags;
  }
  if (data.publishedAt != null || data.publishedDate != null) {
    payload.publishedAt = data.publishedAt ?? data.publishedDate;
  }
  return payload;
};

export const getCaseStudies = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = mockDb.dbGetCaseStudies();
    return { caseStudies: list, total: list.length };
  }

  const query = { ...params };
  if (query.status) query.status = contentStatusToApi(query.status);

  const response = await api.get('/api/case-studies', { params: query });
  const raw = response.data;
  const list = raw?.data ?? raw?.caseStudies ?? (Array.isArray(raw) ? raw : []);
  return {
    caseStudies: list.map(normalizeCaseStudy),
    total: raw?.meta?.total ?? raw?.total ?? list.length,
  };
};

export const getCaseStudy = async (id) => {
  if (USE_MOCK) {
    const caseStudy = mockDb.dbGetCaseStudy(id);
    if (!caseStudy) throw new Error('Case study tidak ditemukan.');
    return caseStudy;
  }
  const response = await api.get(`/api/case-studies/${id}`);
  return normalizeCaseStudy(response.data?.data ?? response.data);
};

export const createCaseStudy = async (data) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveCaseStudy(data);
  }
  const response = await api.post('/api/case-studies', serializeCaseStudy(data));
  return normalizeCaseStudy(response.data?.data ?? response.data);
};

export const updateCaseStudy = async (id, data) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveCaseStudy({ ...data, id });
  }
  const response = await api.put(`/api/case-studies/${id}`, buildPartial(data));
  return normalizeCaseStudy(response.data?.data ?? response.data);
};

export const deleteCaseStudy = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockDb.dbDeleteCaseStudy(id);
    return { success: true };
  }
  const response = await api.delete(`/api/case-studies/${id}`);
  return response.data?.data ?? response.data;
};

export const publishCaseStudy = async (id) => {
  const today = new Date().toISOString().split('T')[0];
  return updateCaseStudy(id, { status: 'Published', publishedAt: today });
};

export const unpublishCaseStudy = async (id) => {
  return updateCaseStudy(id, { status: 'Draft', publishedAt: null });
};

import api from './api';
import {
  normalizeCaseStudy,
  serializeCaseStudy,
  contentStatusToApi,
  toFormData,
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
  const response = await api.get(`/api/case-studies/${id}`);
  return normalizeCaseStudy(response.data?.data ?? response.data);
};

export const createCaseStudy = async (data = {}) => {
  const { coverImageFile, ...rest } = data;
  const payload = serializeCaseStudy(rest);

  const body = coverImageFile
    ? toFormData(payload, { coverImageFile })
    : payload;

  const response = await api.post('/api/case-studies', body);
  return normalizeCaseStudy(response.data?.data ?? response.data);
};

export const updateCaseStudy = async (id, data = {}) => {
  const { coverImageFile, ...rest } = data;
  const payload = buildPartial(rest);

  const body = coverImageFile
    ? toFormData(payload, { coverImageFile })
    : payload;

  const response = await api.put(`/api/case-studies/${id}`, body);
  return normalizeCaseStudy(response.data?.data ?? response.data);
};

export const deleteCaseStudy = async (id) => {
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

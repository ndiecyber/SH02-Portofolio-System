import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';
import { normalizeDocument, docCategoryToApi } from '../utils/contractMap';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('sh02_auth_user') || 'null');
  } catch {
    return null;
  }
};

export const getDocuments = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const docs = mockDb.dbGetDocuments();
    return { documents: docs, total: docs.length };
  }

  const query = { ...params };
  if (query.category) query.category = docCategoryToApi(query.category);

  const response = await api.get('/api/documents', { params: query });
  const raw = response.data;
  const list = raw?.data ?? raw?.documents ?? (Array.isArray(raw) ? raw : []);
  return {
    documents: list.map(normalizeDocument),
    total: raw?.meta?.total ?? raw?.total ?? list.length,
  };
};

export const createDocument = async (docData = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveDocument(docData);
  }

  // Backend expects multipart/form-data with a real File object.
  let file = docData.file;
  if (!file && docData.url && typeof docData.url === 'string' && docData.url.startsWith('data:')) {
    const res = await fetch(docData.url);
    const blob = await res.blob();
    file = new File([blob], docData.fileName || 'upload', { type: blob.type });
  }

  const form = new FormData();
  form.append('projectId', docData.projectId);
  form.append('category', docCategoryToApi(docData.category));
  form.append('uploadedBy', docData.uploadedBy || getStoredUser()?.id || '');
  if (file) form.append('file', file);

  const response = await api.post('/api/documents', form);
  return normalizeDocument(response.data?.data ?? response.data);
};

export const deleteDocument = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockDb.dbDeleteDocument(id);
    return { success: true };
  }

  const response = await api.delete(`/api/documents/${id}`);
  return response.data?.data ?? response.data;
};

export const downloadDocument = async (id) => {
  if (USE_MOCK) {
    const doc = mockDb.dbGetDocument(id);
    if (!doc) throw new Error('Dokumen tidak ditemukan.');
    return { url: doc.url, fileName: doc.fileName };
  }

  const response = await api.get(`/api/documents/${id}/download`);
  const data = response.data?.data ?? response.data;
  return { url: data.downloadUrl ?? data.url, fileName: data.fileName };
};

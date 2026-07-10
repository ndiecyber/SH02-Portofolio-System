import api from './api';
import * as mockDb from '../utils/mockDb';

const USE_MOCK = true;

export const getDocuments = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let docs = mockDb.dbGetDocuments();

    // Get logged-in user to check team and assignments
    const userJson = localStorage.getItem('sh02_auth_user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (user) {
      const role = user.role;
      const isAdmin = role === 'ADMIN' || role === 'CEO';
      const isIntern = role === 'INTERN';

      if (!isAdmin) {
        if (isIntern) {
          // Intern: filter by team isolation
          docs = docs.filter((d) => d.teamId === user.team_id);
        } else {
          // PM, Developer, UIUX, QA: filter by assigned projects
          const assignedProjects = user.assignedProjects || [];
          docs = docs.filter((d) => assignedProjects.includes(d.projectId));
        }
      }
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      docs = docs.filter(
        (d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
      );
    }

    if (params.category) {
      docs = docs.filter((d) => d.category === params.category);
    }

    if (params.projectId) {
      docs = docs.filter((d) => d.projectId === params.projectId);
    }

    return {
      documents: docs,
      total: docs.length
    };
  }

  const response = await api.get('/api/documents', { params });
  return response.data;
};

export const createDocument = async (docData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Auto-populate uploader's name
    const userJson = localStorage.getItem('sh02_auth_user');
    const user = userJson ? JSON.parse(userJson) : null;
    const uploadedBy = user ? user.name : 'Unknown';

    const payload = {
      ...docData,
      uploadedBy
    };
    return mockDb.dbSaveDocument(payload);
  }

  // multipart upload usually, but we keep it mock/json for simplicity
  const response = await api.post('/api/documents/upload', docData);
  return response.data;
};

export const deleteDocument = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteDocument(id);
    return { success: true };
  }

  const response = await api.delete(`/api/documents/${id}`);
  return response.data;
};

export const downloadDocument = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const doc = mockDb.dbGetDocument(id);
    if (!doc) throw new Error('Dokumen tidak ditemukan.');
    
    // Simulate file download by returning file metadata & mock download url
    return {
      url: doc.url || 'data:text/plain;base64,TW9jayBmaWxlIGNvbnRlbnQ=',
      name: doc.name
    };
  }

  const response = await api.get(`/api/documents/${id}/download`);
  return response.data;
};

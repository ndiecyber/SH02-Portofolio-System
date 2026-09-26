import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';

export const getCaseStudies = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = mockDb.dbGetCaseStudies();

    // Get logged-in user to filter data
    const userJson = localStorage.getItem('sh02_auth_user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (user) {
      const role = user.role;
      const isAdmin = role === 'ADMIN' || role === 'CEO';
      const isPM = role === 'PROJECT_MANAGER';
      const isIntern = role === 'INTERN';
      const isClient = role === 'CLIENT';

      if (!isAdmin) {
        if (isClient) {
          // Client: view published only
          list = list.filter((cs) => cs.status === 'Published');
        } else if (isIntern) {
          // Intern: only see case studies associated with their team projects
          const projects = mockDb.dbGetProjects();
          const teamProjects = projects.filter((p) => p.teamId === user.team_id).map((p) => p.id);
          
          if (user.magang_tier === 'LEARNING') {
            // T1 Intern: view published team projects case studies
            list = list.filter((cs) => teamProjects.includes(cs.projectId) && cs.status === 'Published');
          } else {
            // T2/T3 Intern: view drafts + published for team projects
            list = list.filter((cs) => teamProjects.includes(cs.projectId));
          }
        } else if (isPM) {
          // PM: see case studies of assigned projects only
          const assignedIds = user.assignedProjects || [];
          list = list.filter((cs) => assignedIds.includes(cs.projectId));
        } else {
          // Others (Dev, UIUX, QA): generally no access or read-only assigned drafts
          const assignedIds = user.assignedProjects || [];
          list = list.filter((cs) => assignedIds.includes(cs.projectId) && cs.status === 'Published');
        }
      }
    }

    if (params.status) {
      list = list.filter((cs) => cs.status === params.status);
    }
    
    if (params.projectId) {
      list = list.filter((cs) => cs.projectId === params.projectId);
    }

    return {
      caseStudies: list,
      total: list.length
    };
  }

  const response = await api.get('/api/case-studies', { params });
  const raw = response.data;
  if (Array.isArray(raw)) {
    return { caseStudies: raw, total: raw.length };
  }
  if (Array.isArray(raw?.data)) {
    return {
      caseStudies: raw.data,
      total: raw.meta?.total ?? raw.total ?? raw.data.length,
    };
  }
  if (raw?.caseStudies) {
    return raw;
  }
  return { caseStudies: [], total: 0 };
};

export const getCaseStudy = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const caseStudy = mockDb.dbGetCaseStudy(id);
    if (!caseStudy) throw new Error('Case study tidak ditemukan.');
    return caseStudy;
  }

  const response = await api.get(`/api/case-studies/${id}`);
  return response.data?.data ?? response.data;
};

export const createCaseStudy = async (data) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveCaseStudy(data);
  }

  const response = await api.post('/api/case-studies', data);
  return response.data?.data ?? response.data;
};

export const updateCaseStudy = async (id, data) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveCaseStudy({ ...data, id });
  }

  const response = await api.put(`/api/case-studies/${id}`, data);
  return response.data?.data ?? response.data;
};

export const deleteCaseStudy = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteCaseStudy(id);
    return { success: true };
  }

  const response = await api.delete(`/api/case-studies/${id}`);
  return response.data?.data ?? response.data;
};

export const publishCaseStudy = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const cs = mockDb.dbGetCaseStudy(id);
    if (!cs) throw new Error('Case study tidak ditemukan.');
    cs.status = 'Published';
    cs.publishedDate = new Date().toISOString().split('T')[0];
    return mockDb.dbSaveCaseStudy(cs);
  }

  const response = await api.put(`/api/case-studies/${id}/publish`);
  return response.data?.data ?? response.data;
};

export const unpublishCaseStudy = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const cs = mockDb.dbGetCaseStudy(id);
    if (!cs) throw new Error('Case study tidak ditemukan.');
    cs.status = 'Draft';
    cs.publishedDate = null;
    return mockDb.dbSaveCaseStudy(cs);
  }

  const response = await api.put(`/api/case-studies/${id}/unpublish`);
  return response.data?.data ?? response.data;
};

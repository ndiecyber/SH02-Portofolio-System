import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';

export const getTeamMembers = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let members = mockDb.dbGetTeamMembers();

    // Enforce team-based isolation for interns
    const userJson = localStorage.getItem('sh02_auth_user');
    const user = userJson ? JSON.parse(userJson) : null;
    if (user && user.role === 'INTERN') {
      members = members.filter((m) => m.team_id === user.team_id || m.id === user.id);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      members = members.filter(
        (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      );
    }

    if (params.role) {
      members = members.filter((m) => m.role === params.role);
    }

    if (params.department) {
      members = members.filter((m) => m.department === params.department);
    }

    return {
      members,
      total: members.length
    };
  }

  try {
    const response = await api.get('/api/team-members', { params });
    const raw = response.data;
    if (Array.isArray(raw)) return { members: raw, total: raw.length };
    if (Array.isArray(raw?.data)) return { members: raw.data, total: raw.meta?.total ?? raw.total ?? raw.data.length };
    if (raw?.members) return raw;
    return { members: [], total: 0 };
  } catch (err) {
    // If endpoint doesn't exist, try fallback to /api/users
    try {
      const uRes = await api.get('/api/users');
      const uRaw = uRes.data?.data ?? uRes.data?.users ?? uRes.data ?? [];
      if (Array.isArray(uRaw)) return { members: uRaw, total: uRaw.length };
    } catch {
      // ignore fallback error
    }
    throw err;
  }
};

export const getTeamMember = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const member = mockDb.dbGetTeamMember(id);
    if (!member) throw new Error('Anggota tim tidak ditemukan.');
    return member;
  }

  const response = await api.get(`/api/team-members/${id}`);
  return response.data?.data ?? response.data;
};

export const createTeamMember = async (memberData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveTeamMember(memberData);
  }

  const response = await api.post('/api/team-members', memberData);
  return response.data?.data ?? response.data;
};

export const updateTeamMember = async (id, memberData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveTeamMember({ ...memberData, id });
  }

  const response = await api.put(`/api/team-members/${id}`, memberData);
  return response.data?.data ?? response.data;
};

export const deleteTeamMember = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteTeamMember(id);
    return { success: true };
  }

  const response = await api.delete(`/api/team-members/${id}`);
  return response.data?.data ?? response.data;
};

export const getTeams = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockDb.dbGetTeams();
  }

  const response = await api.get('/api/teams');
  return response.data?.data ?? response.data;
};

export const createTeam = async (teamData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveTeam(teamData);
  }

  const response = await api.post('/api/teams', teamData);
  return response.data?.data ?? response.data;
};

export const updateTeam = async (id, teamData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveTeam({ ...teamData, id });
  }

  const response = await api.put(`/api/teams/${id}`, teamData);
  return response.data?.data ?? response.data;
};

export const deleteTeam = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteTeam(id);
    return { success: true };
  }

  const response = await api.delete(`/api/teams/${id}`);
  return response.data?.data ?? response.data;
};

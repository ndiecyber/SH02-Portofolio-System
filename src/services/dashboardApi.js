import api from './api';
import * as mockDb from '../utils/mockDb';

const USE_MOCK = true;

export const getDashboardSummary = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbGetDashboardStats().summary;
  }

  const response = await api.get('/api/statistics/summary');
  return response.data;
};

export const getProjectsOverview = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Line chart data over 6 months
    // Let's generate a list of last 6 months with real projects totals
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, idx) => {
      // Mock trends
      return {
        name: m,
        'Total Projects': 2 + idx,
        'Completed': idx > 2 ? idx - 1 : 0,
        'In Progress': 2 + idx - (idx > 2 ? idx - 1 : 0)
      };
    });
  }

  const response = await api.get('/api/projects/overview');
  return response.data;
};

export const getProjectsByCategory = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const projects = mockDb.dbGetProjects();
    const categories = ['Web Dev', 'Mobile Dev', 'System Dev', 'UI/UX', 'Other'];
    
    return categories.map(cat => {
      const count = projects.filter(p => p.category === cat).length;
      return {
        name: cat,
        value: count
      };
    }).filter(item => item.value > 0);
  }

  const response = await api.get('/api/projects/by-category');
  return response.data;
};

export const getTopTechnologies = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const projects = mockDb.dbGetProjects();
    
    // Count tech occurrences
    const counts = {};
    projects.forEach(p => {
      p.technologies?.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    // Format for recharts
    const list = Object.keys(counts).map(name => ({
      name,
      percentage: Math.round((counts[name] / projects.length) * 100)
    }));

    return list.sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  }

  const response = await api.get('/api/technologies/top');
  return response.data;
};

export const getClientSatisfaction = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockDb.dbGetDashboardStats().clientSatisfaction;
  }

  const response = await api.get('/api/client-satisfaction');
  return response.data;
};

export const getRecentProjects = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const projects = mockDb.dbGetProjects();
    // Return last 5 projects
    return projects.slice(0, 5);
  }

  const response = await api.get('/api/projects/recent');
  return response.data;
};

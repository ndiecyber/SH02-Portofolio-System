import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';

// Short in-memory cache to prevent multiple parallel calls hitting the server simultaneously
let cachedDashboardPromise = null;
let cachedDashboardTime = 0;

const fetchDashboardData = async () => {
  const now = Date.now();
  if (cachedDashboardPromise && (now - cachedDashboardTime < 5000)) {
    return cachedDashboardPromise;
  }
  cachedDashboardTime = now;
  cachedDashboardPromise = api.get('/api/dashboard/')
    .then((res) => res.data?.data ?? res.data)
    .catch((err) => {
      cachedDashboardPromise = null;
      throw err;
    });
  return cachedDashboardPromise;
};

export const getDashboardSummary = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbGetDashboardStats().summary;
  }

  try {
    const data = await fetchDashboardData();
    if (data?.summary) {
      return data.summary;
    }
    return data;
  } catch (error) {
    console.warn('GET /api/dashboard/ failed, using mock fallback:', error);
    return mockDb.dbGetDashboardStats().summary;
  }
};

export const getProjectsOverview = async () => {
  const getMockOverview = () => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    return months.map((m, idx) => ({
      name: m,
      'Total Projects': 2 + idx,
      'Completed': idx > 2 ? idx - 1 : 0,
      'In Progress': 2 + idx - (idx > 2 ? idx - 1 : 0)
    }));
  };

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMockOverview();
  }

  try {
    const data = await fetchDashboardData();
    const trendList = Array.isArray(data?.timelineTrend) ? data.timelineTrend : [];
    
    // Generate a 6-month timeline window up to current month (e.g., 2026-04 to 2026-09)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${y}-${m}`;
      const label = `${monthNames[d.getMonth()]} ${String(y).slice(-2)}`;

      const match = trendList.find((t) => t.month === key);
      if (match) {
        result.push({
          name: label,
          'Total Projects': match.total,
          'Completed': match.completed,
          'In Progress': match.inProgress,
        });
      } else if (i === 0 && trendList.length > 0) {
        // Use latest available trend item if month format differs
        const latest = trendList[trendList.length - 1];
        result.push({
          name: label,
          'Total Projects': latest.total,
          'Completed': latest.completed,
          'In Progress': latest.inProgress,
        });
      } else {
        // Prior months leading up to the project totals
        result.push({
          name: label,
          'Total Projects': Math.max(0, (data?.summary?.totalProjects || 5) - i),
          'Completed': Math.max(0, (data?.summary?.completedProjects || 1) - Math.floor(i / 2)),
          'In Progress': Math.max(0, (data?.summary?.inProgressProjects || 2) - Math.floor(i / 3)),
        });
      }
    }
    return result;
  } catch (error) {
    console.warn('GET /api/dashboard/ for overview failed, using mock fallback:', error);
    return getMockOverview();
  }
};

export const getProjectsByCategory = async () => {
  const getMockCategory = () => {
    const projects = mockDb.dbGetProjects();
    const categories = ['Web Dev', 'Mobile Dev', 'System Dev', 'UI/UX', 'Other'];
    return categories.map(cat => {
      const count = projects.filter(p => p.category === cat).length;
      return {
        name: cat,
        value: count
      };
    }).filter(item => item.value > 0);
  };

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getMockCategory();
  }

  try {
    const data = await fetchDashboardData();
    if (Array.isArray(data?.projectsByCategory) && data.projectsByCategory.length > 0) {
      return data.projectsByCategory
        .filter((c) => (c.count || 0) > 0)
        .map((c) => ({
          name: c.serviceName,
          value: c.count,
        }));
    }
    return getMockCategory();
  } catch (error) {
    console.warn('GET /api/dashboard/ for category failed, using mock fallback:', error);
    return getMockCategory();
  }
};

export const getTopTechnologies = async () => {
  const getMockTech = () => {
    const projects = mockDb.dbGetProjects();
    const counts = {};
    projects.forEach(p => {
      p.technologies?.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    const list = Object.keys(counts).map(name => ({
      name,
      percentage: Math.round((counts[name] / projects.length) * 100)
    }));
    return list.sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  };

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getMockTech();
  }

  try {
    const data = await fetchDashboardData();
    if (Array.isArray(data?.topTechnologies) && data.topTechnologies.length > 0) {
      // Deduplicate by name if backend has duplicate technology names
      const techMap = new Map();
      data.topTechnologies.forEach((t) => {
        const name = (t.technologyName || t.name || '').trim();
        if (!name) return;
        const pct = t.usagePercentage ?? t.percentage ?? 0;
        if (techMap.has(name)) {
          techMap.set(name, Math.max(techMap.get(name), pct));
        } else {
          techMap.set(name, pct);
        }
      });

      return Array.from(techMap.entries())
        .map(([name, percentage]) => ({ name, percentage }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);
    }
    return getMockTech();
  } catch (error) {
    console.warn('GET /api/dashboard/ for technologies failed, using mock fallback:', error);
    return getMockTech();
  }
};

export const getClientSatisfaction = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockDb.dbGetDashboardStats().clientSatisfaction;
  }

  try {
    // Attempt to calculate precise rating from actual published testimonials
    let testimonials = [];
    try {
      const res = await api.get('/api/testimonials/?status=published');
      testimonials = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    } catch {
      // Fall through to dashboard summary if testimonials endpoint unavailable
    }

    if (testimonials.length > 0) {
      const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let sum = 0;
      testimonials.forEach((t) => {
        const score = Math.round(Number(t.rating) || 5);
        const clamped = Math.max(1, Math.min(5, score));
        breakdown[clamped] = (breakdown[clamped] || 0) + 1;
        sum += Number(t.rating) || 5;
      });

      const avg = sum / testimonials.length;
      return {
        rating: avg.toFixed(1),
        reviewsCount: testimonials.length,
        breakdown,
      };
    }

    // Fallback to dashboard summary clientSatisfaction
    const data = await fetchDashboardData();
    if (data?.clientSatisfaction) {
      const avg = Number(data.clientSatisfaction.averageRating || 4);
      return {
        rating: avg.toFixed(1),
        reviewsCount: 1,
        breakdown: {
          5: avg >= 4.5 ? 1 : 0,
          4: avg >= 3.5 && avg < 4.5 ? 1 : 0,
          3: avg >= 2.5 && avg < 3.5 ? 1 : 0,
          2: 0,
          1: 0,
        },
      };
    }
    return mockDb.dbGetDashboardStats().clientSatisfaction;
  } catch (error) {
    console.warn('GET /api/dashboard/ for satisfaction failed, using mock fallback:', error);
    return mockDb.dbGetDashboardStats().clientSatisfaction;
  }
};

export const getRecentProjects = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const projects = mockDb.dbGetProjects();
    return projects.slice(0, 5);
  }

  try {
    // First try fetching real projects from /api/projects/ for complete progressPercentage & metadata
    let projectsList = [];
    try {
      const res = await api.get('/api/projects/');
      const raw = res.data?.data ?? res.data;
      if (Array.isArray(raw)) {
        projectsList = raw;
      }
    } catch {
      // Ignore and fallback to /api/dashboard/
    }

    // If /api/projects/ returned records, map them
    if (projectsList.length > 0) {
      return projectsList.slice(0, 5).map((p) => {
        const rawStatus = (p.status || '').toLowerCase();
        let displayStatus = 'Planning';
        if (rawStatus === 'completed') displayStatus = 'Completed';
        else if (rawStatus === 'in progress' || rawStatus === 'in_progress') displayStatus = 'In Progress';
        else if (rawStatus === 'on hold' || rawStatus === 'on_hold') displayStatus = 'On Hold';

        return {
          id: p.id,
          name: p.name,
          client: p.clientName || p.client?.name || p.client || 'Client',
          status: displayStatus,
          progress: Number(p.progressPercentage ?? (displayStatus === 'Completed' ? 100 : displayStatus === 'In Progress' ? 65 : 20)),
          thumbnail: p.thumbnail,
        };
      });
    }

    // Fallback to /api/dashboard/ recentProjects
    const data = await fetchDashboardData();
    if (Array.isArray(data?.recentProjects) && data.recentProjects.length > 0) {
      return data.recentProjects.map((p) => {
        const rawStatus = (p.status || '').toLowerCase();
        let displayStatus = 'Planning';
        let defaultProgress = 20;

        if (rawStatus === 'completed') {
          displayStatus = 'Completed';
          defaultProgress = 100;
        } else if (rawStatus === 'in progress' || rawStatus === 'in_progress') {
          displayStatus = 'In Progress';
          defaultProgress = 65;
        } else if (rawStatus === 'on hold' || rawStatus === 'on_hold') {
          displayStatus = 'On Hold';
          defaultProgress = 35;
        }

        return {
          id: p.id,
          name: p.name,
          client: p.clientName || p.client || 'Client',
          status: displayStatus,
          progress: Number(p.progressPercentage ?? defaultProgress),
          thumbnail: p.thumbnail,
        };
      });
    }

    const projects = mockDb.dbGetProjects();
    return projects.slice(0, 5);
  } catch (error) {
    console.warn('GET /api/dashboard/ for recent projects failed, using mock fallback:', error);
    const projects = mockDb.dbGetProjects();
    return projects.slice(0, 5);
  }
};

import {
  INITIAL_PROJECTS,
  INITIAL_CASE_STUDIES,
  INITIAL_CLIENT_SATISFACTION,
  INITIAL_TECHNOLOGIES,
  INITIAL_TEAMS,
  INITIAL_TEAM_MEMBERS
} from '../config/constants';

const DB_KEYS = {
  PROJECTS: 'sh02_db_projects',
  CASE_STUDIES: 'sh02_db_case_studies',
  CLIENT_SATISFACTION: 'sh02_db_client_satisfaction',
  TECHNOLOGIES: 'sh02_db_technologies',
  TEAMS: 'sh02_db_teams',
  TEAM_MEMBERS: 'sh02_db_team_members'
};

const getFromStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
};

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
};

// Initialize DB if not present
export const initMockDb = () => {
  getFromStorage(DB_KEYS.PROJECTS, INITIAL_PROJECTS);
  getFromStorage(DB_KEYS.CASE_STUDIES, INITIAL_CASE_STUDIES);
  getFromStorage(DB_KEYS.CLIENT_SATISFACTION, INITIAL_CLIENT_SATISFACTION);
  getFromStorage(DB_KEYS.TECHNOLOGIES, INITIAL_TECHNOLOGIES);
  getFromStorage(DB_KEYS.TEAMS, INITIAL_TEAMS);
  getFromStorage(DB_KEYS.TEAM_MEMBERS, INITIAL_TEAM_MEMBERS);
};

// PROJECTS
export const dbGetProjects = () => getFromStorage(DB_KEYS.PROJECTS, INITIAL_PROJECTS);

export const dbGetProject = (id) => {
  const projects = dbGetProjects();
  return projects.find(p => p.id === id) || null;
};

export const dbSaveProject = (project) => {
  const projects = dbGetProjects();
  let updatedProjects;
  
  if (project.id) {
    // Edit existing
    updatedProjects = projects.map(p => p.id === project.id ? { ...p, ...project } : p);
  } else {
    // Create new
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      progress: project.progress || 0,
      progressNotes: project.progressNotes || '',
      teamMembers: project.teamMembers || [],
      technologies: project.technologies || []
    };
    updatedProjects = [newProject, ...projects];
  }
  
  setToStorage(DB_KEYS.PROJECTS, updatedProjects);
  return project.id ? project : updatedProjects[0];
};

export const dbDeleteProject = (id) => {
  const projects = dbGetProjects();
  const filtered = projects.filter(p => p.id !== id);
  setToStorage(DB_KEYS.PROJECTS, filtered);
  
  // Clean up case studies associated with this project
  const caseStudies = dbGetCaseStudies();
  const cleanCaseStudies = caseStudies.filter(cs => cs.projectId !== id);
  setToStorage(DB_KEYS.CASE_STUDIES, cleanCaseStudies);
};

// CASE STUDIES
export const dbGetCaseStudies = () => getFromStorage(DB_KEYS.CASE_STUDIES, INITIAL_CASE_STUDIES);

export const dbGetCaseStudy = (id) => {
  const list = dbGetCaseStudies();
  return list.find(cs => cs.id === id) || null;
};

export const dbSaveCaseStudy = (caseStudy) => {
  const list = dbGetCaseStudies();
  let updatedList;
  
  if (caseStudy.id) {
    updatedList = list.map(cs => cs.id === caseStudy.id ? { ...cs, ...caseStudy } : cs);
  } else {
    const newCS = {
      ...caseStudy,
      id: `cs-${Date.now()}`,
      publishedDate: caseStudy.status === 'Published' ? new Date().toISOString().split('T')[0] : null
    };
    updatedList = [newCS, ...list];
  }
  
  setToStorage(DB_KEYS.CASE_STUDIES, updatedList);
  return caseStudy.id ? caseStudy : updatedList[0];
};

export const dbDeleteCaseStudy = (id) => {
  const list = dbGetCaseStudies();
  const filtered = list.filter(cs => cs.id !== id);
  setToStorage(DB_KEYS.CASE_STUDIES, filtered);
};

// METRICS & STATS
export const dbGetDashboardStats = () => {
  const projects = dbGetProjects();
  const satisfaction = getFromStorage(DB_KEYS.CLIENT_SATISFACTION, INITIAL_CLIENT_SATISFACTION);
  
  const total = projects.length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const inProgress = projects.filter(p => p.status === 'In Progress').length;
  
  // Unique clients count
  const clients = new Set(projects.map(p => p.client));
  const totalClients = clients.size;

  return {
    summary: {
      totalProjects: total,
      completedProjects: completed,
      inProgressProjects: inProgress,
      totalClients: totalClients,
      satisfaction: satisfaction.rating
    },
    clientSatisfaction: satisfaction
  };
};

export const dbGetTechnologies = () => getFromStorage(DB_KEYS.TECHNOLOGIES, INITIAL_TECHNOLOGIES);
export const dbGetTeams = () => getFromStorage(DB_KEYS.TEAMS, INITIAL_TEAMS);
export const dbGetTeamMembers = () => getFromStorage(DB_KEYS.TEAM_MEMBERS, INITIAL_TEAM_MEMBERS);

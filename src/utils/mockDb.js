import {
  INITIAL_PROJECTS,
  INITIAL_CASE_STUDIES,
  INITIAL_CLIENT_SATISFACTION,
  INITIAL_TECHNOLOGIES,
  INITIAL_TEAMS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_DOCUMENTS,
  INITIAL_SETTINGS
} from '../config/constants';

const DB_KEYS = {
  PROJECTS: 'sh02_db_projects',
  CASE_STUDIES: 'sh02_db_case_studies',
  CLIENT_SATISFACTION: 'sh02_db_client_satisfaction',
  TECHNOLOGIES: 'sh02_db_technologies',
  TEAMS: 'sh02_db_teams',
  TEAM_MEMBERS: 'sh02_db_team_members',
  SERVICES: 'sh02_db_services',
  TESTIMONIALS: 'sh02_db_testimonials',
  DOCUMENTS: 'sh02_db_documents',
  SETTINGS: 'sh02_db_settings',
  USERS: 'sh02_db_users',
  TASKS: 'sh02_db_tasks'
};

const INITIAL_USERS = [
  {
    id: 'user-ceo',
    name: 'Yogi Nugraha (CEO)',
    email: 'admin@lexa.com',
    password: 'admin123',
    role: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: [],
    team_id: null,
    status: 'Active'
  },
  {
    id: 'mem-1',
    name: 'Alex Johnson (PM)',
    email: 'pm@lexa.com',
    password: 'pm1234',
    role: 'PROJECT_MANAGER',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: ['proj-1', 'proj-2', 'proj-5'],
    team_id: 'team-a',
    status: 'Active'
  },
  {
    id: 'mem-2',
    name: 'Sarah Chen (Dev)',
    email: 'dev@lexa.com',
    password: 'dev1234',
    role: 'DEVELOPER',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: ['proj-1', 'proj-5'],
    team_id: 'team-a',
    status: 'Active'
  },
  {
    id: 'mem-4',
    name: 'Elena Rostova (UI/UX)',
    email: 'designer@lexa.com',
    password: 'design123',
    role: 'UIUX_DESIGNER',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: ['proj-1', 'proj-4'],
    team_id: 'team-a',
    status: 'Active'
  },
  {
    id: 'mem-5',
    name: 'Budi Santoso (QA)',
    email: 'qa@lexa.com',
    password: 'qa1234',
    role: 'QA_TESTER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: ['proj-1', 'proj-2'],
    team_id: 'team-b',
    status: 'Active'
  },
  {
    id: 'user-client',
    name: 'Urban Space (Client)',
    email: 'client@lexa.com',
    password: 'client123',
    role: 'CLIENT',
    clientName: 'Urban Space Properties',
    avatar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: ['proj-4'],
    team_id: null,
    status: 'Active'
  },
  {
    id: 'mem-6',
    name: 'Dewi Lestari (Intern T1)',
    email: 'learning.intern@lexa.com',
    password: 'intern123',
    role: 'INTERN',
    magang_tier: 'LEARNING',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: ['proj-3'],
    team_id: 'team-c',
    status: 'Active'
  },
  {
    id: 'mem-7',
    name: 'Dewi Lestari (Intern T2)',
    email: 'apprentice.intern@lexa.com',
    password: 'intern123',
    role: 'INTERN',
    magang_tier: 'APPRENTICE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: ['proj-3'],
    team_id: 'team-c',
    status: 'Active'
  },
  {
    id: 'mem-8',
    name: 'Dewi Lestari (Intern T3)',
    email: 'junior.intern@lexa.com',
    password: 'intern123',
    role: 'INTERN',
    magang_tier: 'JUNIOR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedProjects: ['proj-3'],
    team_id: 'team-c',
    status: 'Active'
  }
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Desain Layout Homepage E-Commerce',
    description: 'Membuat visual mockup untuk bagian hero banner, katalog produk, dan footer di Figma.',
    projectId: 'proj-1',
    assigneeId: 'mem-4', // Elena UI/UX
    dueDate: '2026-05-15',
    priority: 'High',
    status: 'Done'
  },
  {
    id: 'task-2',
    title: 'Slicing Frontend Landing Page',
    description: 'Implementasi desain Figma ke dalam komponen React dengan transisi animasi CSS yang halus.',
    projectId: 'proj-1',
    assigneeId: 'mem-2', // Sarah Chen Dev
    dueDate: '2026-05-18',
    priority: 'High',
    status: 'Done'
  },
  {
    id: 'task-3',
    title: 'Integrasi Payment Gateway',
    description: 'Menghubungkan API Midtrans untuk metode pembayaran Credit Card dan Virtual Account.',
    projectId: 'proj-1',
    assigneeId: 'mem-3', // Rudy Backend
    dueDate: '2026-05-19',
    priority: 'High',
    status: 'Done'
  },
  {
    id: 'task-4',
    title: 'Integrasi Google Maps SDK di Flutter',
    description: 'Menambahkan fitur pelacakan armada secara real-time pada peta interaktif aplikasi driver.',
    projectId: 'proj-2',
    assigneeId: 'mem-2', // Sarah Chen Dev
    dueDate: '2026-07-20',
    priority: 'High',
    status: 'In Progress'
  },
  {
    id: 'task-5',
    title: 'Penulisan Dokumen QA Test Cases',
    description: 'Menyusun daftar uji validasi fungsionalitas transaksi checkout dan pelacakan kurir logistik.',
    projectId: 'proj-2',
    assigneeId: 'mem-5', // Budi QA
    dueDate: '2026-07-25',
    priority: 'Medium',
    status: 'To Do'
  },
  {
    id: 'task-6',
    title: 'Setup Migrasi Database Payroll',
    description: 'Membuat schema tabel payroll, gaji pokok, bonus insentif, dan riwayat mutasi bank di PostgreSQL.',
    projectId: 'proj-3',
    assigneeId: 'mem-3', // Rudy Backend
    dueDate: '2026-08-05',
    priority: 'High',
    status: 'In Progress'
  },
  {
    id: 'task-7',
    title: 'Penyusunan Modul Training Onboarding',
    description: 'Membaca dokumentasi arsitektur REST API dan membuat ringkasan rangkuman modul onboarding.',
    projectId: 'proj-3',
    assigneeId: 'mem-6', // Dewi Lestari Intern
    dueDate: '2026-07-15',
    priority: 'Low',
    status: 'In Review'
  }
];

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
  getFromStorage(DB_KEYS.SERVICES, INITIAL_SERVICES);
  getFromStorage(DB_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  getFromStorage(DB_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  getFromStorage(DB_KEYS.SETTINGS, INITIAL_SETTINGS);
  getFromStorage(DB_KEYS.USERS, INITIAL_USERS);
  getFromStorage(DB_KEYS.TASKS, INITIAL_TASKS);
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

export const dbGetTechnology = (id) => {
  const list = dbGetTechnologies();
  return list.find(t => t.id === id) || null;
};

export const dbSaveTechnology = (tech) => {
  const list = dbGetTechnologies();
  let updatedList;
  if (tech.id) {
    updatedList = list.map(t => t.id === tech.id ? { ...t, ...tech } : t);
  } else {
    const newTech = {
      ...tech,
      id: `tech-${Date.now()}`
    };
    updatedList = [...list, newTech];
  }
  setToStorage(DB_KEYS.TECHNOLOGIES, updatedList);
  return tech.id ? tech : updatedList[updatedList.length - 1];
};

export const dbDeleteTechnology = (id) => {
  const list = dbGetTechnologies();
  const filtered = list.filter(t => t.id !== id);
  setToStorage(DB_KEYS.TECHNOLOGIES, filtered);
};

export const dbGetTeams = () => getFromStorage(DB_KEYS.TEAMS, INITIAL_TEAMS);

export const dbGetTeamMembers = () => getFromStorage(DB_KEYS.TEAM_MEMBERS, INITIAL_TEAM_MEMBERS);

export const dbGetTeamMember = (id) => {
  const list = dbGetTeamMembers();
  return list.find(m => m.id === id) || null;
};

export const dbSaveTeamMember = (member) => {
  const list = dbGetTeamMembers();
  let updatedList;
  if (member.id) {
    updatedList = list.map(m => m.id === member.id ? { ...m, ...member } : m);
  } else {
    const newMember = {
      ...member,
      id: `mem-${Date.now()}`,
      status: member.status || 'Active'
    };
    updatedList = [...list, newMember];
  }
  setToStorage(DB_KEYS.TEAM_MEMBERS, updatedList);
  return member.id ? member : updatedList[updatedList.length - 1];
};

export const dbDeleteTeamMember = (id) => {
  const list = dbGetTeamMembers();
  const filtered = list.filter(m => m.id !== id);
  setToStorage(DB_KEYS.TEAM_MEMBERS, filtered);
};

// SERVICES
export const dbGetServices = () => getFromStorage(DB_KEYS.SERVICES, INITIAL_SERVICES);

export const dbGetService = (id) => {
  const list = dbGetServices();
  return list.find(s => s.id === id) || null;
};

export const dbSaveService = (service) => {
  const list = dbGetServices();
  let updatedList;
  if (service.id) {
    updatedList = list.map(s => s.id === service.id ? { ...s, ...service } : s);
  } else {
    const newService = {
      ...service,
      id: `srv-${Date.now()}`
    };
    updatedList = [...list, newService];
  }
  // Sort by sortOrder if available
  updatedList.sort((a, b) => (parseInt(a.sortOrder) || 99) - (parseInt(b.sortOrder) || 99));
  setToStorage(DB_KEYS.SERVICES, updatedList);
  return service.id ? service : updatedList.find(s => s.name === service.name);
};

export const dbDeleteService = (id) => {
  const list = dbGetServices();
  const filtered = list.filter(s => s.id !== id);
  setToStorage(DB_KEYS.SERVICES, filtered);
};

// TESTIMONIALS
export const dbGetTestimonials = () => getFromStorage(DB_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);

export const dbGetTestimonial = (id) => {
  const list = dbGetTestimonials();
  return list.find(t => t.id === id) || null;
};

export const dbSaveTestimonial = (testimonial) => {
  const list = dbGetTestimonials();
  let updatedList;
  if (testimonial.id) {
    updatedList = list.map(t => t.id === testimonial.id ? { ...t, ...testimonial } : t);
  } else {
    const newTestimonial = {
      ...testimonial,
      id: `test-${Date.now()}`,
      status: testimonial.status || 'Draft'
    };
    updatedList = [newTestimonial, ...list];
  }
  setToStorage(DB_KEYS.TESTIMONIALS, updatedList);
  return testimonial.id ? testimonial : updatedList[0];
};

export const dbDeleteTestimonial = (id) => {
  const list = dbGetTestimonials();
  const filtered = list.filter(t => t.id !== id);
  setToStorage(DB_KEYS.TESTIMONIALS, filtered);
};

// DOCUMENTS
export const dbGetDocuments = () => getFromStorage(DB_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);

export const dbGetDocument = (id) => {
  const list = dbGetDocuments();
  return list.find(d => d.id === id) || null;
};

export const dbSaveDocument = (doc) => {
  const list = dbGetDocuments();
  let updatedList;
  if (doc.id) {
    updatedList = list.map(d => d.id === doc.id ? { ...d, ...doc } : d);
  } else {
    const newDoc = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    updatedList = [newDoc, ...list];
  }
  setToStorage(DB_KEYS.DOCUMENTS, updatedList);
  return doc.id ? doc : updatedList[0];
};

export const dbDeleteDocument = (id) => {
  const list = dbGetDocuments();
  const filtered = list.filter(d => d.id !== id);
  setToStorage(DB_KEYS.DOCUMENTS, filtered);
};

// SETTINGS
export const dbGetSettings = () => getFromStorage(DB_KEYS.SETTINGS, INITIAL_SETTINGS);

export const dbSaveSettings = (settings) => {
  const current = dbGetSettings();
  const updated = { ...current, ...settings };
  setToStorage(DB_KEYS.SETTINGS, updated);
  return updated;
};

// USERS
export const dbGetUsers = () => getFromStorage(DB_KEYS.USERS, INITIAL_USERS);

export const dbGetUser = (id) => {
  const users = dbGetUsers();
  return users.find(u => u.id === id) || null;
};

export const dbSaveUser = (user) => {
  const users = dbGetUsers();
  let updatedUsers;
  
  if (user.id) {
    // Edit existing
    updatedUsers = users.map(u => u.id === user.id ? { ...u, ...user } : u);
  } else {
    // Create new
    const newUser = {
      ...user,
      id: `user-${Date.now()}`,
      status: user.status || 'Active',
      avatar: user.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
      assignedProjects: user.assignedProjects || [],
      team_id: user.team_id || null,
      magang_tier: user.magang_tier || null
    };
    updatedUsers = [...users, newUser];
  }
  
  setToStorage(DB_KEYS.USERS, updatedUsers);
  return user.id ? user : updatedUsers[updatedUsers.length - 1];
};

export const dbDeleteUser = (id) => {
  const users = dbGetUsers();
  const filtered = users.filter(u => u.id !== id);
  setToStorage(DB_KEYS.USERS, filtered);
};

// TEAMS CRUD
export const dbSaveTeam = (team) => {
  const teams = dbGetTeams();
  let updatedTeams;
  if (team.id) {
    updatedTeams = teams.map(t => t.id === team.id ? { ...t, ...team } : t);
  } else {
    const newTeam = {
      ...team,
      id: `team-${Date.now()}`
    };
    updatedTeams = [...teams, newTeam];
  }
  setToStorage(DB_KEYS.TEAMS, updatedTeams);
  return team.id ? team : updatedTeams[updatedTeams.length - 1];
};

export const dbDeleteTeam = (id) => {
  const teams = dbGetTeams();
  const filtered = teams.filter(t => t.id !== id);
  setToStorage(DB_KEYS.TEAMS, filtered);
  
  // Reset team_id of members in that team
  const members = dbGetTeamMembers();
  const updatedMembers = members.map(m => m.team_id === id ? { ...m, team_id: '' } : m);
  setToStorage(DB_KEYS.TEAM_MEMBERS, updatedMembers);

  // Reset team_id of users in that team
  const users = dbGetUsers();
  const updatedUsers = users.map(u => u.team_id === id ? { ...u, team_id: null } : u);
  setToStorage(DB_KEYS.USERS, updatedUsers);
};

// TASKS
export const dbGetTasks = () => getFromStorage(DB_KEYS.TASKS, INITIAL_TASKS);

export const dbSaveTask = (task) => {
  const tasks = dbGetTasks();
  let updatedTasks;
  if (task.id) {
    updatedTasks = tasks.map(t => t.id === task.id ? { ...t, ...task } : t);
  } else {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`
    };
    updatedTasks = [...tasks, newTask];
  }
  setToStorage(DB_KEYS.TASKS, updatedTasks);
  return task.id ? task : updatedTasks[updatedTasks.length - 1];
};

export const dbDeleteTask = (id) => {
  const tasks = dbGetTasks();
  const filtered = tasks.filter(t => t.id !== id);
  setToStorage(DB_KEYS.TASKS, filtered);
};


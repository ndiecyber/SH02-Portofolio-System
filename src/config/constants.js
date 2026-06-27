export const ROLES = {
  ADMIN: 'ADMIN',
  CEO: 'CEO',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  DEVELOPER: 'DEVELOPER',
  UIUX_DESIGNER: 'UIUX_DESIGNER',
  QA_TESTER: 'QA_TESTER',
  CLIENT: 'CLIENT',
  INTERN: 'INTERN'
};

export const MAGANG_TIERS = {
  LEARNING: 'LEARNING',
  APPRENTICE: 'APPRENTICE',
  JUNIOR: 'JUNIOR'
};

export const CATEGORIES = [
  'Web Dev',
  'Mobile Dev',
  'System Dev',
  'UI/UX',
  'Other'
];

export const PROJECT_STATUS = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold'
};

export const CASE_STUDY_STATUS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published'
};

export const INITIAL_TECHNOLOGIES = [
  { id: 'tech-1', name: 'React', category: 'Frontend', proficiency: 'Advanced', status: 'Active' },
  { id: 'tech-2', name: 'Vue.js', category: 'Frontend', proficiency: 'Intermediate', status: 'Active' },
  { id: 'tech-3', name: 'Laravel', category: 'Backend', proficiency: 'Advanced', status: 'Active' },
  { id: 'tech-4', name: 'Node.js', category: 'Backend', proficiency: 'Advanced', status: 'Active' },
  { id: 'tech-5', name: 'Flutter', category: 'Mobile', proficiency: 'Intermediate', status: 'Active' },
  { id: 'tech-6', name: 'Docker', category: 'DevOps', proficiency: 'Intermediate', status: 'Active' },
  { id: 'tech-7', name: 'PostgreSQL', category: 'Database', proficiency: 'Advanced', status: 'Active' }
];

export const INITIAL_TEAMS = [
  { id: 'team-a', name: 'Team Alpha (Web Dev)' },
  { id: 'team-b', name: 'Team Beta (Mobile Dev)' },
  { id: 'team-c', name: 'Team Gamma (System Dev)' }
];

export const INITIAL_TEAM_MEMBERS = [
  { id: 'mem-1', name: 'Alex Johnson', email: 'alex@lexa.com', role: 'PROJECT_MANAGER', department: 'Management', status: 'Active' },
  { id: 'mem-2', name: 'Sarah Chen', email: 'sarah@lexa.com', role: 'DEVELOPER', department: 'Frontend', status: 'Active' },
  { id: 'mem-3', name: 'Rudy Hartono', email: 'rudy@lexa.com', role: 'DEVELOPER', department: 'Backend', status: 'Active' },
  { id: 'mem-4', name: 'Elena Rostova', email: 'elena@lexa.com', role: 'UIUX_DESIGNER', department: 'Design', status: 'Active' },
  { id: 'mem-5', name: 'Budi Santoso', email: 'budi@lexa.com', role: 'QA_TESTER', department: 'QA', status: 'Active' },
  { id: 'mem-6', name: 'Dewi Lestari', email: 'dewi.intern@lexa.com', role: 'INTERN', magang_tier: 'LEARNING', team_id: 'team-a', department: 'Frontend', status: 'Active' }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'E-Commerce Marketplace Redesign',
    client: 'Lexa Retail Corp',
    description: 'Rebuilding the core e-commerce storefront with React and Node.js for high performance and premium animations.',
    category: 'Web Dev',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
    startDate: '2026-01-10',
    endDate: '2026-05-20',
    status: 'Completed',
    budget: 150000000,
    progress: 100,
    progressNotes: 'Successfully deployed frontend on Vercel and backend services on Railway. client satisfaction was outstanding.',
    teamMembers: ['mem-1', 'mem-2', 'mem-3', 'mem-4', 'mem-5'],
    teamId: 'team-a'
  },
  {
    id: 'proj-2',
    name: 'Logistics Fleet Tracking App',
    client: 'TransNasional Cargo',
    description: 'Development of a real-time mobile tracking application for cargo drivers and fleet coordinators using Flutter.',
    category: 'Mobile Dev',
    technologies: ['Flutter', 'Node.js', 'Docker'],
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=500&q=80',
    startDate: '2026-03-01',
    endDate: '2026-07-30',
    status: 'In Progress',
    budget: 220000000,
    progress: 65,
    progressNotes: 'Map integration completed. Fleet dispatch module under active testing.',
    teamMembers: ['mem-1', 'mem-5'],
    teamId: 'team-b'
  },
  {
    id: 'proj-3',
    name: 'HR & Payroll Core Platform',
    client: 'Sinergi Mega Utama',
    description: 'Enterprise internal payroll, shift planning, and employee management system with robust security audit trails.',
    category: 'System Dev',
    technologies: ['Laravel', 'PostgreSQL', 'Docker'],
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80',
    startDate: '2026-04-15',
    endDate: '2026-09-01',
    status: 'In Progress',
    budget: 180000000,
    progress: 40,
    progressNotes: 'Finished database migrations and basic auth flows. Active directory integration is under planning.',
    teamMembers: ['mem-3', 'mem-6'], // Includes Intern Dewi Lestari
    teamId: 'team-c'
  },
  {
    id: 'proj-4',
    name: 'Real Estate SaaS landing Page & UI',
    client: 'Urban Space Properties',
    description: 'UI/UX research, wireframing, and visual redesign of property listing portals.',
    category: 'UI/UX',
    technologies: ['React'],
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80',
    startDate: '2026-05-10',
    endDate: '2026-06-25',
    status: 'Completed',
    budget: 45000000,
    progress: 100,
    progressNotes: 'Figma files delivered. Landing page built and approved.',
    teamMembers: ['mem-4'],
    teamId: 'team-a'
  },
  {
    id: 'proj-5',
    name: 'IoT Home Automation Hub',
    client: 'SmartLife Systems',
    description: 'Smart dashboard development for embedded microcontrollers in home security devices.',
    category: 'System Dev',
    technologies: ['Vue.js', 'Node.js'],
    thumbnail: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80',
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    status: 'Planning',
    budget: 310000000,
    progress: 10,
    progressNotes: 'Requirements elicitation complete. Creating mock data endpoints.',
    teamMembers: ['mem-1', 'mem-2', 'mem-3'],
    teamId: 'team-c'
  }
];

export const INITIAL_CASE_STUDIES = [
  {
    id: 'cs-1',
    title: 'Transforming Retail: Redesigning E-Commerce for 200% Conversion Lift',
    slug: 'transforming-retail-ecommerce-redesign',
    projectId: 'proj-1',
    client: 'Lexa Retail Corp',
    challenge: 'The existing platform suffered from high cart abandonment rates (approx 78%) due to slow loading speeds on mobile devices and a confusing multi-step checkout workflow.',
    solution: 'We rebuilt the frontend application on Vite React and configured serverless hosting. We streamlined the checkout workflow from 5 steps into a single accordion-style checkout and integrated one-click payment options.',
    outcome: 'Page loading speed was reduced by 60%, resulting in an instant mobile bounce-rate reduction. Cart abandonment decreased to 24%, boosting overall monthly transaction conversions by 210%.',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['E-Commerce', 'React', 'UX Redesign'],
    status: 'Published',
    publishedDate: '2026-05-22'
  },
  {
    id: 'cs-2',
    title: 'Enterprise shift scheduling scaling via Web Application',
    slug: 'enterprise-shift-scheduling-scaling',
    projectId: 'proj-4',
    client: 'Urban Space Properties',
    challenge: 'Property visual assets and wireframe prototypes were previously scattered across drives, slowing down customer signoffs.',
    solution: 'Implemented a standardized SaaS landing page visual builder and consolidated Figma prototype presentations directly inside active clients dashboards.',
    outcome: 'Visual proof approval loops was shortened from 9 business days to under 48 hours.',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    tags: ['UI/UX', 'Figma', 'Landing Page'],
    status: 'Draft',
    publishedDate: null
  }
];

export const INITIAL_CLIENT_SATISFACTION = {
  rating: 4.8,
  reviewsCount: 15,
  breakdown: {
    5: 12,
    4: 2,
    3: 1,
    2: 0,
    1: 0
  }
};

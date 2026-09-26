export const ROLES = {
  ADMIN: 'ADMIN',
  DEVELOPER: 'DEVELOPER'
};

export const DEPARTMENTS = [
  'UI/UX',
  'Front End',
  'Back End',
  'QA Testing',
  'DevOps',
  'Project Management'
];


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
  { id: 'tech-1', name: 'React', category: 'Frontend', proficiency: 'Advanced', isActive: true },
  { id: 'tech-2', name: 'Vue.js', category: 'Frontend', proficiency: 'Intermediate', isActive: true },
  { id: 'tech-3', name: 'Laravel', category: 'Backend', proficiency: 'Advanced', isActive: true },
  { id: 'tech-4', name: 'Node.js', category: 'Backend', proficiency: 'Advanced', isActive: true },
  { id: 'tech-5', name: 'Flutter', category: 'Mobile', proficiency: 'Intermediate', isActive: true },
  { id: 'tech-6', name: 'Docker', category: 'DevOps', proficiency: 'Intermediate', isActive: true },
  { id: 'tech-7', name: 'PostgreSQL', category: 'Database', proficiency: 'Advanced', isActive: true }
];

export const INITIAL_TEAMS = [
  { id: 'team-a', name: 'Team Alpha (Web Dev)' },
  { id: 'team-b', name: 'Team Beta (Mobile Dev)' },
  { id: 'team-c', name: 'Team Gamma (System Dev)' }
];

export const INITIAL_TEAM_MEMBERS = [
  { id: 'mem-1', name: 'Alex Johnson', email: 'alex@lexa.com', role: 'DEVELOPER', department: 'Project Management', isActive: true },
  { id: 'mem-2', name: 'Sarah Chen', email: 'sarah@lexa.com', role: 'DEVELOPER', department: 'Front End', isActive: true },
  { id: 'mem-3', name: 'Rudy Hartono', email: 'rudy@lexa.com', role: 'DEVELOPER', department: 'Back End', isActive: true },
  { id: 'mem-4', name: 'Elena Rostova', email: 'elena@lexa.com', role: 'DEVELOPER', department: 'UI/UX', isActive: true },
  { id: 'mem-5', name: 'Budi Santoso', email: 'budi@lexa.com', role: 'DEVELOPER', department: 'QA Testing', isActive: true },
  { id: 'mem-6', name: 'Dewi Lestari', email: 'dewi.intern@lexa.com', role: 'DEVELOPER', team_id: 'team-a', department: 'Front End', isActive: true }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'E-Commerce Marketplace Redesign',
    clientName: 'Lexa Retail Corp',
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
    clientName: 'TransNasional Cargo',
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
    clientName: 'Sinergi Mega Utama',
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
    clientName: 'Urban Space Properties',
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
    clientName: 'SmartLife Systems',
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

export const INITIAL_SERVICES = [
  { id: 'srv-1', name: 'Web Development', slug: 'web-development', description: 'Membangun aplikasi web berkinerja tinggi, aman, dan responsif dengan arsitektur modern.', icon: 'Code', sortOrder: 1, status: 'Active' },
  { id: 'srv-2', name: 'Mobile App Development', slug: 'mobile-app-development', description: 'Pengembangan aplikasi mobile native & cross-platform untuk iOS dan Android.', icon: 'Smartphone', sortOrder: 2, status: 'Active' },
  { id: 'srv-3', name: 'UI/UX Design', slug: 'ui-ux-design', description: 'Riset pengguna, pembuatan wireframe, prototyping, dan desain antarmuka yang memukau.', icon: 'Palette', sortOrder: 3, status: 'Active' },
  { id: 'srv-4', name: 'System Integration', slug: 'system-integration', description: 'Integrasi sistem enterprise, API development, migrasi database, dan optimasi backend.', icon: 'Cpu', sortOrder: 4, status: 'Active' }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: 'test-1',
    clientName: 'Lexa Retail Corp',
    quote: 'LEXA mengirimkan platform e-commerce kami tepat waktu dengan kualitas kode yang luar biasa. UI barunya sangat cantik dan konversi penjualan kami meningkat tajam!',
    rating: 5,
    projectId: 'proj-1',
    status: 'Published'
  },
  {
    id: 'test-2',
    clientName: 'TransNasional Cargo',
    quote: 'Aplikasi pelacakan armada real-time sangat membantu operasional pengemudi kami di lapangan. Tim Flutter LEXA sangat kompeten dan responsif terhadap masukan.',
    rating: 4,
    projectId: 'proj-2',
    status: 'Published'
  },
  {
    id: 'test-3',
    clientName: 'Sinergi Mega Utama',
    quote: 'Integrasi payroll sistem dengan database internal kami berjalan lancar dengan sistem keamanan audit trails yang kokoh. Kerja sama yang luar biasa.',
    rating: 5,
    projectId: 'proj-3',
    status: 'Draft'
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    fileName: 'Spesifikasi_API_V1.pdf',
    category: 'API Spec',
    size: '1.2 MB',
    uploadDate: '2026-03-15',
    uploadedBy: 'Sarah Chen',
    url: 'data:application/pdf;base64,JVBERi0xLjQKJdOl...',
    projectId: 'proj-1',
    teamId: 'team-a'
  },
  {
    id: 'doc-2',
    fileName: 'Figma_UI_Mockup_Final.fig',
    category: 'Design',
    size: '4.5 MB',
    uploadDate: '2026-04-20',
    uploadedBy: 'Elena Rostova',
    url: 'data:application/octet-stream;base64,RklHTUEy...',
    projectId: 'proj-2',
    teamId: 'team-b'
  },
  {
    id: 'doc-3',
    fileName: 'Database_Schema_Diagram.png',
    category: 'Architecture',
    size: '850 KB',
    uploadDate: '2026-05-10',
    uploadedBy: 'Rudy Hartono',
    url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    projectId: 'proj-3',
    teamId: 'team-c'
  }
];

export const INITIAL_SETTINGS = {
  companyName: 'LEXA Software House',
  companyEmail: 'info@lexa.com',
  companyPhone: '+62 21 5555 1234',
  companyAddress: 'Gedung Lexa Lt. 3, Jl. Sudirman No. 45, Jakarta Selatan',
  primaryColor: '#2563eb',
  secondaryColor: '#1e293b',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
};

export const INITIAL_CLIENTS = [
  {
    id: '0c1aa765-fbee-41d2-9ea1-ada46ebb2365',
    name: 'PT Digital Nusantara',
    company_name: 'PT Digital Nusantara',
    industry: 'Financial Technology & Retail',
    contact_name: 'Budi Santoso',
    email: 'contact@digitalnusantara.id',
    phone: '+62 811 2345 6789',
    website: 'https://digitalnusantara.id',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=128&q=80',
    active: true,
    createdAt: '2026-06-01T08:00:00.000Z',
    updatedAt: '2026-06-01T08:00:00.000Z'
  },
  {
    id: 'client-2',
    name: 'CV Maju Bersama',
    company_name: 'CV Maju Bersama',
    industry: 'Logistics & Supply Chain',
    contact_name: 'Dewi Lestari',
    email: 'info@majubersama.co.id',
    phone: '+62 812 9876 5432',
    website: 'https://majubersama.co.id',
    logo: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=128&q=80',
    active: true,
    createdAt: '2026-06-15T09:30:00.000Z',
    updatedAt: '2026-06-15T09:30:00.000Z'
  },
  {
    id: 'client-3',
    name: 'Bank Mandiri',
    company_name: 'Bank Mandiri',
    industry: 'Banking & Finance',
    contact_name: 'Rian Pratama',
    email: 'corporate@bankmandiri.co.id',
    phone: '+62 21 526 5045',
    website: 'https://bankmandiri.co.id',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80',
    active: true,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 'client-4',
    name: 'Telkom Indonesia',
    company_name: 'Telkom Indonesia',
    industry: 'Telecommunications',
    contact_name: 'Siti Rahma',
    email: 'partnership@telkom.co.id',
    phone: '+62 21 521 5115',
    website: 'https://telkom.co.id',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=128&q=80',
    active: true,
    createdAt: '2026-07-20T11:00:00.000Z',
    updatedAt: '2026-07-20T11:00:00.000Z'
  }
];


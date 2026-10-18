import {
  LoginPage,
  DashboardPage,
  ProjectListPage,
  ProjectFormPage,
  ProjectDetailPage,
  CaseStudyListPage,
  CaseStudyFormPage,
  ServiceListPage,
  TechnologyListPage,
  TestimonialListPage,
  DocumentListPage,
  UserManagementPage,
  DepartmentListPage,
  TasksPage,
  CalendarPage,
  UnauthorizedPage,
  TrackProjectPage,
  NotFoundPage,
  ClientListPage,
} from './lazyPages';

export const routesConfig = [
  {
    path: '/login',
    element: <LoginPage />,
    isProtected: false,
  },
  {
    path: '/track',
    element: <TrackProjectPage />,
    isProtected: false,
  },
  {
    path: '/',
    isProtected: true,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // Projects Module
      {
        path: 'projects',
        element: <ProjectListPage />,
      },
      {
        path: 'projects/new',
        element: <ProjectFormPage />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailPage />,
      },
      {
        path: 'projects/:id/edit',
        element: <ProjectFormPage />,
      },
      // Clients Module (PRD FR-41, SRS FR-CLI-01)
      {
        path: 'clients',
        element: <ClientListPage />,
      },
      // Case Studies Module
      {
        path: 'case-studies',
        element: <CaseStudyListPage />,
      },
      {
        path: 'case-studies/new',
        element: <CaseStudyFormPage />,
      },
      {
        path: 'case-studies/:id/edit',
        element: <CaseStudyFormPage />,
      },
      // Other Modules (Skeletons/Week 3-4)
      {
        path: 'services',
        element: <ServiceListPage />,
      },
      {
        path: 'technologies',
        element: <TechnologyListPage />,
      },
      {
        path: 'testimonials',
        element: <TestimonialListPage />,
      },
      {
        path: 'documents',
        element: <DocumentListPage />,
      },
      {
        path: 'users',
        element: <UserManagementPage />,
      },
      {
        path: 'departments',
        element: <DepartmentListPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
    isProtected: false,
  },
];

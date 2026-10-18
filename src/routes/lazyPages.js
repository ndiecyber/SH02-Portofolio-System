import { lazy } from 'react';

// Route-level code splitting: each page (and its chart/table libraries)
// is loaded on demand instead of in one large bundle.
export const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
export const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
export const ProjectListPage = lazy(() => import('../pages/Projects/ProjectListPage'));
export const ProjectFormPage = lazy(() => import('../pages/Projects/ProjectFormPage'));
export const ProjectDetailPage = lazy(() => import('../pages/Projects/ProjectDetailPage'));
export const CaseStudyListPage = lazy(() => import('../pages/CaseStudies/CaseStudyListPage'));
export const CaseStudyFormPage = lazy(() => import('../pages/CaseStudies/CaseStudyFormPage'));
export const ServiceListPage = lazy(() => import('../pages/Services/ServiceListPage'));
export const TechnologyListPage = lazy(() => import('../pages/Technologies/TechnologyListPage'));
export const TestimonialListPage = lazy(() => import('../pages/Testimonials/TestimonialListPage'));
export const DocumentListPage = lazy(() => import('../pages/Documents/DocumentListPage'));
export const UserManagementPage = lazy(() => import('../pages/UserManagement/UserManagementPage'));
export const DepartmentListPage = lazy(() => import('../pages/Departments/DepartmentListPage'));
export const TasksPage = lazy(() => import('../pages/Tasks/TasksPage'));
export const CalendarPage = lazy(() => import('../pages/Calendar/CalendarPage'));
export const UnauthorizedPage = lazy(() => import('../pages/Unauthorized/UnauthorizedPage'));
export const TrackProjectPage = lazy(() => import('../pages/Track/TrackProjectPage'));
export const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));
export const ClientListPage = lazy(() => import('../pages/Clients/ClientListPage'));

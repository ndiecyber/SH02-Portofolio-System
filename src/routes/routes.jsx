import React from 'react';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProjectListPage from '../pages/Projects/ProjectListPage';
import ProjectFormPage from '../pages/Projects/ProjectFormPage';
import ProjectDetailPage from '../pages/Projects/ProjectDetailPage';
import CaseStudyListPage from '../pages/CaseStudies/CaseStudyListPage';
import CaseStudyFormPage from '../pages/CaseStudies/CaseStudyFormPage';
import ServiceListPage from '../pages/Services/ServiceListPage';
import TechnologyListPage from '../pages/Technologies/TechnologyListPage';
import TeamListPage from '../pages/TeamMembers/TeamListPage';
import TestimonialListPage from '../pages/Testimonials/TestimonialListPage';
import DocumentListPage from '../pages/Documents/DocumentListPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import UserManagementPage from '../pages/UserManagement/UserManagementPage';
import DepartmentListPage from '../pages/Departments/DepartmentListPage';
import TasksPage from '../pages/Tasks/TasksPage';
import CalendarPage from '../pages/Calendar/CalendarPage';
import UnauthorizedPage from '../pages/Unauthorized/UnauthorizedPage';
import TrackProjectPage from '../pages/Track/TrackProjectPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import ClientListPage from '../pages/Clients/ClientListPage';

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
        path: 'team',
        element: <TeamListPage />,
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
        path: 'settings',
        element: <SettingsPage />,
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

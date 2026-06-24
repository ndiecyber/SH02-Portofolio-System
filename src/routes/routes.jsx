import React from 'react';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProjectListPage from '../pages/Projects/ProjectListPage';
import CaseStudyListPage from '../pages/CaseStudies/CaseStudyListPage';
import ServiceListPage from '../pages/Services/ServiceListPage';
import TechnologyListPage from '../pages/Technologies/TechnologyListPage';
import TeamListPage from '../pages/TeamMembers/TeamListPage';
import TestimonialListPage from '../pages/Testimonials/TestimonialListPage';
import DocumentListPage from '../pages/Documents/DocumentListPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';

export const routesConfig = [
  {
    path: '/login',
    element: <LoginPage />,
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
      {
        path: 'projects',
        element: <ProjectListPage />,
      },
      {
        path: 'case-studies',
        element: <CaseStudyListPage />,
      },
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
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
    isProtected: false,
  },
];

import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/constants';

export const useRole = () => {
  const { user } = useAuth();

  const rawRole = (user?.role || '').toUpperCase();
  const role = rawRole || null;
  const department = user?.department || null;

  // Role booleans (robust against casing and SRS/PRD aliases)
  const isAdmin = role === ROLES.ADMIN || role === 'ADMIN' || role === 'CEO' || role === 'ADMINISTRATOR';
  const isCEO = isAdmin; // In LEXA PMS, CEO and Admin share top-level administrative access
  const isPM = role === 'PROJECT_MANAGER' || role === 'PM' || role === 'MANAGER';
  const isDeveloper = role === ROLES.DEVELOPER || role === 'DEVELOPER' || role === 'DEV' || role === 'TEAM_MEMBER';
  const isUIUX = role === 'DESIGNER' || role === 'UI_UX_DESIGNER';
  const isQA = role === 'QA' || role === 'QA_TESTER';
  const isClient = role === 'CLIENT' || role === 'VIEWER';
  const isIntern = role === 'INTERN';

  const isLearningIntern = isIntern && user?.magang_tier === 'LEARNING';
  const isApprenticeIntern = isIntern && user?.magang_tier === 'APPRENTICE';
  const isJuniorIntern = isIntern && user?.magang_tier === 'JUNIOR';

  // Helper check to see if a project is assigned to this user
  const isProjectAssigned = useCallback((project) => {
    if (!user || !project) return false;
    if (isAdmin) return true; // Admin has access to everything
    
    const assignedIds = user.assignedProjects || [];
    return assignedIds.includes(project.id) || project.teamMembers?.includes(user.id);
  }, [user, isAdmin]);

  // General Permissions
  const canCreateProject = isAdmin; 
  
  const canEditProject = useCallback((_project) => {
    return isAdmin;
  }, [isAdmin]);

  const canDeleteProject = isAdmin; // Only Admin can delete projects

  const canUpdateProgress = useCallback((project) => {
    if (isAdmin) return true;
    if (isDeveloper) return isProjectAssigned(project);
    return false;
  }, [isAdmin, isDeveloper, isProjectAssigned]);

  const canManageCaseStudies = useCallback((_project) => {
    return isAdmin;
  }, [isAdmin]);

  const canPublishCaseStudy = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);

  const canUploadDocument = useCallback((project) => {
    if (isAdmin) return true;
    if (isDeveloper && isProjectAssigned(project)) return true;
    return false;
  }, [isAdmin, isDeveloper, isProjectAssigned]);

  const canDownloadDocument = useCallback((project) => {
    if (isAdmin) return true;
    if (isDeveloper && isProjectAssigned(project)) return true;
    return false;
  }, [isAdmin, isDeveloper, isProjectAssigned]);

  const canDeleteDocument = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);

  const canViewReports = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);

  const canViewSettings = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);

  const canViewUserManagement = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);

  return {
    role,
    department,
    isAdmin,
    isCEO,
    isPM,
    isDeveloper,
    isUIUX,
    isQA,
    isClient,
    isIntern,
    isLearningIntern,
    isApprenticeIntern,
    isJuniorIntern,
    isProjectAssigned,
    
    // Action checks
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canUpdateProgress,
    canManageCaseStudies,
    canPublishCaseStudy,
    canUploadDocument,
    canDownloadDocument,
    canDeleteDocument,
    canViewReports,
    canViewSettings,
    canViewUserManagement,
    canManageClients: isAdmin || isPM
  };
};
export default useRole;

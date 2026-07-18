import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES, MAGANG_TIERS } from '../config/constants';

export const useRole = () => {
  const { user } = useAuth();

  const role = user?.role || null;
  const department = user?.department || null;

  // Role booleans
  const isAdmin = role === ROLES.ADMIN;
  const isCEO = role === ROLES.ADMIN;
  const isPM = false;
  const isDeveloper = role === ROLES.DEVELOPER;
  const isUIUX = false;
  const isQA = false;
  const isClient = false;
  const isIntern = false;

  const isLearningIntern = false;
  const isApprenticeIntern = false;
  const isJuniorIntern = false;

  // Helper check to see if a project is assigned to this user
  const isProjectAssigned = useCallback((project) => {
    if (!user || !project) return false;
    if (isAdmin) return true; // Admin has access to everything
    
    const assignedIds = user.assignedProjects || [];
    return assignedIds.includes(project.id) || project.teamMembers?.includes(user.id);
  }, [user, isAdmin]);

  // General Permissions
  const canCreateProject = isAdmin; 
  
  const canEditProject = useCallback((project) => {
    return isAdmin;
  }, [isAdmin]);

  const canDeleteProject = isAdmin; // Only Admin can delete projects

  const canUpdateProgress = useCallback((project) => {
    if (isAdmin) return true;
    if (isDeveloper) return isProjectAssigned(project);
    return false;
  }, [isAdmin, isDeveloper, isProjectAssigned]);

  const canManageCaseStudies = useCallback((project) => {
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
    canViewUserManagement
  };
};
export default useRole;

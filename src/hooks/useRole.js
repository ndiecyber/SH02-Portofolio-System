import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES, MAGANG_TIERS } from '../config/constants';

export const useRole = () => {
  const { user } = useAuth();

  const role = user?.role || null;
  const magangTier = user?.magang_tier || null;

  // Role booleans
  const isAdmin = role === ROLES.ADMIN || role === ROLES.CEO;
  const isCEO = role === ROLES.CEO || role === ROLES.ADMIN;
  const isPM = role === ROLES.PROJECT_MANAGER;
  const isDeveloper = role === ROLES.DEVELOPER;
  const isUIUX = role === ROLES.UIUX_DESIGNER;
  const isQA = role === ROLES.QA_TESTER;
  const isClient = role === ROLES.CLIENT;
  const isIntern = role === ROLES.INTERN;

  // Intern Tier booleans
  const isLearningIntern = isIntern && magangTier === MAGANG_TIERS.LEARNING;
  const isApprenticeIntern = isIntern && magangTier === MAGANG_TIERS.APPRENTICE;
  const isJuniorIntern = isIntern && magangTier === MAGANG_TIERS.JUNIOR;

  // Helper check to see if a project is assigned to this user
  const isProjectAssigned = useCallback((project) => {
    if (!user || !project) return false;
    if (isCEO) return true; // CEO has access to everything
    
    // Team check for interns
    if (isIntern) {
      return project.teamId === user.team_id;
    }

    // Direct assignment check for PMs, Devs, Designers, QAs, and Clients
    if (isClient) {
      // Assuming project client match
      return project.client === user.clientName || project.client_id === user.id;
    }

    // Direct array matches
    const assignedIds = user.assignedProjects || [];
    return assignedIds.includes(project.id) || project.teamMembers?.includes(user.id);
  }, [user, isCEO, isIntern, isClient]);

  // General Permissions
  const canCreateProject = isCEO; // Only CEO/Admin can create projects globally in general, PM can only edit/manage assigned or create if admin lets them. (Context: "PM: CREATE, READ, UPDATE, DELETE untuk assigned projects only" - so PM can create assigned projects? We'll let PM create too, or edit assigned ones). Let's let CEO and PM create/edit.
  
  const canEditProject = useCallback((project) => {
    if (isCEO) return true;
    if (isPM) return isProjectAssigned(project);
    return false;
  }, [isCEO, isPM, isProjectAssigned]);

  const canDeleteProject = isCEO; // Only CEO/Admin can delete projects

  const canUpdateProgress = useCallback((project) => {
    if (isCEO || isPM) return isProjectAssigned(project);
    if (isDeveloper) return isProjectAssigned(project);
    if (isJuniorIntern || isApprenticeIntern) return isProjectAssigned(project);
    return false;
  }, [isCEO, isPM, isDeveloper, isJuniorIntern, isApprenticeIntern, isProjectAssigned]);

  const canManageCaseStudies = useCallback((project) => {
    if (isCEO) return true;
    if (!project) {
      return isPM || isJuniorIntern || isApprenticeIntern;
    }
    if (isPM && isProjectAssigned(project)) return true;
    if (isJuniorIntern || isApprenticeIntern) return isProjectAssigned(project);
    return false;
  }, [isCEO, isPM, isJuniorIntern, isApprenticeIntern, isProjectAssigned]);

  const canPublishCaseStudy = useCallback(() => {
    if (isCEO || isPM) return true;
    // Junior intern can publish drafts but with approval (so draft only)
    return false;
  }, [isCEO, isPM]);

  const canUploadDocument = useCallback((project) => {
    if (isCEO || isPM) return true;
    if ((isDeveloper || isUIUX || isQA) && isProjectAssigned(project)) return true;
    if (isIntern && isProjectAssigned(project) && !isLearningIntern) return true;
    return false;
  }, [isCEO, isPM, isDeveloper, isUIUX, isQA, isLearningIntern, isProjectAssigned]);

  const canDownloadDocument = useCallback((project) => {
    if (isClient) return false;
    if (isIntern) return isProjectAssigned(project); // all tiers can download team resources
    return true; // other roles can view/download
  }, [isClient, isIntern, isProjectAssigned]);

  const canDeleteDocument = useCallback(() => {
    return isCEO || isPM; // Interns and devs cannot delete docs
  }, [isCEO, isPM]);

  const canViewReports = useCallback(() => {
    return isCEO || isPM;
  }, [isCEO, isPM]);

  const canViewSettings = useCallback(() => {
    return isCEO;
  }, [isCEO]);

  const canViewUserManagement = useCallback(() => {
    return isCEO;
  }, [isCEO]);

  return {
    role,
    magangTier,
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

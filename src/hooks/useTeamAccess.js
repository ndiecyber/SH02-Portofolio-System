import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/constants';

export const useTeamAccess = () => {
  const { user } = useAuth();

  const checkTeamAccess = (teamId) => {
    if (!user) return false;
    // Admin / CEO has bypass
    if (user.role === ROLES.ADMIN || user.role === ROLES.CEO) return true;
    
    // For interns, enforce team match
    if (user.role === ROLES.INTERN) {
      return user.team_id === teamId;
    }
    
    // For other roles, they can access anything or direct assignments govern them
    return true;
  };

  return {
    userTeamId: user?.team_id || null,
    checkTeamAccess
  };
};
export default useTeamAccess;

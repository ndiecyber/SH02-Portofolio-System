import { useAuth } from '../context/AuthContext';
import { useRole } from './useRole';

export const useProjectAccess = () => {
  const { user } = useAuth();
  const { isProjectAssigned } = useRole();

  const checkProjectAccess = (project) => {
    if (!user || !project) return false;
    return isProjectAssigned(project);
  };

  return {
    checkProjectAccess
  };
};
export default useProjectAccess;

import React from 'react';
import { useTeamAccess } from '../../hooks/useTeamAccess';

const TeamGuard = ({ children, teamId, fallback = null }) => {
  const { checkTeamAccess } = useTeamAccess();

  if (checkTeamAccess(teamId)) {
    return <>{children}</>;
  }

  return fallback;
};

export default TeamGuard;

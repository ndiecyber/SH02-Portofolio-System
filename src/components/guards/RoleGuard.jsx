import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleGuard = ({ children, allowedRoles = [], allowedTiers = [], fallback = null }) => {
  const { user } = useAuth();

  if (!user) return fallback;

  const role = user.role;
  const tier = user.magang_tier;

  const roleAllowed = allowedRoles.length === 0 || allowedRoles.includes(role);
  const tierAllowed = allowedTiers.length === 0 || (tier && allowedTiers.includes(tier));

  // If user is Intern, they must satisfy both role Intern and tier restrictions if set
  if (role === 'INTERN' && allowedTiers.length > 0) {
    if (roleAllowed && tierAllowed) {
      return <>{children}</>;
    }
    return fallback;
  }

  if (roleAllowed) {
    return <>{children}</>;
  }

  return fallback;
};

export default RoleGuard;

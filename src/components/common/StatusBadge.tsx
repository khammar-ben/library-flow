import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EmpruntStatus, Role } from '@/types';

interface StatusBadgeProps {
  status: EmpruntStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants: Record<EmpruntStatus, 'enCours' | 'retourne' | 'enRetard'> = {
    EN_COURS: 'enCours',
    RETOURNE: 'retourne',
    EN_RETARD: 'enRetard',
  };

  const labels: Record<EmpruntStatus, string> = {
    EN_COURS: 'In Progress',
    RETOURNE: 'Returned',
    EN_RETARD: 'Overdue',
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};

interface RoleBadgeProps {
  role: Role;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const variants: Record<Role, 'admin' | 'responsable' | 'client'> = {
    ADMIN: 'admin',
    RESPONSABLE: 'responsable',
    CLIENT: 'client',
  };

  const labels: Record<Role, string> = {
    ADMIN: 'Admin',
    RESPONSABLE: 'Librarian',
    CLIENT: 'Client',
  };

  return <Badge variant={variants[role]}>{labels[role]}</Badge>;
};

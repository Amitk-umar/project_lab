import { useAuth } from '../contexts/AuthContext';

export type Permission = 
  | 'equipment.create'
  | 'equipment.read'
  | 'equipment.update'
  | 'equipment.delete'
  | 'maintenance.create'
  | 'maintenance.read'
  | 'maintenance.update'
  | 'maintenance.assign'
  | 'reports.view'
  | 'reports.export'
  | 'users.manage'
  | 'settings.manage'
  | 'alerts.manage';

const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'equipment.create',
    'equipment.read',
    'equipment.update',
    'equipment.delete',
    'maintenance.create',
    'maintenance.read',
    'maintenance.update',
    'maintenance.assign',
    'reports.view',
    'reports.export',
    'users.manage',
    'settings.manage',
    'alerts.manage'
  ],
  technician: [
    'equipment.read',
    'equipment.update',
    'maintenance.create',
    'maintenance.read',
    'maintenance.update',
    'reports.view'
  ],
  staff: [
    'equipment.read',
    'maintenance.create',
    'maintenance.read',
    'reports.view'
  ],
  guest: [
    'equipment.read',
    'maintenance.read',
    'reports.view'
  ]
};

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccess = (requiredRole: string): boolean => {
    if (!user) return false;
    
    const roleHierarchy = ['guest', 'staff', 'technician', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    
    return userRoleIndex >= requiredRoleIndex;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    userRole: user?.role || 'guest'
  };
};
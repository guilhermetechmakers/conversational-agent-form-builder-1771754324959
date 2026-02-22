import type { AuthRole } from '@/types/auth'

/** Role hierarchy: higher index = more permissions */
export const ROLE_HIERARCHY: AuthRole[] = ['viewer', 'editor', 'admin', 'owner']

/** Check if role A has at least the permissions of role B */
export function hasRoleOrAbove(userRole: AuthRole, requiredRole: AuthRole): boolean {
  const userIdx = ROLE_HIERARCHY.indexOf(userRole)
  const requiredIdx = ROLE_HIERARCHY.indexOf(requiredRole)
  return userIdx >= requiredIdx
}

/** Permissions by role (scaffolding for future use) */
export const ROLE_PERMISSIONS: Record<AuthRole, string[]> = {
  viewer: ['agents:read', 'sessions:read', 'analytics:read'],
  editor: ['agents:read', 'agents:write', 'sessions:read', 'analytics:read'],
  admin: ['agents:read', 'agents:write', 'agents:delete', 'sessions:read', 'sessions:delete', 'analytics:read', 'users:read'],
  owner: ['agents:read', 'agents:write', 'agents:delete', 'sessions:read', 'sessions:delete', 'analytics:read', 'users:read', 'users:write', 'settings:write'],
}

export function hasPermission(role: AuthRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

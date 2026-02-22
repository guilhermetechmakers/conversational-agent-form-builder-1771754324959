import { useContext } from 'react'
import { AuthContext } from '@/components/AuthProvider'
import { hasRoleOrAbove, hasPermission } from '@/constants/rbac'
import type { AuthRole } from '@/types/auth'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

/** Check if user has at least the given role */
export function useHasRole(requiredRole: AuthRole): boolean {
  const { user } = useAuth()
  if (!user) return false
  return hasRoleOrAbove(user.role, requiredRole)
}

/** Check if user has the given permission */
export function useHasPermission(permission: string): boolean {
  const { user } = useAuth()
  if (!user) return false
  return hasPermission(user.role, permission)
}

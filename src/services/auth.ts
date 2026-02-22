import { api } from '@/lib/api'
import {
  getStoredToken,
  getStoredUser,
  setStoredToken,
  removeStoredToken,
  setStoredUser,
  isTokenExpired,
} from '@/lib/jwt'
import type {
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  MessageResponse,
} from '@/types/auth'
import type { User } from '@/types'

const AUTH_BASE = '/auth'
const MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true'

/** Map API role string to User role */
function toUserRole(role?: string): User['role'] {
  const r = (role ?? 'viewer').toLowerCase()
  if (r === 'owner' || r === 'admin' || r === 'editor' || r === 'viewer') {
    return r
  }
  return 'viewer'
}

/** Build User from API response */
function toUser(data: { id: string; email: string; name?: string; role?: string; avatar_url?: string }): User {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatarUrl: data.avatar_url,
    role: toUserRole(data.role),
  }
}

/** Sign in with email and password */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  if (MOCK_AUTH) {
    const user = toUser({ id: 'mock-id', email: data.email, name: data.email.split('@')[0], role: 'owner' })
    const token = `mock.${btoa(JSON.stringify({ sub: user.id, email: user.email }))}.sig`
    setStoredToken(token)
    setStoredUser(JSON.stringify(user))
    return { token, user }
  }
  const res = await api.post<AuthResponse & { user?: unknown }>(`${AUTH_BASE}/login`, data)
  const token = res.token
  const user = res.user ?? toUser({ id: '', email: data.email, name: data.email.split('@')[0] })
  setStoredToken(token)
  setStoredUser(JSON.stringify(user))
  return { token, user }
}

/** Sign up with name, email, password */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  if (MOCK_AUTH) {
    const user = toUser({ id: 'mock-id', email: data.email, name: data.name, role: 'owner' })
    const token = `mock.${btoa(JSON.stringify({ sub: user.id, email: user.email }))}.sig`
    setStoredToken(token)
    setStoredUser(JSON.stringify(user))
    return { token, user }
  }
  const res = await api.post<AuthResponse & { user?: unknown }>(`${AUTH_BASE}/signup`, data)
  const token = res.token
  const user = res.user ?? toUser({ id: '', email: data.email, name: data.name })
  setStoredToken(token)
  setStoredUser(JSON.stringify(user))
  return { token, user }
}

/** Request password reset email */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
  if (MOCK_AUTH) {
    return { message: 'If an account exists, you will receive reset instructions.' }
  }
  return api.post<MessageResponse>(`${AUTH_BASE}/forgot-password`, data)
}

/** Reset password with token from email */
export async function resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
  if (MOCK_AUTH) {
    return { message: 'Password has been reset successfully.' }
  }
  return api.post<MessageResponse>(`${AUTH_BASE}/reset-password`, data)
}

/** Verify email with token from email */
export async function verifyEmail(token: string): Promise<AuthResponse | MessageResponse> {
  if (MOCK_AUTH) {
    return { message: 'Email verified successfully.' }
  }
  const res = await api.post<AuthResponse | MessageResponse>(`${AUTH_BASE}/verify-email`, { token })
  if ('token' in res && res.token) {
    setStoredToken(res.token)
    setStoredUser(JSON.stringify(res.user))
    return res as AuthResponse
  }
  return res as MessageResponse
}

/** Sign out and clear session */
export function logout(): void {
  removeStoredToken()
}

/** Get current session from storage (does not validate with server) */
export function getSession(): { user: User; token: string } | null {
  const token = getStoredToken()
  if (!token || isTokenExpired(token)) {
    removeStoredToken()
    return null
  }
  const userJson = getStoredUser()
  if (!userJson) return null
  try {
    const user = JSON.parse(userJson) as User
    return { user, token }
  } catch {
    return null
  }
}

/**
 * Placeholder SSO flow - initiates OAuth redirect.
 * In production, redirect to /api/auth/sso or provider URL.
 */
export function initiateSso(provider: 'google' | 'github' | 'microsoft'): void {
  const base = import.meta.env.VITE_API_URL ?? '/api'
  window.location.href = `${base}/auth/sso/${provider}`
}

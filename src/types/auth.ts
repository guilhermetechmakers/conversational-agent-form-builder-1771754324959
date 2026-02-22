import type { User } from './index'

/** Supported user roles for RBAC */
export type AuthRole = 'owner' | 'admin' | 'editor' | 'viewer'

/** JWT payload structure (standard claims + app-specific) */
export interface JwtPayload {
  sub: string
  email?: string
  name?: string
  role?: AuthRole
  iat?: number
  exp?: number
}

/** Auth session with user and token */
export interface AuthSession {
  user: User
  token: string
  expiresAt?: number
}

/** Login request */
export interface LoginRequest {
  email: string
  password: string
}

/** Signup request */
export interface SignupRequest {
  name: string
  email: string
  password: string
}

/** Password reset request (forgot password) */
export interface ForgotPasswordRequest {
  email: string
}

/** Password reset confirm (with token from email) */
export interface ResetPasswordRequest {
  token: string
  password: string
}

/** Auth API responses */
export interface AuthResponse {
  token: string
  user: User
  expiresIn?: number
}

export interface MessageResponse {
  message: string
}

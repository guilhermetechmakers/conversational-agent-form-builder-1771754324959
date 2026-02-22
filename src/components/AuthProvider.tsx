import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getSession, logout as authLogout } from '@/services/auth'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  setSession: (user: User, token: string) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadSession = useCallback(() => {
    const session = getSession()
    if (session) {
      setUser(session.user)
      setToken(session.token)
    } else {
      setUser(null)
      setToken(null)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadSession()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'auth_user') {
        loadSession()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [loadSession])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
    setToken(null)
  }, [])

  const setSession = useCallback((u: User, t: string) => {
    setUser(u)
    setToken(t)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user && !!token,
      logout,
      setSession,
    }),
    [user, token, isLoading, logout, setSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

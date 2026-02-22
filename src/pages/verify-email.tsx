import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { verifyEmail } from '@/services/auth'
import { useAuth } from '@/hooks/useAuth'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const { setSession } = useAuth()

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    let cancelled = false
    verifyEmail(token)
      .then((res) => {
        if (cancelled) return
        if ('token' in res && res.token && 'user' in res) {
          setSession(res.user, res.token)
          setStatus('success')
          toast.success('Email verified successfully')
        } else {
          setStatus('success')
          toast.success('Email verified successfully')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error')
          toast.error('Verification failed. The link may have expired.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [token, setSession])

  if (status === 'loading') {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <h1 className="text-2xl font-semibold">Verifying your email</h1>
        <p className="text-muted-foreground">Please wait...</p>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" aria-hidden />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <h1 className="text-2xl font-semibold">Verification failed</h1>
        <p className="text-muted-foreground">
          This verification link is invalid or has expired. Please request a new one or try signing in.
        </p>
        <div className="flex flex-col gap-2">
          <Link to="/login">
            <Button className="w-full">Go to log in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" className="w-full">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-center animate-fade-in">
      <h1 className="text-2xl font-semibold">Email verified</h1>
      <p className="text-muted-foreground">
        Your email has been verified. Redirecting...
      </p>
      <Link to="/dashboard">
        <Button variant="outline" className="w-full">
          Go to dashboard
        </Button>
      </Link>
    </div>
  )
}

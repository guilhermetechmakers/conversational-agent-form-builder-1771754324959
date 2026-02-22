import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { verifyEmail } from '@/services/auth'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, AlertCircle, CheckCircle2, LogIn, UserPlus, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { setSession } = useAuth()

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('No verification token was provided. Please use the link from your verification email.')
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
      .catch((err: unknown) => {
        if (!cancelled) {
          setStatus('error')
          const msg = err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : 'This verification link is invalid or has expired. Please request a new one or try signing in.'
          setErrorMessage(msg)
          toast.error('Verification failed. The link may have expired.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [token, setSession])

  if (status === 'loading') {
    return (
      <Card
        className="animate-fade-in border-border bg-card shadow-card"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Verifying your email"
      >
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Verifying your email
            </h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your email address...
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md bg-muted" />
            <Skeleton className="h-4 w-3/4 mx-auto rounded-md bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card
        className="animate-fade-in border-border bg-card shadow-card"
        role="alert"
        aria-live="assertive"
        aria-labelledby="verify-error-heading"
      >
        <CardHeader className="space-y-4 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
            aria-hidden
          >
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1
              id="verify-error-heading"
              className="text-2xl font-semibold text-foreground"
            >
              Verification failed
            </h1>
            <p className="text-muted-foreground">
              This verification link is invalid or has expired. Please request a new one or try signing in.
            </p>
            <div
              className={cn(
                'rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-left',
                'text-sm text-destructive'
              )}
              role="alert"
            >
              {errorMessage}
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full" size="lg">
            <Link
              to="/login"
              aria-label="Go to log in page"
            >
              <LogIn className="mr-2 h-4 w-4" aria-hidden />
              Go to log in
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link
              to="/signup"
              aria-label="Go to sign up page"
            >
              <UserPlus className="mr-2 h-4 w-4" aria-hidden />
              Sign up
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card
      className="animate-fade-in border-border bg-card shadow-card"
      role="status"
      aria-live="polite"
      aria-labelledby="verify-success-heading"
    >
      <CardHeader className="space-y-4 text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
          aria-hidden
        >
          <CheckCircle2 className="h-10 w-10 text-success" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1
            id="verify-success-heading"
            className="text-2xl font-semibold text-foreground"
          >
            Email verified
          </h1>
          <p className="text-muted-foreground">
            Your email has been verified. Redirecting...
          </p>
        </div>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link
            to="/dashboard"
            aria-label="Go to dashboard"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
            Go to dashboard
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

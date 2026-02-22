import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { resetPassword } from '@/services/auth'
import { Lock, Loader2, KeyRound, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function PasswordResetPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('Invalid or missing reset link. Please request a new one.')
      return
    }
    setIsLoading(true)
    setSubmitError(null)
    const toastId = toast.loading('Resetting your password...')
    try {
      await resetPassword({ token, password: data.password })
      setSuccess(true)
      toast.success('Password reset successfully', { id: toastId })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Something went wrong'
      setSubmitError(msg)
      toast.error(msg, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  // Success empty state
  if (success) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col items-center gap-4 px-2 text-center sm:px-0">
          <h1 className="sr-only">Password reset</h1>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="h-7 w-7" aria-hidden />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              Password reset successful
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Your password has been reset successfully. Redirecting to log in...
            </p>
          </div>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full">
                Back to log in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Invalid token empty state
  if (!token) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col items-center gap-4 px-2 text-center sm:px-0">
          <h1 className="sr-only">Invalid reset link</h1>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" aria-hidden />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              Invalid or expired link
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              This password reset link is invalid or has expired. Please request
              a new one from the forgot password page.
            </p>
          </div>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <Link to="/forgot-password" className="block">
              <Button className="w-full transition-all duration-200 hover:scale-[1.02]">
                Request new link
              </Button>
            </Link>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                Back to log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Form view
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="px-2 text-center sm:px-0">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Set new password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Enter your new password below
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
        aria-label="Set new password form"
      >
        <Input
          id="password"
          type="password"
          label="New password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" aria-hidden />}
          autoComplete="new-password"
          error={!!errors.password}
          errorMessage={errors.password?.message}
          aria-label="New password"
          aria-invalid={!!errors.password}
          aria-describedby={submitError ? 'submit-error' : undefined}
          {...register('password')}
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" aria-hidden />}
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          aria-label="Confirm new password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={submitError ? 'submit-error' : undefined}
          {...register('confirmPassword')}
        />
        {submitError && (
          <div
            id="submit-error"
            className={cn(
              'flex items-start gap-3 rounded-lg border border-destructive/20',
              'bg-destructive/5 px-4 py-3 text-sm text-destructive'
            )}
            role="alert"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
            <span>{submitError}</span>
          </div>
        )}
        <Button
          type="submit"
          className="w-full transition-all duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden
              />
              Resetting...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          to="/login"
          className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
        >
          Back to log in
        </Link>
      </p>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { resetPassword } from '@/services/auth'

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
    try {
      await resetPassword({ token, password: data.password })
      setSuccess(true)
      toast.success('Password reset successfully')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Something went wrong'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <h1 className="text-2xl font-semibold">Password reset</h1>
        <p className="text-muted-foreground">
          Your password has been reset successfully. Redirecting to log in...
        </p>
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Back to log in
          </Button>
        </Link>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <h1 className="text-2xl font-semibold">Invalid reset link</h1>
        <p className="text-muted-foreground">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link to="/forgot-password">
          <Button className="w-full">Request new link</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Set new password</h1>
        <p className="text-muted-foreground mt-1">
          Enter your new password below
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { forgotPassword } from '@/services/auth'
import { Mail, Loader2, MailCheck, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setSubmitError(null)
    try {
      await forgotPassword(data)
      setSent(true)
      toast.success('Check your email for reset instructions')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Something went wrong'
      setSubmitError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col items-center gap-4 px-2 text-center sm:px-0">
          <h1 className="sr-only">Reset password</h1>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-7 w-7" aria-hidden />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              Check your email
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              We&apos;ve sent password reset instructions to your email address.
            </p>
          </div>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive it? Check spam or{' '}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
                aria-label="Try sending the reset email again"
              >
                try again
              </button>
            </p>
            <Link to="/login" className="mt-4 block">
              <Button variant="outline" className="w-full">
                Back to log in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="px-2 text-center sm:px-0">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Reset password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Enter your email and we&apos;ll send reset instructions
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
        aria-label="Password reset form"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={cn('pl-9', errors.email && 'animate-shake border-destructive')}
              autoComplete="email"
              aria-label="Email address for password reset"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? 'email-error' : submitError ? 'submit-error' : undefined
              }
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>
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
              Sending...
            </>
          ) : (
            'Send reset link'
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

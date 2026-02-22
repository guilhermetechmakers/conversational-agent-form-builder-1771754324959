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
import { Mail, Loader2, MailCheck } from 'lucide-react'
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
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-7 w-7" aria-hidden />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Check your email
            </h1>
            <p className="text-muted-foreground">
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
                className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
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
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Reset password
        </h1>
        <p className="mt-1 text-muted-foreground">
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
            className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {submitError}
          </div>
        )}
        <Button
          type="submit"
          className="w-full transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
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
          className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
        >
          Back to log in
        </Link>
      </p>
    </div>
  )
}

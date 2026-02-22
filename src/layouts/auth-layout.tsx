import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mb-8 animate-fade-in"
          >
            <Bot className="h-10 w-10 text-primary" />
            <span className="text-xl font-semibold">Agent Builder</span>
          </Link>
          <div
            className={cn(
              'rounded-xl bg-card p-8 shadow-card',
              'animate-fade-in-up'
            )}
          >
            <Outlet />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

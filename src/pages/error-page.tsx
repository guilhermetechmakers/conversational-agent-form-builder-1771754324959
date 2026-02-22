import { Link } from 'react-router-dom'
import { AlertTriangle, Home, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ErrorPage() {
  return (
    <main
      className={cn(
        'min-h-screen flex flex-col items-center justify-center px-4',
        'bg-gradient-to-br from-background via-background to-muted/20'
      )}
      role="main"
      aria-labelledby="error-heading"
      aria-describedby="error-description"
    >
      <Card className="w-full max-w-md animate-fade-in border-border bg-card shadow-card">
        <CardHeader className="text-center pb-2">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
            aria-hidden
          >
            <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden />
          </div>
          <span
            className="text-6xl font-bold tabular-nums text-foreground sm:text-7xl"
            aria-hidden
          >
            500
          </span>
          <h1
            id="error-heading"
            className="text-2xl font-bold leading-tight text-foreground sm:text-3xl"
          >
            Internal Server Error
          </h1>
          <h2 className="text-base font-normal text-muted-foreground sm:text-lg">
            Something went wrong on our end. We&apos;re working to fix it.
          </h2>
        </CardHeader>
        <CardContent className="text-center pb-4">
          <p
            id="error-description"
            className="text-sm text-muted-foreground"
          >
            Please try again later or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link
              to="/"
              aria-label="Go to home page"
            >
              <Home className="mr-2 h-4 w-4" aria-hidden />
              Go home
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link
              to="/dashboard/help"
              aria-label="Contact support for help"
            >
              <HelpCircle className="mr-2 h-4 w-4" aria-hidden />
              Contact support
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

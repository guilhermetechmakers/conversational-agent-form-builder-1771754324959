import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md animate-fade-in">
        <AlertTriangle className="h-24 w-24 text-notification mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-2">500</h1>
        <p className="text-muted-foreground mb-8">
          Something went wrong on our end. We&apos;re working to fix it.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/help">Contact support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

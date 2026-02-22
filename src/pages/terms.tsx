import { Link } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-semibold">Agent Builder</span>
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: February 2025</p>
        <h2>Acceptance</h2>
        <p>
          By using our services, you agree to these terms. If you do not agree,
          do not use the service.
        </p>
        <h2>Service description</h2>
        <p>
          Agent Builder provides a platform to create and publish conversational
          agents that collect structured data. You are responsible for the
          content and configuration of your agents.
        </p>
        <h2>Acceptable use</h2>
        <p>
          You must not use the service for illegal purposes, to collect data
          without consent, or to violate third-party rights. We may suspend
          accounts that violate these terms.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          Our liability is limited to the amount you paid in the 12 months
          preceding the claim. We are not liable for indirect or consequential
          damages.
        </p>
        <div className="mt-12">
          <Button asChild variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

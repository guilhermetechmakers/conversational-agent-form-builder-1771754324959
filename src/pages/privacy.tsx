import { Link } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-semibold">Agent Builder</span>
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2025</p>
        <h2>Data collection</h2>
        <p>
          We collect information you provide when using our services, including
          account details, agent configurations, and conversation transcripts
          from public agent sessions.
        </p>
        <h2>Retention</h2>
        <p>
          Session data is retained according to your workspace retention
          settings. You can configure retention periods and request deletion.
        </p>
        <h2>PII handling</h2>
        <p>
          Fields marked as PII are encrypted at rest. We do not use your data for
          training AI models.
        </p>
        <h2>Processors</h2>
        <p>
          We use trusted infrastructure providers for hosting and storage. Data
          processing agreements are in place where required.
        </p>
        <h2>Your rights</h2>
        <p>
          You have the right to access, correct, export, and delete your data
          in accordance with GDPR and CCPA.
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

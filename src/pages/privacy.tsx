import { Link } from 'react-router-dom'
import { Bot, ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const PRIVACY_SECTIONS = [
  {
    id: 'data-collection',
    title: 'Data collection',
    content:
      'We collect information you provide when using our services, including account details, agent configurations, and conversation transcripts from public agent sessions.',
  },
  {
    id: 'retention',
    title: 'Retention',
    content:
      'Session data is retained according to your workspace retention settings. You can configure retention periods and request deletion.',
  },
  {
    id: 'pii-handling',
    title: 'PII handling',
    content:
      'Fields marked as PII are encrypted at rest. We do not use your data for training AI models.',
  },
  {
    id: 'processors',
    title: 'Processors',
    content:
      'We use trusted infrastructure providers for hosting and storage. Data processing agreements are in place where required.',
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    content:
      'You have the right to access, correct, export, and delete your data in accordance with GDPR and CCPA.',
  },
] as const

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
            aria-label="Agent Builder home"
          >
            <Bot className="h-8 w-8 text-primary" aria-hidden />
            <span className="font-semibold">Agent Builder</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <article aria-labelledby="privacy-title">
          <header className="mb-8 sm:mb-12 animate-fade-in-up">
            <h1
              id="privacy-title"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Privacy Policy
            </h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              Last updated: February 2025
            </p>
          </header>

          <nav
            className="mb-8 sm:mb-12"
            aria-label="Privacy policy sections"
          >
            <ul className="flex flex-wrap gap-2">
              {PRIVACY_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium',
                      'text-muted-foreground transition-colors',
                      'hover:bg-muted hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                    )}
                  >
                    <Shield className="h-4 w-4" aria-hidden />
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6 sm:space-y-8">
            {PRIVACY_SECTIONS.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <Card className="transition-all duration-300 hover:shadow-card-hover">
                  <CardHeader className="pb-2">
                    <h2
                      id={`${section.id}-heading`}
                      className="text-xl font-semibold text-foreground sm:text-2xl"
                    >
                      {section.title}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-7">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>

          <footer className="mt-12 animate-fade-in-up sm:mt-16">
            <Button asChild variant="outline" size="lg">
              <Link
                to="/"
                className="inline-flex items-center gap-2"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden />
                Back to home
              </Link>
            </Button>
          </footer>
        </article>
      </main>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Bot, ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface TermsSubsection {
  id: string
  title: string
  content: string
}

interface TermsSection {
  id: string
  title: string
  subsections: TermsSubsection[]
}

const TERMS_SECTIONS: TermsSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance',
    subsections: [
      {
        id: 'acceptance-agreement',
        title: 'Agreement',
        content:
          'By using our services, you agree to these terms. Your continued use constitutes acceptance of any updates.',
      },
      {
        id: 'acceptance-non-acceptance',
        title: 'Non-acceptance',
        content:
          'If you do not agree to these terms, do not use the service. You may discontinue use at any time.',
      },
    ],
  },
  {
    id: 'service-description',
    title: 'Service description',
    subsections: [
      {
        id: 'service-platform',
        title: 'Platform',
        content:
          'Agent Builder provides a platform to create and publish conversational agents that collect structured data.',
      },
      {
        id: 'service-responsibility',
        title: 'Your responsibility',
        content:
          'You are responsible for the content and configuration of your agents. Ensure your agents comply with applicable laws.',
      },
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    subsections: [
      {
        id: 'acceptable-prohibited',
        title: 'Prohibited activities',
        content:
          'You must not use the service for illegal purposes, to collect data without consent, or to violate third-party rights.',
      },
      {
        id: 'acceptable-enforcement',
        title: 'Enforcement',
        content:
          'We may suspend or terminate accounts that violate these terms. We reserve the right to investigate suspected violations.',
      },
    ],
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of liability',
    subsections: [
      {
        id: 'liability-cap',
        title: 'Financial cap',
        content:
          'Our liability is limited to the amount you paid in the 12 months preceding the claim.',
      },
      {
        id: 'liability-excluded',
        title: 'Excluded damages',
        content:
          'We are not liable for indirect, incidental, special, or consequential damages.',
      },
    ],
  },
]

function TermsEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-border bg-card/50 animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div
        className="rounded-full bg-muted p-4 mb-4"
        aria-hidden
      >
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        No terms available
      </h2>
      <p className="text-muted-foreground text-center max-w-md">
        Terms of Service content is being prepared. Please check back later or
        contact support for more information.
      </p>
      <Button asChild variant="outline" size="lg" className="mt-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" aria-hidden />
          Back to home
        </Link>
      </Button>
    </div>
  )
}

export function TermsPage() {
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
        <article aria-labelledby="terms-title">
          <header className="mb-8 sm:mb-12 animate-fade-in-up">
            <h1
              id="terms-title"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Terms of Service
            </h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              Last updated: February 2025
            </p>
          </header>

          {TERMS_SECTIONS.length === 0 ? (
            <TermsEmptyState />
          ) : (
            <>
              <nav
                className="mb-8 sm:mb-12"
                aria-label="Terms of Service sections"
              >
                <ul className="flex flex-wrap gap-2">
                  {TERMS_SECTIONS.map((section) => (
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
                        <FileText className="h-4 w-4" aria-hidden />
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-6 sm:space-y-8">
                {TERMS_SECTIONS.map((section, sectionIndex) => (
                  <section
                    key={section.id}
                    id={section.id}
                    aria-labelledby={`${section.id}-heading`}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${sectionIndex * 75}ms`,
                    }}
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
                      <CardContent className="space-y-6">
                        {section.subsections.map((subsection, subIndex) => (
                          <div key={subsection.id}>
                            <h3
                              id={subsection.id}
                              className="text-base font-semibold text-foreground sm:text-lg mb-2"
                            >
                              {subsection.title}
                            </h3>
                            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-7">
                              {subsection.content}
                            </p>
                            {subIndex < section.subsections.length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        ))}
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
            </>
          )}
        </article>
      </main>
    </div>
  )
}

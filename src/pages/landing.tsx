import { Link } from 'react-router-dom'
import { Bot, MessageSquare, Zap, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[rgb(var(--success))]/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-4 py-6 md:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg">Agent Builder</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 py-16 md:py-24 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Turn forms into{' '}
            <span className="bg-gradient-to-r from-primary to-[rgb(var(--success))] bg-clip-text text-transparent">
              conversational agents
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create AI-powered chat flows that collect structured data naturally.
            No code. Publish in minutes. Export via webhooks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Start building free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                Try demo agent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento grid features */}
      <section className="px-4 py-16 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageSquare,
                title: 'Conversational capture',
                desc: 'Collect leads and data through natural chat instead of static forms.',
              },
              {
                icon: Zap,
                title: 'No-code builder',
                desc: 'Configure fields, persona, and appearance in minutes.',
              },
              {
                icon: Shield,
                title: 'Webhook-first export',
                desc: 'Forward completed sessions to CRMs and tools automatically.',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={cn(
                  'rounded-xl bg-card p-6 border border-border shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02]',
                  'animate-fade-in-up'
                )}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <item.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:py-24 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto text-center rounded-2xl bg-card border border-border p-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to boost your conversions?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join teams using conversational agents for lead capture.
          </p>
          <Link to="/signup">
            <Button size="lg">Create your first agent</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-medium">Agent Builder</span>
          </Link>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/docs" className="hover:text-foreground">Docs</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

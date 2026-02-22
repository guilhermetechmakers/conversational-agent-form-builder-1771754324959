import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Bot,
  MessageSquare,
  Zap,
  Shield,
  ArrowRight,
  Check,
  Sparkles,
  Mail,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { subscribeNewsletter } from '@/api/newsletter'
import { cn } from '@/lib/utils'

const FEATURE_ICON_SIZE = 'h-8 w-8'
const PLAN_ICON_SIZE = 'h-5 w-5'
const CHECK_ICON_SIZE = 'h-4 w-4'
const BRAND_ICON_SIZE = 'h-8 w-8'

const newsletterSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

export function LandingPage() {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onNewsletterSubmit = async (data: NewsletterFormData) => {
    setApiError(null)
    try {
      await subscribeNewsletter(data.email)
      setIsSubscribed(true)
      toast.success('You\'re on the list! We\'ll be in touch.')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Something went wrong. Please try again.'
      setApiError(msg)
      toast.error(msg)
    }
  }
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 py-6 md:px-8 lg:px-12"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
          aria-label="Agent Builder - Go to homepage"
        >
          <Bot className={cn(BRAND_ICON_SIZE, 'text-primary')} aria-hidden />
          <span className="font-semibold text-lg">Agent Builder</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" aria-label="Log in to your account">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/signup" aria-label="Sign up for a free account">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="px-4 py-16 md:py-24 md:px-8 lg:px-12"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Turn forms into{' '}
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              conversational agents
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create AI-powered chat flows that collect structured data naturally.
            No code. Publish in minutes. Export via webhooks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              aria-label="Sign up for free"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8 group"
              >
                Sign Up Free
                <ArrowRight
                  className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Button>
            </Link>
            <Link
              to="/demo"
              aria-label="Try the demo agent"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base border-primary/50 hover:bg-primary/10"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento grid features */}
      <section
        className="px-4 py-16 md:px-8 lg:px-12"
        aria-labelledby="features-heading"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            id="features-heading"
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            Everything you need to capture leads
          </h2>
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
              <Card
                key={item.title}
                className={cn(
                  'transition-all duration-300 hover:scale-[1.02] animate-fade-in-up'
                )}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <CardHeader>
                  <item.icon
                    className={cn(FEATURE_ICON_SIZE, 'text-primary')}
                    aria-hidden
                  />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section
        className="px-4 py-16 md:py-24 md:px-8 lg:px-12"
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="pricing-heading"
            className="text-2xl md:text-3xl font-bold text-center mb-4"
          >
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Start free. Scale as you grow. No hidden fees.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={cn(
                'transition-all duration-300 hover:border-primary/50 animate-fade-in-up'
              )}
              style={{ animationDelay: '200ms' }}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles
                    className={cn(PLAN_ICON_SIZE, 'text-primary')}
                    aria-hidden
                  />
                  <CardTitle className="text-lg">Starter</CardTitle>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">Free</span>
                  <span className="text-muted-foreground ml-1">/ forever</span>
                </div>
                <ul className="space-y-3 mb-8 list-none p-0 m-0 text-sm text-muted-foreground">
                  {['1 agent', '100 sessions/month', 'Webhook export', 'Community support'].map(
                    (f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check
                          className={cn(CHECK_ICON_SIZE, 'text-success shrink-0')}
                          aria-hidden
                        />
                        {f}
                      </li>
                    )
                  )}
                </ul>
              </CardHeader>
              <CardFooter>
                <Link
                  to="/signup"
                  aria-label="Get started with Starter plan"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    Get started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card
              className={cn(
                'border-2 border-primary relative overflow-hidden',
                'bg-gradient-to-br from-primary/10 to-transparent',
                'transition-all duration-300 hover:shadow-glow animate-fade-in-up'
              )}
              style={{ animationDelay: '300ms' }}
            >
              <div
                className="absolute top-3 right-3 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary"
                aria-hidden
              >
                Popular
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap
                    className={cn(PLAN_ICON_SIZE, 'text-primary')}
                    aria-hidden
                  />
                  <CardTitle className="text-lg">Pro</CardTitle>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground ml-1">/ month</span>
                </div>
                <ul className="space-y-3 mb-8 list-none p-0 m-0 text-sm text-muted-foreground">
                  {[
                    'Unlimited agents',
                    '5,000 sessions/month',
                    'Priority webhooks',
                    'Email support',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check
                        className={cn(CHECK_ICON_SIZE, 'text-success shrink-0')}
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardHeader>
              <CardFooter>
                <Link
                  to="/signup"
                  aria-label="Start free trial of Pro plan"
                  className="w-full"
                >
                  <Button className="w-full">Start free trial</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card
              className={cn(
                'transition-all duration-300 hover:border-primary/50 animate-fade-in-up'
              )}
              style={{ animationDelay: '400ms' }}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield
                    className={cn(PLAN_ICON_SIZE, 'text-primary')}
                    aria-hidden
                  />
                  <CardTitle className="text-lg">Enterprise</CardTitle>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 list-none p-0 m-0 text-sm text-muted-foreground">
                  {[
                    'Unlimited everything',
                    'Custom integrations',
                    'SLA & dedicated support',
                    'On-premise option',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check
                        className={cn(CHECK_ICON_SIZE, 'text-success shrink-0')}
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardHeader>
              <CardFooter>
                <Link
                  to="/signup"
                  aria-label="Contact sales for Enterprise plan"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    Contact sales
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <section
        className="px-4 py-16 md:py-20 md:px-8 lg:px-12"
        aria-labelledby="newsletter-heading"
      >
        <Card className="max-w-xl mx-auto p-6 md:p-8 animate-fade-in border-primary/20 bg-card/50">
          <CardHeader className="p-0 pb-6">
            <CardTitle id="newsletter-heading" className="text-xl md:text-2xl">
              Get early access to new features
            </CardTitle>
            <CardDescription>
              Join our newsletter for product updates and tips on building better agents.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isSubscribed ? (
              <div
                className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-4 text-success"
                role="status"
                aria-live="polite"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
                <p className="text-sm font-medium">
                  Thanks for subscribing! We&apos;ll keep you updated.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onNewsletterSubmit)}
                className="flex flex-col sm:flex-row gap-3"
                noValidate
              >
                <div className="flex-1 min-w-0">
                  <Input
                    id="newsletter-email"
                    type="email"
                    label={<span className="sr-only">Email address</span>}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="h-11"
                    error={!!errors.email}
                    errorMessage={errors.email?.message}
                    isLoading={isSubmitting}
                    leftIcon={<Mail className="h-4 w-4" />}
                    aria-label="Email address for newsletter signup"
                    aria-invalid={!!errors.email}
                    aria-describedby={apiError ? 'newsletter-api-error' : undefined}
                    disabled={isSubmitting}
                    {...register('email')}
                  />
                  {apiError && (
                    <p
                      id="newsletter-api-error"
                      className="mt-2 text-sm text-destructive animate-fade-in"
                      role="alert"
                    >
                      {apiError}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 px-6 shrink-0"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  aria-label={isSubmitting ? 'Subscribing...' : 'Subscribe to newsletter'}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section
        className="px-4 py-16 md:py-24 md:px-8 lg:px-12"
        aria-labelledby="cta-heading"
      >
        <Card className="max-w-3xl mx-auto text-center p-8 md:p-12 animate-fade-in">
          <CardHeader>
            <CardTitle id="cta-heading" className="text-2xl md:text-3xl">
              Ready to boost your conversions?
            </CardTitle>
            <CardDescription className="mb-8">
              Join teams using conversational agents for lead capture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                aria-label="Create your first agent"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto">
                  Create your first agent
                </Button>
              </Link>
              <Link
                to="/demo"
                aria-label="Try the demo agent"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Try demo agent
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-border px-4 py-8 md:px-8 lg:px-12"
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg transition-opacity"
            aria-label="Agent Builder - Go to homepage"
          >
            <Bot
              className={cn(BRAND_ICON_SIZE, 'text-primary')}
              aria-hidden
            />
            <span className="font-medium">Agent Builder</span>
          </Link>
          <nav
            className="flex gap-6 text-sm text-muted-foreground"
            aria-label="Footer navigation"
          >
            <Link
              to="/docs"
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
              aria-label="View documentation"
            >
              Docs
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
              aria-label="View privacy policy"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
              aria-label="View terms of service"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

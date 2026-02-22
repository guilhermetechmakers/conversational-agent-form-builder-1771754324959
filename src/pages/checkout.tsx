import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, CreditCard, Loader2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const plans = [
  { id: 'starter', name: 'Starter', price: 29, features: ['1,000 sessions/mo', '3 agents', 'Webhooks'] },
  { id: 'pro', name: 'Pro', price: 99, features: ['10,000 sessions/mo', 'Unlimited agents', 'Webhooks', 'Priority support'], popular: true },
  { id: 'enterprise', name: 'Enterprise', price: 299, features: ['Unlimited sessions', 'Unlimited agents', 'SSO', 'Dedicated support'] },
]

const promoCodeSchema = z.object({
  promoCode: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Za-z0-9-]+$/.test(val),
      'Promo code can only contain letters, numbers, and hyphens'
    )
    .refine(
      (val) => !val || val.length >= 3,
      'Promo code must be at least 3 characters'
    ),
})

type PromoFormData = z.infer<typeof promoCodeSchema>

const VALID_PROMOS = ['SAVE10', 'WELCOME20', 'PRO50']

export function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const {
    register,
    handleSubmit: handlePromoSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<PromoFormData>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: { promoCode: '' },
  })

  const promoCode = watch('promoCode')

  const onApplyPromo = async (data: PromoFormData) => {
    if (!data.promoCode?.trim()) return
    setIsApplyingPromo(true)
    clearErrors('promoCode')
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const code = data.promoCode.trim().toUpperCase()
      if (VALID_PROMOS.includes(code)) {
        setAppliedPromo(code)
        toast.success(`Promo code "${code}" applied!`)
      } else {
        setError('promoCode', { message: 'Invalid or expired promo code' })
        toast.error('Invalid promo code')
      }
    } catch {
      setError('promoCode', { message: 'Failed to apply promo code' })
      toast.error('Something went wrong')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const onSubscribe = async () => {
    setIsSubscribing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success('Subscription started! (Stripe integration coming soon)')
    } catch {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:py-12 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-2xl font-bold sm:text-3xl">Choose your plan</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Upgrade to unlock more sessions and features
          </p>
        </header>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
          role="group"
          aria-label="Subscription plans"
        >
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'cursor-pointer transition-all duration-200',
                'hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]',
                'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background',
                selectedPlan === plan.id && 'border-primary ring-2 ring-primary/20 shadow-card-hover'
              )}
              onClick={() => setSelectedPlan(plan.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedPlan(plan.id)
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={selectedPlan === plan.id}
              aria-label={`Select ${plan.name} plan for $${plan.price} per month`}
            >
              <CardHeader>
                {plan.popular && (
                  <span className="text-xs font-medium text-primary">Popular</span>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">${plan.price}</span>/mo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" role="list">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" aria-hidden />
              Payment
            </CardTitle>
            <CardDescription>Stripe Elements integration placeholder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2" role="group" aria-labelledby="card-number-label">
              <Label id="card-number-label" htmlFor="card-number">
                Card number
              </Label>
              <Input
                id="card-number"
                type="text"
                placeholder="4242 4242 4242 4242"
                disabled
                aria-label="Card number"
                aria-describedby="card-number-hint"
              />
              <span id="card-number-hint" className="sr-only">
                Use test card 4242 4242 4242 4242 when Stripe is configured
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2" role="group" aria-labelledby="expiry-label">
                <Label id="expiry-label" htmlFor="expiry">
                  Expiry
                </Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  aria-label="Card expiry date"
                />
              </div>
              <div className="space-y-2" role="group" aria-labelledby="cvc-label">
                <Label id="cvc-label" htmlFor="cvc">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  disabled
                  aria-label="Card security code"
                />
              </div>
            </div>

            <div className="space-y-2" role="group" aria-labelledby="promo-label">
              <Label id="promo-label" htmlFor="promo-code">
                Promo code
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Tag
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="promo-code"
                    type="text"
                    placeholder="Enter code"
                    className={cn('pl-9', errors.promoCode && 'animate-shake border-destructive')}
                    aria-label="Promo code"
                    aria-invalid={!!errors.promoCode}
                    aria-describedby={errors.promoCode ? 'promo-error' : undefined}
                    {...register('promoCode')}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePromoSubmit(onApplyPromo)}
                  disabled={!promoCode?.trim() || isApplyingPromo}
                  className="sm:w-auto min-h-[2.5rem]"
                >
                  {isApplyingPromo ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Applying...
                    </>
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
              {errors.promoCode && (
                <p id="promo-error" className="text-sm text-destructive" role="alert">
                  {errors.promoCode.message}
                </p>
              )}
              {appliedPromo && (
                <p className="text-sm text-success" role="status">
                  Promo {appliedPromo} applied
                </p>
              )}
            </div>

            <Button
              className="w-full min-h-[2.75rem] sm:min-h-10"
              onClick={onSubscribe}
              disabled={isSubscribing}
            >
              {isSubscribing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Processing payment...
                </>
              ) : (
                'Subscribe (Stripe integration coming soon)'
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-6 sm:mt-8">
          <Link to="/dashboard/settings">
            <Button variant="ghost" aria-label="Back to settings">
              Back to settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

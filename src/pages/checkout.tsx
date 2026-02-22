import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const plans = [
  { id: 'starter', name: 'Starter', price: 29, features: ['1,000 sessions/mo', '3 agents', 'Webhooks'] },
  { id: 'pro', name: 'Pro', price: 99, features: ['10,000 sessions/mo', 'Unlimited agents', 'Webhooks', 'Priority support'], popular: true },
  { id: 'enterprise', name: 'Enterprise', price: 299, features: ['Unlimited sessions', 'Unlimited agents', 'SSO', 'Dedicated support'] },
]

export function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Choose your plan</h1>
          <p className="text-muted-foreground mt-2">
            Upgrade to unlock more sessions and features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
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
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>Stripe Elements integration placeholder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Card number</Label>
              <Input placeholder="4242 4242 4242 4242" disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry</Label>
                <Input placeholder="MM/YY" disabled />
              </div>
              <div className="space-y-2">
                <Label>CVC</Label>
                <Input placeholder="123" disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Promo code</Label>
              <Input placeholder="Enter code" />
            </div>
            <Button className="w-full" disabled>
              Subscribe (Stripe integration coming soon)
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/dashboard/settings">
            <Button variant="ghost">Back to settings</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

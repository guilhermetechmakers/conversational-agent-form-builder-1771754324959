import { Link } from 'react-router-dom'
import { Bot, MessageSquare, TrendingUp, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const mockStats = {
  sessions: 1247,
  completions: 892,
  activeAgents: 5,
  conversionRate: 71.5,
}

const mockAgents = [
  { id: '1', name: 'Lead Capture', slug: 'lead-capture', sessions: 456, conversionRate: 72, status: 'published' as const },
  { id: '2', name: 'Support Qualifier', slug: 'support-qualifier', sessions: 312, conversionRate: 68, status: 'published' as const },
  { id: '3', name: 'Event Registration', slug: 'event-reg', sessions: 0, conversionRate: 0, status: 'draft' as const },
]

const mockSessions = [
  { id: 's1', agentName: 'Lead Capture', status: 'completed', time: '2 min ago' },
  { id: 's2', agentName: 'Support Qualifier', status: 'active', time: '5 min ago' },
  { id: 's3', agentName: 'Lead Capture', status: 'completed', time: '12 min ago' },
]

export function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your agents and sessions
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sessions', value: mockStats.sessions, icon: MessageSquare },
          { label: 'Completions', value: mockStats.completions, icon: TrendingUp },
          { label: 'Active Agents', value: mockStats.activeAgents, icon: Bot },
          { label: 'Conversion Rate', value: `${mockStats.conversionRate}%`, icon: TrendingUp },
        ].map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Agents</CardTitle>
              <CardDescription>Your conversational agents</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link to="/dashboard/agents/new">
                <Plus className="h-4 w-4" />
                Create
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAgents.map((agent) => (
                <Link
                  key={agent.id}
                  to={`/dashboard/agents/${agent.id}`}
                  className="block rounded-lg border border-border p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {agent.sessions} sessions · {agent.conversionRate}% conversion
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        agent.status === 'published'
                          ? 'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {agent.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSessions.map((session) => (
                <Link
                  key={session.id}
                  to={`/dashboard/sessions/${session.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover:border-primary/50"
                >
                  <div>
                    <p className="font-medium text-sm">{session.agentName}</p>
                    <p className="text-xs text-muted-foreground">{session.time}</p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs',
                      session.status === 'completed'
                        ? 'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]'
                        : 'bg-primary/20 text-primary'
                    )}
                  >
                    {session.status}
                  </span>
                </Link>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" asChild>
              <Link to="/dashboard/sessions">View all sessions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Bot, Plus, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const mockAgents = [
  { id: '1', name: 'Lead Capture', slug: 'lead-capture', sessions: 456, conversionRate: 72, status: 'published' as const },
  { id: '2', name: 'Support Qualifier', slug: 'support-qualifier', sessions: 312, conversionRate: 68, status: 'published' as const },
  { id: '3', name: 'Event Registration', slug: 'event-reg', sessions: 0, conversionRate: 0, status: 'draft' as const },
]

export function AgentsListPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Agents</h1>
          <p className="text-muted-foreground mt-1">
            Manage your conversational agents
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/agents/new">
            <Plus className="h-4 w-4" />
            Create Agent
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search agents..."
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAgents.map((agent) => (
              <Card
                key={agent.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover"
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        <Link
                          to={`/dashboard/agents/${agent.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {agent.name}
                        </Link>
                      </CardTitle>
                      <CardDescription>{agent.slug}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/dashboard/agents/${agent.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/chat/${agent.slug}`} target="_blank">
                          Open chat
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{agent.sessions} sessions</span>
                    <span className="font-medium">{agent.conversionRate}% conversion</span>
                  </div>
                  <span
                    className={cn(
                      'inline-block mt-2 rounded-full px-2 py-0.5 text-xs font-medium',
                      agent.status === 'published'
                        ? 'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {agent.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

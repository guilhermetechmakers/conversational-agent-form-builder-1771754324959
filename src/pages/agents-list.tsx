import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Plus, MoreHorizontal, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface AgentListItem {
  id: string
  name: string
  slug: string
  sessions: number
  conversionRate: number
  status: 'published' | 'draft'
}

const mockAgents: AgentListItem[] = [
  { id: '1', name: 'Lead Capture', slug: 'lead-capture', sessions: 456, conversionRate: 72, status: 'published' },
  { id: '2', name: 'Support Qualifier', slug: 'support-qualifier', sessions: 312, conversionRate: 68, status: 'published' },
  { id: '3', name: 'Event Registration', slug: 'event-reg', sessions: 0, conversionRate: 0, status: 'draft' },
]

function AgentCardSkeleton() {
  return (
    <Card className="skeleton-shimmer overflow-hidden rounded-xl shadow-card">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <Skeleton className="mt-2 h-5 w-16 rounded-full" />
      </CardContent>
    </Card>
  )
}

function AgentsListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading agents">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <AgentCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function AgentsListPage() {
  const [agents, setAgents] = useState<AgentListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setAgents(mockAgents)
      setIsLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    setTimeout(() => {
      setAgents(mockAgents)
      setIsLoading(false)
    }, 200)
  }

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Agents</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your conversational agents
          </p>
        </div>
        <Button asChild className="transition-all duration-200 hover:scale-[1.02] hover:shadow-glow">
          <Link to="/dashboard/agents/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Agent
          </Link>
        </Button>
      </header>

      <section aria-labelledby="agents-list-heading">
        <h2 id="agents-list-heading" className="sr-only">
          Agent list
        </h2>
        <Card className="rounded-xl shadow-card">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                placeholder="Search agents..."
                className="max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search agents"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <AgentsListSkeleton />
            ) : hasError ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              role="alert"
              aria-live="polite"
            >
              <div className="mb-4 rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-10 w-10 text-destructive" aria-hidden />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Failed to load agents
              </h3>
              <p className="mb-6 max-w-sm text-muted-foreground">
                Something went wrong while loading your agents. Please try again.
              </p>
              <Button
                onClick={handleRetry}
                className="gap-2 transition-all duration-200 hover:scale-[1.02]"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center"
              role="status"
              aria-label="No agents"
            >
              <div className="mb-4 rounded-full bg-muted p-4">
                <Bot className="h-12 w-12 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {agents.length === 0 ? 'No agents yet' : 'No matching agents'}
              </h3>
              <p className="mb-6 max-w-sm text-muted-foreground">
                {agents.length === 0
                  ? 'Create your first conversational agent to start collecting leads and data through natural chat.'
                  : 'Try adjusting your search to find what you\'re looking for.'}
              </p>
              <Button
                asChild
                size="lg"
                variant="default"
                className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-glow"
              >
                <Link to="/dashboard/agents/new">
                  <Plus className="h-4 w-4" />
                  {agents.length === 0 ? 'Create your first agent' : 'Create Agent'}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="group overflow-hidden rounded-xl shadow-card transition-all duration-300 hover:shadow-card-hover"
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                        <Bot className="h-6 w-6 text-primary" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base">
                          <Link
                            to={`/dashboard/agents/${agent.id}`}
                            className="transition-colors hover:text-primary"
                          >
                            {agent.name}
                          </Link>
                        </CardTitle>
                        <CardDescription className="truncate">{agent.slug}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Agent actions">
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
                      <span className="font-medium text-foreground">{agent.conversionRate}% conversion</span>
                    </div>
                    <span
                      className={cn(
                        'mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                        agent.status === 'published'
                          ? 'bg-success/20 text-success'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {agent.status}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </section>
    </div>
  )
}

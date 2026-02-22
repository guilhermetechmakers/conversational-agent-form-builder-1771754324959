import { Link } from 'react-router-dom'
import {
  Bot,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Share2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import type { AgentListItem } from '@/api/agents'
import { cn } from '@/lib/utils'

export interface AgentListProps {
  agents?: AgentListItem[]
  isLoading?: boolean
  onDelete?: (agent: AgentListItem) => void
  className?: string
}

function AgentCardSkeleton() {
  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function AgentList({
  agents = [],
  isLoading,
  onDelete,
  className,
}: AgentListProps) {
  if (isLoading) {
    return (
      <Card className={cn('lg:col-span-2', className)}>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <AgentCardSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (agents.length === 0) {
    return (
      <Card className={cn('lg:col-span-2', className)}>
        <CardHeader>
          <CardTitle>Agents</CardTitle>
          <CardDescription>Your conversational agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in"
            role="status"
            aria-live="polite"
          >
            <div className="rounded-full bg-primary/10 p-5 mb-6 ring-4 ring-primary/5">
              <Bot className="h-12 w-12 text-primary" aria-hidden />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-foreground">
              No agents yet
            </h3>
            <p className="text-muted-foreground mb-2 max-w-sm text-base leading-relaxed">
              Create your first conversational agent to start collecting leads and
              data through natural chat.
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Add form fields, configure persona, and publish your public chat link.
            </p>
            <Button
              asChild
              aria-label="Create your first agent"
              className="transition-all duration-200 hover:scale-[1.02] hover:shadow-glow"
            >
              <Link to="/dashboard/agents/new">Create your first agent</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('lg:col-span-2', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Agents</CardTitle>
          <CardDescription>Your conversational agents</CardDescription>
        </div>
        <Button asChild size="sm" aria-label="Create new agent">
          <Link to="/dashboard/agents/new">Create</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group flex items-center justify-between rounded-xl border border-border p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-card"
            >
              <Link
                to={`/dashboard/agents/${agent.id}`}
                className="flex flex-1 min-w-0 items-center gap-3"
              >
                <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {agent.sessionsCount} sessions · {agent.conversionRate}%
                    conversion
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={agent.status === 'published' ? 'default' : 'secondary'}
                  className={cn(
                    agent.status === 'published'
                      ? 'bg-success/20 text-success'
                      : ''
                  )}
                >
                  {agent.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      aria-label="Agent actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/chat/${agent.slug}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/agents/${agent.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const url = `${window.location.origin}/chat/${agent.slug}`
                        navigator.clipboard.writeText(url)
                        toast.success('Link copied to clipboard')
                      }}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Link
                    </DropdownMenuItem>
                    {onDelete && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(agent)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

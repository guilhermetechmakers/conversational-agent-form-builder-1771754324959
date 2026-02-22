import { Link } from 'react-router-dom'
import {
  Bot,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Share2,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AgentListItem } from '@/api/agents'
import { cn } from '@/lib/utils'

export interface AgentListProps {
  agents?: AgentListItem[]
  isLoading?: boolean
  isError?: boolean
  error?: string
  onRetry?: () => void
  onDelete?: (agent: AgentListItem) => void
  className?: string
}

function AgentListSkeleton() {
  return (
    <div
      className="flex-1 bg-card rounded-lg shadow-md p-6 overflow-hidden"
      role="status"
      aria-label="Loading agents"
    >
      <div className="space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-b-0">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AgentListError({
  error,
  onRetry,
}: {
  error?: string
  onRetry?: () => void
}) {
  return (
    <div
      className="flex-1 bg-card rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[320px] animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <div className="rounded-full bg-destructive/10 p-5 mb-6 ring-4 ring-destructive/5">
        <AlertCircle
          className="h-16 w-16 text-destructive"
          aria-hidden
        />
      </div>
      <h3 className="font-semibold text-xl text-foreground text-center mb-2">
        Failed to load agents
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {error ?? 'Something went wrong. Please try again.'}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          aria-label="Retry loading agents"
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-glow"
        >
          Try again
        </Button>
      )}
    </div>
  )
}

function AgentListEmpty() {
  return (
    <div
      className="flex-1 bg-card rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[320px] animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-full bg-primary/10 p-6 mb-6 ring-4 ring-primary/5">
        <Bot
          className="h-16 w-16 text-primary"
          aria-hidden
        />
      </div>
      <h3 className="font-semibold text-xl text-foreground text-center mb-2">
        No agents yet
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-2 leading-relaxed">
        Create your first conversational agent to start collecting leads and data
        through natural chat.
      </p>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Add fields, configure your persona, and publish to get a shareable link.
      </p>
      <Button
        asChild
        aria-label="Create your first agent"
        className="bg-primary text-primary-foreground font-medium rounded-full px-6 py-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-glow"
      >
        <Link to="/dashboard/agents/new">Create your first agent</Link>
      </Button>
    </div>
  )
}

export function AgentList({
  agents = [],
  isLoading,
  isError,
  error,
  onRetry,
  onDelete,
  className,
}: AgentListProps) {
  if (isError) {
    return (
      <AgentListError
        error={error}
        onRetry={onRetry}
      />
    )
  }

  if (isLoading) {
    return <AgentListSkeleton />
  }

  if (agents.length === 0) {
    return <AgentListEmpty />
  }

  return (
    <div
      className={cn(
        'flex-1 bg-card rounded-lg shadow-md p-6 overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto">
        {/* Desktop: Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="py-2 text-muted-foreground font-medium">
                  Agent
                </TableHead>
                <TableHead className="py-2 text-muted-foreground font-medium">
                  Sessions
                </TableHead>
                <TableHead className="py-2 text-muted-foreground font-medium">
                  Conversion
                </TableHead>
                <TableHead className="py-2 text-muted-foreground font-medium">
                  Status
                </TableHead>
                <TableHead className="py-2 text-muted-foreground font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow
                  key={agent.id}
                  className="border-border hover:bg-muted transition-all duration-200"
                >
                  <TableCell className="py-2 text-foreground">
                    <Link
                      to={`/dashboard/agents/${agent.id}`}
                      className="font-medium hover:text-primary transition-colors"
                      aria-label={`View and edit agent ${agent.name}`}
                    >
                      {agent.name}
                    </Link>
                  </TableCell>
                  <TableCell className="py-2 text-foreground">
                    {agent.sessionsCount}
                  </TableCell>
                  <TableCell className="py-2 text-foreground">
                    {agent.conversionRate}%
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant={agent.status === 'published' ? 'default' : 'secondary'}
                      className={cn(
                        agent.status === 'published' &&
                          'bg-success/20 text-success border-0'
                      )}
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-secondary-accent hover:bg-transparent transition-colors"
                          aria-label={`Actions for agent ${agent.name}`}
                          aria-haspopup="menu"
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" role="menu">
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/chat/${agent.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open agent ${agent.name} in new tab`}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                            Open
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/dashboard/agents/${agent.id}`}
                            aria-label={`Edit agent ${agent.name}`}
                          >
                            <Pencil className="mr-2 h-4 w-4" aria-hidden />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const url = `${window.location.origin}/chat/${agent.slug}`
                            navigator.clipboard.writeText(url)
                            toast.success('Link copied to clipboard')
                          }}
                          aria-label={`Share link for agent ${agent.name}`}
                        >
                          <Share2 className="mr-2 h-4 w-4" aria-hidden />
                          Share Link
                        </DropdownMenuItem>
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(agent)}
                            aria-label={`Delete agent ${agent.name}`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile: Cards */}
        <div className="md:hidden space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between rounded-xl border border-border p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-card"
            >
              <Link
                to={`/dashboard/agents/${agent.id}`}
                className="flex flex-1 min-w-0 items-center gap-3"
                aria-label={`View and edit agent ${agent.name}`}
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
                    agent.status === 'published' &&
                      'bg-success/20 text-success border-0'
                  )}
                >
                  {agent.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-primary hover:text-secondary-accent"
                      aria-label={`Actions for agent ${agent.name}`}
                      aria-haspopup="menu"
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" role="menu">
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/chat/${agent.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open agent ${agent.name} in new tab`}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                        Open
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/dashboard/agents/${agent.id}`}
                        aria-label={`Edit agent ${agent.name}`}
                      >
                        <Pencil className="mr-2 h-4 w-4" aria-hidden />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const url = `${window.location.origin}/chat/${agent.slug}`
                        navigator.clipboard.writeText(url)
                        toast.success('Link copied to clipboard')
                      }}
                      aria-label={`Share link for agent ${agent.name}`}
                    >
                      <Share2 className="mr-2 h-4 w-4" aria-hidden />
                      Share Link
                    </DropdownMenuItem>
                    {onDelete && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(agent)}
                        aria-label={`Delete agent ${agent.name}`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

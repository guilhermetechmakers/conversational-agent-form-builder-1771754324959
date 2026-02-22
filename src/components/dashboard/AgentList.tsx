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
  onDelete?: (agent: AgentListItem) => void
  className?: string
}

function AgentListSkeleton() {
  return (
    <div className="flex-1 bg-card rounded-lg shadow-md p-6">
      <div className="animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-muted rounded-md" />
          ))}
        </div>
        <div className="h-10 w-32 rounded-full bg-muted mt-4" />
      </div>
    </div>
  )
}

function AgentListEmpty() {
  return (
    <div
      className="flex-1 bg-card rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[320px]"
      role="status"
      aria-live="polite"
    >
      <div className="flex justify-center items-center h-64 bg-card rounded-lg w-full">
        <Bot className="h-16 w-16 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="text-muted-foreground font-semibold text-center mt-4">
        No agents yet
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mt-2">
        Create your first conversational agent to start collecting leads and data
        through natural chat.
      </p>
      <Button
        asChild
        aria-label="Create your first agent"
        className="bg-primary text-primary-foreground font-medium rounded-full px-6 py-3 mt-4 transition-all duration-200 hover:scale-[1.02] hover:bg-secondary-accent"
      >
        <Link to="/dashboard/agents/new">Create your first agent</Link>
      </Button>
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
      </div>
    </div>
  )
}

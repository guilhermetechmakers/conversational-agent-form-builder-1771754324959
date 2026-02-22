import { Link } from 'react-router-dom'
import { MessageSquare, Search } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const mockSessions = [
  { id: 's1', agentName: 'Lead Capture', status: 'completed' as const, time: '2 min ago' },
  { id: 's2', agentName: 'Support Qualifier', status: 'active' as const, time: '5 min ago' },
  { id: 's3', agentName: 'Lead Capture', status: 'completed' as const, time: '12 min ago' },
  { id: 's4', agentName: 'Event Registration', status: 'abandoned' as const, time: '1 hour ago' },
]

export function SessionsListPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <p className="text-muted-foreground mt-1">
          View and manage conversation sessions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search sessions..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockSessions.map((session) => (
              <Link
                key={session.id}
                to={`/dashboard/sessions/${session.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{session.agentName}</p>
                    <p className="text-sm text-muted-foreground">{session.time}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    session.status === 'completed' && 'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]',
                    session.status === 'active' && 'bg-primary/20 text-primary',
                    session.status === 'abandoned' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {session.status}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

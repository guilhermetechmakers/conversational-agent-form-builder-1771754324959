import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CreateAgentCTAProps {
  className?: string
}

export function CreateAgentCTA({ className }: CreateAgentCTAProps) {
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8',
        className
      )}
    >
      <Link
        to="/dashboard/agents/new"
        className={cn(
          'flex items-center gap-2 bg-primary text-primary-foreground font-medium rounded-full px-6 py-3 shadow-lg',
          'transition-all duration-200 hover:bg-secondary-accent hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        )}
        aria-label="Create new agent"
      >
        <Plus className="h-5 w-5 shrink-0" aria-hidden />
        <span>Create Agent</span>
      </Link>
    </div>
  )
}

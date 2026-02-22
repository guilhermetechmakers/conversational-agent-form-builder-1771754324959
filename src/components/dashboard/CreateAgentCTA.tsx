import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      <Button
        asChild
        size="lg"
        className={cn(
          'h-12 px-5 shadow-card md:h-14 md:px-6',
          'rounded-lg transition-all duration-300',
          'hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        )}
      >
        <Link to="/dashboard/agents/new" className="flex items-center gap-2">
          <Plus className="h-5 w-5 shrink-0" aria-hidden />
          <span>Create Agent</span>
        </Link>
      </Button>
    </div>
  )
}

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
        className="h-14 px-6 rounded-full shadow-glow hover:scale-105 transition-all duration-300"
      >
        <Link to="/dashboard/agents/new">
          <Plus className="h-6 w-6" />
          Create Agent
        </Link>
      </Button>
    </div>
  )
}

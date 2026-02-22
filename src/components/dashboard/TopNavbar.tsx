import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Menu, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const ICON_SIZE = 'h-4 w-4'

export interface TopNavbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onMobileMenuOpen?: () => void
  className?: string
}

export function TopNavbar({
  searchQuery,
  onSearchChange,
  onMobileMenuOpen,
  className,
}: TopNavbarProps) {
  const { user, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6',
        className
      )}
      role="banner"
    >
      {onMobileMenuOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation menu"
        >
          <Menu className={ICON_SIZE} aria-hidden />
        </Button>
      )}
      <div className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0">
        <div className="relative flex-1 min-w-0 max-w-md">
          <Search
            className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground', ICON_SIZE)}
            aria-hidden
          />
          <Input
            placeholder="Search agents, sessions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
            aria-label="Search agents and sessions"
          />
        </div>
        <Button asChild className="shrink-0" aria-label="Create new agent">
          <Link to="/dashboard/agents/new" className="inline-flex items-center gap-2">
            <Plus className={ICON_SIZE} aria-hidden />
            <span className="hidden sm:inline">Create Agent</span>
          </Link>
        </Button>
      </div>
      <div className="shrink-0">
        {isLoading ? (
          <Skeleton
            className="h-10 w-10 rounded-full"
            aria-label="Loading user profile"
            aria-live="polite"
          />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Open user account menu"
                aria-haspopup="menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name ?? 'User avatar'} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {user?.name?.slice(0, 1).toUpperCase() ??
                      user?.email?.slice(0, 1).toUpperCase() ??
                      'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel className="text-foreground">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{user?.name ?? 'Account'}</span>
                  {user?.email ? (
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground">
                      No email available
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => navigate('/dashboard/settings')}
                className="text-foreground focus:bg-muted focus:text-foreground"
                aria-label="Open settings"
              >
                <User className={cn('mr-2 shrink-0', ICON_SIZE)} aria-hidden />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="text-foreground focus:bg-muted focus:text-foreground"
                aria-label="Log out of your account"
              >
                <LogOut className={cn('mr-2 shrink-0', ICON_SIZE)} aria-hidden />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

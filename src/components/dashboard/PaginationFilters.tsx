import {
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface PaginationFiltersProps {
  status?: string
  onStatusChange?: (status: string) => void
  /** Use 'agent' for agent list filters, 'session' for session filters. Default: 'agent' */
  filterType?: 'agent' | 'session'
  dateFrom?: string
  dateTo?: string
  onDateFromChange?: (value: string) => void
  onDateToChange?: (value: string) => void
  tags?: string[]
  selectedTags?: string[]
  onTagsChange?: (tags: string[]) => void
  page: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  /** Show loading skeleton when data is being fetched */
  isLoading?: boolean
  /** API or validation error message to display inline */
  error?: string | null
  className?: string
}

const AGENT_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

const SESSION_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'abandoned', label: 'Abandoned' },
]

const PAGE_SIZES = [5, 10, 25, 50]

function PaginationFiltersSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-[160px] rounded-lg" />
          <Skeleton className="h-10 w-[140px] rounded-lg" />
          <Skeleton className="h-10 w-[140px] rounded-lg" />
          <Skeleton className="h-10 w-[100px] rounded-lg" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function PaginationFiltersEmpty() {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-border bg-card/50"
      role="status"
      aria-live="polite"
    >
      <Inbox
        className="h-12 w-12 text-muted-foreground mb-3"
        aria-hidden
      />
      <p className="text-sm font-medium text-foreground">
        No items to display
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Adjust your filters or check back later
      </p>
    </div>
  )
}

export function PaginationFilters({
  status,
  onStatusChange,
  filterType = 'agent',
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  page,
  totalPages,
  totalItems,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  isLoading = false,
  error = null,
  className,
}: PaginationFiltersProps) {
  const statusOptions =
    filterType === 'session' ? SESSION_STATUS_OPTIONS : AGENT_STATUS_OPTIONS
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  const hasDateValidationError =
    dateFrom &&
    dateTo &&
    new Date(dateFrom) > new Date(dateTo)
  const displayError = error ?? (hasDateValidationError ? 'Start date must be before end date' : null)

  if (isLoading) {
    return (
      <div className={cn(className)} aria-busy="true" aria-live="polite">
        <PaginationFiltersSkeleton />
      </div>
    )
  }

  if (totalItems === 0 && !displayError) {
    return (
      <div className={cn(className)}>
        <PaginationFiltersEmpty />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)} role="region" aria-label="Pagination and filters">
      {displayError && (
        <div
          id="pagination-filters-error"
          className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 animate-fade-in"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle
            className="h-5 w-5 shrink-0 text-destructive mt-0.5"
            aria-hidden
          />
          <p className="text-sm font-medium text-destructive">{displayError}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          role="group"
          aria-label="Filter controls"
        >
          <Filter className="h-4 w-4" aria-hidden />
          <span>Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {onStatusChange && (
            <Select value={status ?? 'all'} onValueChange={onStatusChange}>
              <SelectTrigger
                className="w-full sm:w-[160px] min-w-0"
                aria-label="Filter by status"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {onDateFromChange && (
            <Input
              type="date"
              value={dateFrom ?? ''}
              onChange={(e) => onDateFromChange(e.target.value)}
              className={cn(
                'w-full sm:w-[140px] min-w-0',
                hasDateValidationError && 'border-destructive animate-shake'
              )}
              placeholder="From"
              aria-label="Filter from date"
              aria-invalid={hasDateValidationError ? true : undefined}
              aria-describedby={
                hasDateValidationError ? 'pagination-filters-error' : undefined
              }
            />
          )}
          {onDateToChange && (
            <Input
              type="date"
              value={dateTo ?? ''}
              onChange={(e) => onDateToChange(e.target.value)}
              className={cn(
                'w-full sm:w-[140px] min-w-0',
                hasDateValidationError && 'border-destructive animate-shake'
              )}
              placeholder="To"
              aria-label="Filter to date"
              aria-invalid={hasDateValidationError ? true : undefined}
              aria-describedby={
                hasDateValidationError ? 'pagination-filters-error' : undefined
              }
            />
          )}
          {onPageSizeChange && (
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger
                className="w-full sm:w-[100px] min-w-0"
                aria-label="Items per page"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p
          className="text-sm text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing {startItem}-{endItem} of {totalItems}
        </p>
        <nav
          className="flex items-center gap-2"
          aria-label="Pagination"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          <span className="text-sm font-medium px-2" aria-current="page">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </nav>
      </div>
    </div>
  )
}

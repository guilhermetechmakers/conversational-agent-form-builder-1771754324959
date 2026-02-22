import { Link } from 'react-router-dom'
import { Database, MessageSquare, AlertCircle, RotateCcw } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { CapturedField } from '@/types'

export interface EmptyStateCta {
  label: string
  to?: string
  onClick?: () => void
}

const DEFAULT_EMPTY_CTA: EmptyStateCta = {
  label: 'Back to sessions',
  to: '/dashboard/sessions',
}

export interface SessionExtractedDataProps {
  capturedFields: CapturedField[]
  notes?: string
  isReviewed?: boolean
  onNotesChange?: (notes: string) => void
  onMarkReviewed?: () => void
  isMarkingReviewed?: boolean
  emptyStateCta?: EmptyStateCta
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
}

const NOTES_INPUT_ID = 'session-extracted-notes'

const ICON_SIZE_EMPTY = 'h-10 w-10'
const ICON_SIZE_INLINE = 'h-5 w-5'

export function SessionExtractedData({
  capturedFields,
  notes = '',
  isReviewed = false,
  onNotesChange,
  onMarkReviewed,
  isMarkingReviewed = false,
  emptyStateCta = DEFAULT_EMPTY_CTA,
  isLoading = false,
  error = null,
  onRetry,
}: SessionExtractedDataProps) {
  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="pb-4 p-4 sm:p-6">
        <h1 className="text-lg sm:text-xl font-semibold leading-none tracking-tight text-foreground">
          Structured Fields
        </h1>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
        {isLoading ? (
          <div
            className="space-y-4"
            role="status"
            aria-label="Loading extracted data"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className={cn(
                  'h-14 rounded-lg skeleton-shimmer',
                  i % 2 === 0 ? 'w-full' : 'w-[90%]'
                )}
              />
            ))}
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center py-10 sm:py-12 text-center rounded-lg border border-border bg-background"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle
              className={cn(ICON_SIZE_EMPTY, 'text-notification mb-4')}
              aria-hidden
            />
            <p className="text-sm font-medium text-notification">
              Failed to load extracted data
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              {error.message ??
                'An error occurred while loading the structured fields.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {onRetry && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onRetry}
                  className="gap-2"
                  aria-label="Retry loading extracted data"
                >
                  <RotateCcw className={ICON_SIZE_INLINE} aria-hidden />
                  Retry
                </Button>
              )}
              <Button asChild variant="secondary" size="sm">
                <Link
                  to="/dashboard/sessions"
                  className="gap-2"
                  aria-label="Back to sessions list"
                >
                  Back to sessions
                </Link>
              </Button>
            </div>
          </div>
        ) : capturedFields.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 sm:py-12 text-center rounded-lg border border-dashed border-border bg-muted/30"
            role="status"
            aria-label="No extracted data"
          >
            <Database
              className={cn(ICON_SIZE_EMPTY, 'text-muted-foreground mb-4')}
              aria-hidden
            />
            <p className="text-base sm:text-lg font-semibold text-foreground">
              No fields captured
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-[240px] px-2">
              This session has no extracted structured data. View the
              conversation to see what was discussed.
            </p>
            {emptyStateCta.to ? (
              <Button asChild className="mt-4" size="default">
                <Link to={emptyStateCta.to}>{emptyStateCta.label}</Link>
              </Button>
            ) : emptyStateCta.onClick ? (
              <Button
                className="mt-4 gap-2"
                size="default"
                onClick={emptyStateCta.onClick}
                aria-label="View conversation transcript"
              >
                <MessageSquare className={ICON_SIZE_INLINE} aria-hidden />
                {emptyStateCta.label}
              </Button>
            ) : (
              <Button asChild className="mt-4" size="default">
                <Link to="/dashboard/sessions">{emptyStateCta.label}</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {capturedFields.map((field, i) => (
              <div
                key={field.fieldId ?? i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-card"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    Field {i + 1}
                    {field.type && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        ({field.type})
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground truncate">
                    {String(field.validatedValue ?? '—')}
                  </span>
                </div>
                {field.validationWarning && (
                  <span
                    className="text-xs text-notification shrink-0"
                    role="status"
                  >
                    {field.validationWarning}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="space-y-2">
              <Label htmlFor={NOTES_INPUT_ID} className="text-sm font-medium">
                Internal Notes
              </Label>
              <Textarea
                id={NOTES_INPUT_ID}
                placeholder="Add internal notes for QA or audit..."
                rows={3}
                value={notes}
                onChange={(e) => onNotesChange?.(e.target.value)}
                className="resize-none"
                aria-label="Internal notes for QA or audit"
              />
            </div>

            {onMarkReviewed && (
              <Button
                variant={isReviewed ? 'secondary' : 'default'}
                className="w-full transition-all duration-200 hover:scale-[1.01] disabled:opacity-75"
                onClick={onMarkReviewed}
                disabled={isMarkingReviewed || isReviewed}
                aria-label={
                  isReviewed ? 'Session reviewed' : 'Mark session as reviewed'
                }
              >
                {isMarkingReviewed
                  ? 'Marking...'
                  : isReviewed
                    ? 'Reviewed'
                    : 'Mark as reviewed'}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

import { Link } from 'react-router-dom'
import { Database, MessageSquare } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
}

const NOTES_INPUT_ID = 'session-extracted-notes'

export function SessionExtractedData({
  capturedFields,
  notes = '',
  isReviewed = false,
  onNotesChange,
  onMarkReviewed,
  isMarkingReviewed = false,
  emptyStateCta = DEFAULT_EMPTY_CTA,
}: SessionExtractedDataProps) {
  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-xl font-semibold leading-none tracking-tight">
          Structured Fields
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {capturedFields.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border bg-background/50"
            role="status"
            aria-label="No extracted data"
          >
            <Database className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <p className="text-lg font-semibold text-foreground">
              No fields captured
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-[240px]">
              This session has no extracted structured data. View the conversation
              to see what was discussed.
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
                <MessageSquare className="h-4 w-4" aria-hidden />
                {emptyStateCta.label}
              </Button>
            ) : (
              <Button asChild className="mt-4" size="default">
                <Link to="/dashboard/sessions">{emptyStateCta.label}</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {capturedFields.map((field, i) => (
              <div
                key={field.fieldId ?? i}
                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-card"
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
                  <span className="text-xs text-notification shrink-0" role="status">
                    {field.validationWarning}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

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
            aria-label={isReviewed ? 'Session reviewed' : 'Mark session as reviewed'}
          >
            {isMarkingReviewed ? 'Marking...' : isReviewed ? 'Reviewed' : 'Mark as reviewed'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

import { Link } from 'react-router-dom'
import { Database, MessageSquare } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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
    <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Structured Fields</h2>

      {capturedFields.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 text-center"
          role="status"
        >
          <Database className="h-12 w-12 text-[#C0C6D1] mb-4" />
          <p className="text-lg font-semibold mt-4 text-white">
            No fields captured
          </p>
          <p className="text-sm text-[#C0C6D1] mt-2 max-w-[240px]">
            This session has no extracted structured data. View the conversation
            to see what was discussed.
          </p>
          {emptyStateCta.to ? (
            <Button
              asChild
              className="mt-4 px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition duration-150 ease-in-out"
            >
              <Link to={emptyStateCta.to}>{emptyStateCta.label}</Link>
            </Button>
          ) : emptyStateCta.onClick ? (
            <Button
              className="mt-4 px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition duration-150 ease-in-out"
              onClick={emptyStateCta.onClick}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {emptyStateCta.label}
            </Button>
          ) : (
            <Button
              asChild
              className="mt-4 px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition duration-150 ease-in-out"
            >
              <Link to="/dashboard/sessions">{emptyStateCta.label}</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {capturedFields.map((field, i) => (
            <div
              key={field.fieldId ?? i}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium">
                  Field {i + 1}
                  {field.type && (
                    <span className="ml-2 text-xs font-normal text-[#C0C6D1]">
                      ({field.type})
                    </span>
                  )}
                </span>
                <span className="text-sm text-[#C0C6D1] truncate">
                  {String(field.validatedValue ?? '—')}
                </span>
              </div>
              {field.validationWarning && (
                <span className="text-xs text-[#FFD600] shrink-0">
                  {field.validationWarning}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-2">
        <Label htmlFor={NOTES_INPUT_ID} className="text-sm font-medium">
          Internal Notes
        </Label>
        <Textarea
          id={NOTES_INPUT_ID}
          placeholder="Add internal notes for QA or audit..."
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange?.(e.target.value)}
          className="resize-none bg-[#181B20] border-[#31343A] text-white placeholder:text-[#C0C6D1] focus:ring-[#26C6FF]"
          aria-label="Internal notes for QA or audit"
        />
      </div>

      {onMarkReviewed && (
        <Button
          variant={isReviewed ? 'secondary' : 'default'}
          className="mt-4 w-full px-4 py-2 bg-[#23262B] rounded-lg shadow-md hover:bg-[#26C6FF] transition duration-150 ease-in-out disabled:opacity-75"
          onClick={onMarkReviewed}
          disabled={isMarkingReviewed || isReviewed}
          aria-label={isReviewed ? 'Session reviewed' : 'Mark session as reviewed'}
        >
          {isMarkingReviewed ? 'Marking...' : isReviewed ? 'Reviewed' : 'Mark as reviewed'}
        </Button>
      )}
    </div>
  )
}

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** When true, applies error state styling using design tokens */
  error?: boolean
  /** Accessible label for the textarea. When provided, renders an associated Label. */
  label?: React.ReactNode
  /** Error message shown below the textarea when error is true */
  errorMessage?: string
  /** Helper or hint text shown below the textarea */
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      label,
      errorMessage,
      hint,
      id: idProp,
      'aria-label': ariaLabelProp,
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = idProp ?? generatedId

    const hasLabel = label != null && label !== ''
    const hasDescription = errorMessage != null || hint != null
    const descriptionId = hasDescription ? `${id}-description` : undefined

    const ariaLabel = ariaLabelProp ?? (typeof label === 'string' ? label : undefined)
    const ariaDescribedBy = [ariaDescribedByProp, descriptionId].filter(Boolean).join(' ') || undefined

    return (
      <div className="space-y-2 w-full">
        {hasLabel && (
          <Label
            htmlFor={id}
            className="text-sm font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </Label>
        )}
        <textarea
          id={id}
          aria-invalid={error}
          aria-label={!hasLabel ? ariaLabel : undefined}
          aria-describedby={ariaDescribedBy}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border px-4 py-2 font-normal',
            'bg-card text-foreground placeholder:text-muted-foreground',
            'border-border ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            'invalid:border-destructive invalid:focus-visible:ring-destructive',
            error && 'border-destructive focus-visible:ring-destructive',
            'min-w-0',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && errorMessage && (
          <p
            id={descriptionId}
            className="text-sm text-destructive animate-fade-in"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        {!error && hint && (
          <p className="text-sm text-muted-foreground" id={descriptionId}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }

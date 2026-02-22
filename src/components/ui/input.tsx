import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle } from 'lucide-react'

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size'
  > {
  /** When true, applies error state styling using design tokens */
  error?: boolean
  /** Accessible label for the input. When provided, renders an associated Label. */
  label?: React.ReactNode
  /** Error message shown below the input when error is true */
  errorMessage?: string
  /** Helper or hint text shown below the input */
  hint?: string
  /** When true, shows loading spinner and disables the input */
  isLoading?: boolean
  /** Optional icon to display on the left side of the input */
  leftIcon?: React.ReactNode
  /** Optional icon to display on the right side of the input */
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      error,
      label,
      errorMessage,
      hint,
      isLoading,
      leftIcon,
      rightIcon,
      id: idProp,
      disabled,
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

    const ariaLabel =
      ariaLabelProp ?? (typeof label === 'string' ? label : undefined)
    const ariaDescribedBy =
      [ariaDescribedByProp, descriptionId].filter(Boolean).join(' ') || undefined

    const isDisabled = disabled || isLoading
    const showRightIcon = rightIcon || isLoading

    const inputElement = (
      <div className="relative w-full">
        {leftIcon && (
          <div
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          >
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          id={id}
          disabled={isDisabled}
          aria-invalid={error}
          aria-label={!hasLabel ? ariaLabel : undefined}
          aria-describedby={ariaDescribedBy}
          aria-busy={isLoading}
          className={cn(
            'flex h-10 w-full rounded-lg border px-4 py-2 text-sm font-normal',
            'bg-card text-foreground placeholder:text-muted-foreground',
            'border-border ring-offset-background shadow-input',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            'invalid:border-destructive invalid:focus-visible:ring-destructive',
            error && 'border-destructive focus-visible:ring-destructive',
            'min-w-0',
            leftIcon && 'pl-9',
            (showRightIcon || error) && 'pr-9',
            error && 'animate-shake',
            className
          )}
          ref={ref}
          {...props}
        />
        {showRightIcon && (
          <div
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              rightIcon
            )}
          </div>
        )}
        {error && !showRightIcon && (
          <div
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
            aria-hidden
          >
            <AlertCircle className="h-4 w-4" />
          </div>
        )}
      </div>
    )

    if (!hasLabel && !hasDescription) {
      return inputElement
    }

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
        {inputElement}
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
Input.displayName = 'Input'

export { Input }

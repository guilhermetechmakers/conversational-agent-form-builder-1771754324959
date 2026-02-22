import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MessageSquare, GripVertical, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { AgentField, FieldType } from '@/types'

/** Generates unique IDs for form controls to ensure accessibility */
const fieldControlId = (fieldId: string, suffix: string) => `field-${fieldId}-${suffix}`

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'date', label: 'Date' },
]

const VALIDATION_RULES = [
  { value: 'minLength', label: 'Min length' },
  { value: 'maxLength', label: 'Max length' },
  { value: 'pattern', label: 'Regex pattern' },
  { value: 'min', label: 'Min value' },
  { value: 'max', label: 'Max value' },
]

export interface FieldsEditorProps {
  fields: AgentField[]
  onFieldsChange: (fields: AgentField[]) => void
  onAddField: () => void
  fieldError?: string
  isLoading?: boolean
}

function SortableFieldItem({
  field,
  onUpdate,
  onRemove,
}: {
  field: AgentField
  onUpdate: (updates: Partial<AgentField>) => void
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const options = field.options ?? []
  const addOption = () => {
    const newOpt = { label: `Option ${options.length + 1}`, value: `opt-${options.length + 1}` }
    onUpdate({ options: [...options, newOpt] })
  }
  const updateOption = (idx: number, updates: Partial<{ label: string; value: string }>) => {
    const next = [...options]
    next[idx] = { ...next[idx], ...updates }
    onUpdate({ options: next })
  }
  const removeOption = (idx: number) => {
    onUpdate({ options: options.filter((_, i) => i !== idx) })
  }

  const fieldId = field.id
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-start gap-2 rounded-lg border border-border p-4 transition-all duration-200',
        isDragging ? 'opacity-80 shadow-lg z-10 bg-card' : 'bg-card/50'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab active:cursor-grabbing touch-none rounded p-1 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        role="button"
        tabIndex={0}
        aria-label={`Drag to reorder field: ${field.label || 'Untitled'}`}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" aria-hidden />
      </div>
      <div className="flex-1 space-y-3 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor={fieldControlId(fieldId, 'label')}>Label</Label>
            <Input
              id={fieldControlId(fieldId, 'label')}
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Field label"
              aria-label="Field label"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldControlId(fieldId, 'type')}>Type</Label>
            <Select
              value={field.type}
              onValueChange={(v) => onUpdate({ type: v as FieldType })}
            >
              <SelectTrigger id={fieldControlId(fieldId, 'type')} aria-label="Field type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor={fieldControlId(fieldId, 'placeholder')}>Placeholder</Label>
            <Input
              id={fieldControlId(fieldId, 'placeholder')}
              value={field.placeholder ?? ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Sample value"
              aria-label="Placeholder text"
            />
          </div>
          <div className="flex-1 min-w-[140px] space-y-2">
            <Label htmlFor={fieldControlId(fieldId, 'sampleData')}>Sample data</Label>
            <Input
              id={fieldControlId(fieldId, 'sampleData')}
              value={field.sampleData ?? ''}
              onChange={(e) => onUpdate({ sampleData: e.target.value })}
              placeholder="e.g. John Doe"
              aria-label="Sample data for preview"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch
              id={fieldControlId(fieldId, 'required')}
              checked={field.required}
              onCheckedChange={(v) => onUpdate({ required: v })}
              aria-label={`Field is ${field.required ? 'required' : 'optional'}`}
            />
            <Label htmlFor={fieldControlId(fieldId, 'required')} className="cursor-pointer">
              Required
            </Label>
          </div>
        </div>
        {field.type === 'select' && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={opt.label}
                    onChange={(e) => updateOption(idx, { label: e.target.value })}
                    placeholder="Label"
                    aria-label={`Option ${idx + 1} label`}
                  />
                  <Input
                    value={opt.value}
                    onChange={(e) => updateOption(idx, { value: e.target.value })}
                    placeholder="Value"
                    aria-label={`Option ${idx + 1} value`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(idx)}
                    className="text-destructive hover:text-destructive"
                    aria-label={`Remove option ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                aria-label="Add select option"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add option
              </Button>
            </div>
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          <Label className="w-full">Validation rules</Label>
          {VALIDATION_RULES.map((rule) => {
            const val = field.validation?.[rule.value]
            return (
              <div key={rule.value} className="flex items-center gap-2">
                <Label
                  htmlFor={fieldControlId(fieldId, `validation-${rule.value}`)}
                  className="text-xs text-muted-foreground"
                >
                  {rule.label}
                </Label>
                <Input
                  id={fieldControlId(fieldId, `validation-${rule.value}`)}
                  className="w-24"
                  value={typeof val === 'string' || typeof val === 'number' ? String(val) : ''}
                  onChange={(e) =>
                    onUpdate({
                      validation: {
                        ...field.validation,
                        [rule.value]: e.target.value || undefined,
                      },
                    })
                  }
                  placeholder="-"
                  aria-label={`Validation: ${rule.label}`}
                />
              </div>
            )
          })}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-destructive hover:text-destructive shrink-0"
        aria-label={`Remove field: ${field.label || 'Untitled'}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  )
}

function FieldsEditorSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading form fields">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-start gap-2 rounded-lg border border-border p-4 bg-card/50"
        >
          <Skeleton className="h-5 w-5 mt-2 rounded shrink-0" />
          <div className="flex-1 space-y-3 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-10 w-10 rounded shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function FieldsEditor({
  fields,
  onFieldsChange,
  onAddField,
  fieldError,
  isLoading = false,
}: FieldsEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onFieldsChange(arrayMove(fields, oldIndex, newIndex))
  }

  const updateField = (fieldId: string, updates: Partial<AgentField>) => {
    onFieldsChange(
      fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    )
  }

  const removeField = (fieldId: string) => {
    onFieldsChange(fields.filter((f) => f.id !== fieldId))
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" aria-hidden />
            Fields
          </CardTitle>
          <CardDescription>Add, remove, and reorder fields to collect</CardDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddField}
          aria-label="Add form field"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add field
        </Button>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {isLoading ? (
                <FieldsEditorSkeleton />
              ) : fields.length === 0 ? (
                <div
                  className={cn(
                    'rounded-xl border-2 border-dashed p-8 sm:p-12 text-center animate-fade-in',
                    'border-border bg-muted/30',
                    fieldError && 'border-destructive bg-destructive/10'
                  )}
                  role="status"
                  aria-label="No form fields added yet. Add your first field to get started."
                >
                  <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-4">
                    <MessageSquare
                      className="h-12 w-12 text-primary"
                      aria-hidden
                    />
                  </div>
                  <p className="font-semibold text-lg text-foreground">No fields yet</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                    Add fields to collect information conversationally. Drag to reorder once added.
                  </p>
                  {fieldError && (
                    <p className="text-sm text-destructive mt-2" role="alert">
                      {fieldError}
                    </p>
                  )}
                  <Button
                    variant="default"
                    size="lg"
                    className={cn(
                      'mt-6 gap-2 transition-all duration-200',
                      'hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]',
                      'min-h-11 px-6'
                    )}
                    onClick={onAddField}
                    aria-label="Add your first form field to get started"
                  >
                    <Plus className="h-5 w-5" aria-hidden />
                    Add your first field
                  </Button>
                </div>
              ) : (
                fields.map((field) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    onUpdate={(u) => updateField(field.id, u)}
                    onRemove={() => removeField(field.id)}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
}

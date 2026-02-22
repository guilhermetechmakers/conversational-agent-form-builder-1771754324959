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
import type { AgentField, FieldType } from '@/types'

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 rounded-lg border border-border p-4 transition-all duration-200 ${
        isDragging ? 'opacity-80 shadow-lg z-10 bg-card' : 'bg-card/50'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab active:cursor-grabbing touch-none rounded p-1 hover:bg-muted"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-3 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Field label"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={field.type}
              onValueChange={(v) => onUpdate({ type: v as FieldType })}
            >
              <SelectTrigger>
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
            <Label>Placeholder</Label>
            <Input
              value={field.placeholder ?? ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Sample value"
            />
          </div>
          <div className="flex-1 min-w-[140px] space-y-2">
            <Label>Sample data</Label>
            <Input
              value={field.sampleData ?? ''}
              onChange={(e) => onUpdate({ sampleData: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch
              checked={field.required}
              onCheckedChange={(v) => onUpdate({ required: v })}
            />
            <Label>Required</Label>
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
                  />
                  <Input
                    value={opt.value}
                    onChange={(e) => updateOption(idx, { value: e.target.value })}
                    placeholder="Value"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(idx)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4" />
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
                <Label className="text-xs text-muted-foreground">{rule.label}</Label>
                <Input
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
        aria-label="Remove field"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function FieldsEditor({ fields, onFieldsChange, onAddField }: FieldsEditorProps) {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Fields
          </CardTitle>
          <CardDescription>Add, remove, and reorder fields to collect</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={onAddField}>
          <Plus className="h-4 w-4" />
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
              {fields.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium text-muted-foreground">No fields yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add fields to collect information conversationally
                  </p>
                  <Button variant="outline" className="mt-4" onClick={onAddField}>
                    <Plus className="h-4 w-4" />
                    Add first field
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

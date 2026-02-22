import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Settings,
  MessageSquare,
  Palette,
  FileText,
  Shield,
  Eye,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
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

const TONE_OPTIONS = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
]

const defaultField = (): AgentField => ({
  id: crypto.randomUUID(),
  type: 'text',
  label: 'New field',
  required: true,
  placeholder: '',
})

export function AgentBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [name, setName] = useState(isNew ? '' : 'Lead Capture')
  const [slug, setSlug] = useState(isNew ? '' : 'lead-capture')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState<AgentField[]>(
    isNew ? [defaultField()] : [
      { id: '1', type: 'text', label: 'Full name', required: true, placeholder: 'John Doe' },
      { id: '2', type: 'email', label: 'Email', required: true, placeholder: 'john@example.com' },
    ]
  )
  const [tone, setTone] = useState('friendly')
  const [systemInstructions, setSystemInstructions] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#26C6FF')
  const [accentColor, setAccentColor] = useState('#00FF66')
  const [faq, setFaq] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')

  const addField = () => {
    setFields((f) => [...f, defaultField()])
  }

  const removeField = (fieldId: string) => {
    setFields((f) => f.filter((x) => x.id !== fieldId))
  }

  const updateField = (fieldId: string, updates: Partial<AgentField>) => {
    setFields((f) =>
      f.map((x) => (x.id === fieldId ? { ...x, ...updates } : x))
    )
  }

  const handleSave = () => {
    toast.success('Agent saved')
    if (isNew) navigate('/dashboard/agents')
  }

  const handlePublish = () => {
    toast.success('Agent published! Share your public link.')
    if (isNew) navigate('/dashboard/agents')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {isNew ? 'Create Agent' : 'Edit Agent'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure fields, persona, and appearance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleSave}>
            Save Draft
          </Button>
          <Button onClick={handlePublish}>Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Builder panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Agent metadata
              </CardTitle>
              <CardDescription>Name, slug, and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (isNew) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                  }}
                  placeholder="My Agent"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-agent"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this agent collect?"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Fields
                </CardTitle>
                <CardDescription>Fields to collect conversationally</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addField}>
                <Plus className="h-4 w-4" />
                Add field
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-2 rounded-lg border border-border p-4"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-grab" />
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateField(field.id, { label: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(v) =>
                              updateField(field.id, { type: v as FieldType })
                            }
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
                      <div className="flex items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <Label>Placeholder</Label>
                          <Input
                            value={field.placeholder ?? ''}
                            onChange={(e) =>
                              updateField(field.id, {
                                placeholder: e.target.value,
                              })
                            }
                            placeholder="Sample value"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(v) =>
                              updateField(field.id, { required: v })
                            }
                          />
                          <Label>Required</Label>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="persona">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="persona" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Persona
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="context" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Context
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>
            <TabsContent value="persona" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TONE_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>System instructions</Label>
                    <Textarea
                      value={systemInstructions}
                      onChange={(e) => setSystemInstructions(e.target.value)}
                      placeholder="How should the agent behave? What persona to adopt?"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appearance" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-14 rounded border border-border cursor-pointer"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Accent color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="h-10 w-14 rounded border border-border cursor-pointer"
                        />
                        <Input
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="context" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>FAQ / Context</Label>
                    <Textarea
                      value={faq}
                      onChange={(e) => setFaq(e.target.value)}
                      placeholder="Paste FAQs or product docs for the agent to reference"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="advanced" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://your-crm.com/webhook"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview pane */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg border border-border p-4 min-h-[300px] bg-background"
                style={{
                  '--tw-ring-color': primaryColor,
                } as React.CSSProperties}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    A
                  </div>
                  <span className="font-medium">{name || 'Agent name'}</span>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Live preview will show here when connected to LLM.</p>
                  <p>Configure fields and persona, then test in the published chat.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

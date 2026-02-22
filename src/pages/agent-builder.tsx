import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare, Palette, FileText, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  AgentMetadata,
  FieldsEditor,
  PersonaSettings,
  AppearanceSettings,
  ContextUpload,
  AdvancedSettings,
  PreviewPane,
  SavePublishButtons,
} from '@/components/agent-builder'
import type { AgentField } from '@/types'

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
  const [tags, setTags] = useState<string[]>([])
  const [fields, setFields] = useState<AgentField[]>(
    isNew ? [defaultField()] : [
      { id: '1', type: 'text', label: 'Full name', required: true, placeholder: 'John Doe' },
      { id: '2', type: 'email', label: 'Email', required: true, placeholder: 'john@example.com' },
    ]
  )
  const [tone, setTone] = useState('friendly')
  const [systemInstructions, setSystemInstructions] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [primaryColor, setPrimaryColor] = useState('#26C6FF')
  const [accentColor, setAccentColor] = useState('#00FF66')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [faq, setFaq] = useState('')
  const [contextFiles, setContextFiles] = useState<string[]>([])
  const [contextUrls, setContextUrls] = useState<string[]>([])
  const [webhookUrls, setWebhookUrls] = useState<string[]>([])
  const [passcodeEnabled, setPasscodeEnabled] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [rateLimit, setRateLimit] = useState(60)
  const [retentionDays, setRetentionDays] = useState(30)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isIndexing, setIsIndexing] = useState(false)

  const addField = () => {
    setFields((f) => [...f, defaultField()])
  }

  const validationErrors: string[] = []
  if (!name.trim()) validationErrors.push('Name is required')
  if (!slug.trim()) validationErrors.push('Slug is required')
  if (fields.length === 0) validationErrors.push('At least one field is required')
  const canPublish = name.trim().length > 0 && slug.trim().length > 0 && fields.length > 0

  const handleSave = async () => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0])
      return
    }
    setIsSaving(true)
    try {
      // API call would go here - supabase.functions.invoke('save-agent', { body: {...} })
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Agent saved')
      if (isNew) navigate('/dashboard/agents')
    } catch {
      toast.error('Failed to save agent')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!canPublish || validationErrors.length > 0) {
      toast.error(validationErrors[0] ?? 'Please fix validation errors')
      return
    }
    setIsPublishing(true)
    try {
      // API call would go here - supabase.functions.invoke('publish-agent', { body: {...} })
      await new Promise((r) => setTimeout(r, 500))
      setStatus('published')
      toast.success('Agent published! Share your public link.')
      if (isNew) navigate('/dashboard/agents')
    } catch {
      toast.error('Failed to publish agent')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleIndexKnowledge = async () => {
    setIsIndexing(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      toast.success('Knowledge indexed')
    } catch {
      toast.error('Failed to index knowledge')
    } finally {
      setIsIndexing(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {isNew ? 'Create Agent' : 'Edit Agent'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure fields, persona, and appearance
          </p>
        </div>
        <SavePublishButtons
          status={status}
          isSaving={isSaving}
          isPublishing={isPublishing}
          onSave={handleSave}
          onPublish={handlePublish}
          validationErrors={validationErrors}
          canPublish={canPublish}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AgentMetadata
            name={name}
            slug={slug}
            description={description}
            tags={tags}
            onNameChange={setName}
            onSlugChange={setSlug}
            onDescriptionChange={setDescription}
            onTagsChange={setTags}
            isNew={isNew}
          />

          <FieldsEditor
            fields={fields}
            onFieldsChange={setFields}
            onAddField={addField}
          />

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
              <PersonaSettings
                tone={tone}
                systemInstructions={systemInstructions}
                avatarUrl={avatarUrl}
                onToneChange={setTone}
                onSystemInstructionsChange={setSystemInstructions}
                onAvatarChange={(url) => setAvatarUrl(url ?? undefined)}
              />
            </TabsContent>
            <TabsContent value="appearance" className="mt-4">
              <AppearanceSettings
                primaryColor={primaryColor}
                accentColor={accentColor}
                theme={theme}
                logoUrl={avatarUrl}
                onPrimaryColorChange={setPrimaryColor}
                onAccentColorChange={setAccentColor}
                onThemeChange={setTheme}
              />
            </TabsContent>
            <TabsContent value="context" className="mt-4">
              <ContextUpload
                faq={faq}
                files={contextFiles}
                urls={contextUrls}
                onFaqChange={setFaq}
                onFilesChange={setContextFiles}
                onUrlsChange={setContextUrls}
                onIndexKnowledge={handleIndexKnowledge}
                isIndexing={isIndexing}
              />
            </TabsContent>
            <TabsContent value="advanced" className="mt-4">
              <AdvancedSettings
                webhookUrls={webhookUrls}
                passcodeEnabled={passcodeEnabled}
                passcode={passcode}
                rateLimit={rateLimit}
                retentionDays={retentionDays}
                onWebhookUrlsChange={setWebhookUrls}
                onPasscodeEnabledChange={setPasscodeEnabled}
                onPasscodeChange={setPasscode}
                onRateLimitChange={setRateLimit}
                onRetentionDaysChange={setRetentionDays}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <PreviewPane
            agentName={name}
            primaryColor={primaryColor}
            accentColor={accentColor}
            theme={theme}
            avatarUrl={avatarUrl}
            fields={fields}
            systemInstructions={systemInstructions}
          />
        </div>
      </div>
    </div>
  )
}

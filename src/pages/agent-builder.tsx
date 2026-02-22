import { useState, useCallback, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { MessageSquare, Palette, FileText, Shield, ChevronRight, AlertCircle } from 'lucide-react'
import { DESIGN_TOKENS } from '@/lib/design-tokens'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
import { useAgent, useSaveAgent, usePublishAgent } from '@/hooks/useAgent'
import type { AgentField } from '@/types'

const defaultField = (): AgentField => ({
  id: crypto.randomUUID(),
  type: 'text',
  label: 'New field',
  required: true,
  placeholder: '',
})

function AgentBuilderSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function AgentBuilderError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="animate-fade-in" role="alert">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="rounded-full bg-destructive/10 p-4 mb-4" aria-hidden>
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Failed to load agent</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We couldn&apos;t load this agent. It may have been deleted or you may not have access.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/dashboard/agents">Back to agents</Link>
          </Button>
          <Button onClick={onRetry} aria-label="Retry loading agent">
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function AgentBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new' || !id

  const { data: agent, isLoading, isError, refetch } = useAgent(id, !isNew)
  const saveMutation = useSaveAgent()
  const publishMutation = usePublishAgent()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [fields, setFields] = useState<AgentField[]>(() => (isNew ? [defaultField()] : []))
  const [tone, setTone] = useState('friendly')
  const [systemInstructions, setSystemInstructions] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [primaryColor, setPrimaryColor] = useState<string>(DESIGN_TOKENS.primaryHex)
  const [accentColor, setAccentColor] = useState<string>(DESIGN_TOKENS.secondaryAccentHex)
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

  const hydrateFromAgent = useCallback(() => {
    if (!agent) return
    setName(agent.name)
    setSlug(agent.slug)
    setDescription(agent.description ?? '')
    setTags(agent.tags ?? [])
    setFields(agent.fields?.length ? agent.fields : [defaultField()])
    setTone(agent.persona?.tone ?? 'friendly')
    setSystemInstructions(agent.persona?.systemInstructions ?? '')
    setAvatarUrl(agent.persona?.avatarUrl)
    setPrimaryColor(agent.appearance?.primaryColor ?? DESIGN_TOKENS.primaryHex)
    setAccentColor(agent.appearance?.accentColor ?? DESIGN_TOKENS.secondaryAccentHex)
    setTheme(agent.appearance?.theme ?? 'dark')
    setFaq(agent.context?.faq ?? '')
    setContextFiles(agent.context?.files ?? [])
    setContextUrls(agent.context?.urls ?? [])
    setWebhookUrls(agent.advanced?.webhookUrls ?? [])
    setPasscodeEnabled(!!agent.advanced?.passcode)
    setPasscode(agent.advanced?.passcode ?? '')
    setRateLimit(agent.advanced?.rateLimit ?? 60)
    setRetentionDays(agent.advanced?.retentionDays ?? 30)
    setStatus(agent.status)
  }, [agent])

  useEffect(() => {
    if (agent && !isNew) {
      hydrateFromAgent()
    }
  }, [agent, isNew, hydrateFromAgent])


  const addField = () => {
    setFields((f) => [...f, defaultField()])
  }

  const validationErrors: string[] = []
  if (!name.trim()) validationErrors.push('Name is required')
  if (!slug.trim()) validationErrors.push('Slug is required')
  if (fields.length === 0) validationErrors.push('At least one field is required')
  const canPublish = name.trim().length > 0 && slug.trim().length > 0 && fields.length > 0

  const fieldErrors = {
    name: !name.trim() ? 'Name is required' : undefined,
    slug: !slug.trim() ? 'Slug is required' : undefined,
    fields: fields.length === 0 ? 'At least one field is required' : undefined,
  }

  const handleSave = async () => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0])
      return
    }
    try {
      const payload = {
        name,
        slug,
        description,
        tags,
        fields,
        persona: { tone, systemInstructions, avatarUrl },
        appearance: { primaryColor, accentColor, theme, logoUrl: avatarUrl },
        context: { faq, files: contextFiles, urls: contextUrls },
        advanced: {
          webhookUrls,
          passcodeEnabled,
          passcode: passcodeEnabled ? passcode : undefined,
          rateLimit,
          retentionDays,
        },
      }
      const saved = await saveMutation.mutateAsync({
        id: isNew ? null : id ?? null,
        payload,
      })
      toast.success(isNew ? 'Agent created successfully' : 'Agent saved')
      if (isNew) navigate(`/dashboard/agents/${saved.id}`)
    } catch {
      toast.error('Failed to save agent')
    }
  }

  const handlePublish = async () => {
    if (!canPublish || validationErrors.length > 0) {
      toast.error(validationErrors[0] ?? 'Please fix validation errors')
      return
    }
    const agentId = isNew ? null : id
    if (!agentId) {
      try {
        const payload = {
          name,
          slug,
          description,
          tags,
          fields,
          persona: { tone, systemInstructions, avatarUrl },
          appearance: { primaryColor, accentColor, theme, logoUrl: avatarUrl },
          context: { faq, files: contextFiles, urls: contextUrls },
          advanced: {
            webhookUrls,
            passcodeEnabled,
            passcode: passcodeEnabled ? passcode : undefined,
            rateLimit,
            retentionDays,
          },
        }
        const saved = await saveMutation.mutateAsync({ id: null, payload })
        await publishMutation.mutateAsync(saved.id)
        setStatus('published')
        toast.success('Agent published! Share your public link.')
        navigate(`/dashboard/agents/${saved.id}`)
      } catch {
        toast.error('Failed to publish agent')
      }
      return
    }
    try {
      await publishMutation.mutateAsync(agentId)
      setStatus('published')
      toast.success('Agent published! Share your public link.')
    } catch {
      toast.error('Failed to publish agent')
    }
  }

  const handleIndexKnowledge = async () => {
    await new Promise((r) => setTimeout(r, 1500))
    toast.success('Knowledge indexed')
  }

  const [isIndexing, setIsIndexing] = useState(false)
  const onIndexKnowledge = async () => {
    setIsIndexing(true)
    try {
      await handleIndexKnowledge()
    } finally {
      setIsIndexing(false)
    }
  }

  if (!isNew && isLoading) {
    return <AgentBuilderSkeleton />
  }

  if (!isNew && isError) {
    return <AgentBuilderError onRetry={() => refetch()} />
  }

  const isSaving = saveMutation.isPending
  const isPublishing = publishMutation.isPending

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs */}
      <nav
        className="flex items-center gap-2 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link
          to="/dashboard"
          className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <Link
          to="/dashboard/agents"
          className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
        >
          Agents
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-foreground font-medium">
          {isNew ? 'Create Agent' : 'Edit Agent'}
        </span>
      </nav>

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
            errors={fieldErrors}
          />

          <FieldsEditor
            fields={fields}
            onFieldsChange={setFields}
            onAddField={addField}
            fieldError={fieldErrors.fields}
          />

          <Tabs defaultValue="persona" aria-label="Agent configuration tabs">
            <TabsList className="grid w-full grid-cols-4" role="tablist">
              <TabsTrigger value="persona" className="flex items-center gap-2" role="tab">
                <MessageSquare className="h-4 w-4" aria-hidden />
                Persona
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2" role="tab">
                <Palette className="h-4 w-4" aria-hidden />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="context" className="flex items-center gap-2" role="tab">
                <FileText className="h-4 w-4" aria-hidden />
                Context
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2" role="tab">
                <Shield className="h-4 w-4" aria-hidden />
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
                onIndexKnowledge={onIndexKnowledge}
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

export default AgentBuilderPage

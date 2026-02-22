import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AgentPayload {
  title: string
  slug: string
  description?: string | null
  tags?: string[]
  fields: unknown[]
  persona: Record<string, unknown>
  appearance: Record<string, unknown>
  context?: Record<string, unknown>
  advanced?: Record<string, unknown>
  status?: 'draft' | 'published'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = (await req.json()) as AgentPayload & { id?: string; action?: string }
    const { action, id: bodyId, ...payload } = body
    const isPublish = action === 'publish'
    const id = bodyId

    if (isPublish && id) {
      const { error } = await supabase
        .from('agents')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { data } = await supabase.from('agents').select('*').eq('id', id).single()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { title, slug, description, tags, fields, persona, appearance, context, advanced } = payload as AgentPayload

    if (!title?.trim() || !slug?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Title and slug are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const record = {
      user_id: user.id,
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: description ?? null,
      tags: tags ?? [],
      fields: fields ?? [],
      persona: persona ?? {},
      appearance: appearance ?? {},
      context: context ?? {},
      advanced: advanced ?? {},
      status: (payload as AgentPayload).status ?? 'draft',
    }

    if (id && id !== 'new') {
      const { data, error } = await supabase
        .from('agents')
        .update(record)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase.from('agents').insert(record).select().single()
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

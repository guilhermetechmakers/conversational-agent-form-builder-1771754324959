import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionRecord {
  id: string
  agent_id: string
  user_id: string | null
  status: string
  messages: unknown[]
  captured_fields: unknown[]
  visitor_metadata: Record<string, unknown>
  reviewed_at: string | null
  notes: string | null
  created_at: string
  completed_at: string | null
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

    const url = new URL(req.url)
    let sessionId = url.searchParams.get('id')
    if (!sessionId && req.method === 'POST') {
      const body = await req.json().catch(() => ({})) as { id?: string; sessionId?: string }
      sessionId = body.id ?? body.sessionId ?? null
    }
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: session, error } = await supabase
      .from('sessions')
      .select(`
        id,
        agent_id,
        user_id,
        status,
        messages,
        captured_fields,
        visitor_metadata,
        reviewed_at,
        notes,
        created_at,
        completed_at
      `)
      .eq('id', sessionId)
      .single()

    if (error || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const record = session as SessionRecord

    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('title, user_id')
      .eq('id', record.agent_id)
      .single()

    if (agentError || !agent || (agent as { user_id?: string }).user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const agentData = agent as { title?: string }
    const response = {
      id: record.id,
      agentId: record.agent_id,
      agentName: agentData?.title ?? null,
      status: record.status,
      messages: record.messages ?? [],
      capturedFields: record.captured_fields ?? [],
      visitorMetadata: record.visitor_metadata ?? {},
      reviewedAt: record.reviewed_at,
      notes: record.notes,
      createdAt: record.created_at,
      completedAt: record.completed_at,
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

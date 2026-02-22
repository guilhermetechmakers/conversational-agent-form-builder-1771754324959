import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const body = (await req.json()) as { sessionId: string }
    const { sessionId } = body

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: session } = await supabase
      .from('sessions')
      .select('agent_id, captured_fields, messages')
      .eq('id', sessionId)
      .single()

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: agent } = await supabase
      .from('agents')
      .select('user_id, advanced')
      .eq('id', (session as { agent_id?: string }).agent_id)
      .single()

    if (!agent || (agent as { user_id?: string }).user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const advanced = (agent as { advanced?: { webhookUrls?: string[] } }).advanced
    const webhookUrls = advanced?.webhookUrls ?? []

    if (webhookUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No webhook URLs configured for this agent' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const payload = {
      sessionId,
      capturedFields: (session as { captured_fields?: unknown[] }).captured_fields ?? [],
      messages: (session as { messages?: unknown[] }).messages ?? [],
      timestamp: new Date().toISOString(),
    }

    const results = await Promise.allSettled(
      webhookUrls.map((url) =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      )
    )

    const successCount = results.filter((r) => r.status === 'fulfilled' && r.value.ok).length
    const failedCount = results.length - successCount

    return new Response(
      JSON.stringify({
        success: failedCount === 0,
        sent: successCount,
        failed: failedCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

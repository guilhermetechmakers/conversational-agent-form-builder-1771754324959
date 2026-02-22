-- sessions table (Session Storage & Transcript Management)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  messages JSONB NOT NULL DEFAULT '[]',
  captured_fields JSONB NOT NULL DEFAULT '[]',
  visitor_metadata JSONB DEFAULT '{}',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users can read their own sessions (via agent ownership)
CREATE POLICY "sessions_read_own" ON sessions
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM agents a WHERE a.id = sessions.agent_id AND a.user_id = auth.uid())
  );

-- Users can insert sessions for their agents
CREATE POLICY "sessions_insert_own" ON sessions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM agents a WHERE a.id = sessions.agent_id AND a.user_id = auth.uid())
  );

-- Users can update their own sessions
CREATE POLICY "sessions_update_own" ON sessions
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM agents a WHERE a.id = sessions.agent_id AND a.user_id = auth.uid())
  );

-- Users can delete their own sessions
CREATE POLICY "sessions_delete_own" ON sessions
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM agents a WHERE a.id = sessions.agent_id AND a.user_id = auth.uid())
  );

-- Index for listing sessions by agent and date
CREATE INDEX IF NOT EXISTS idx_sessions_agent_id ON sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

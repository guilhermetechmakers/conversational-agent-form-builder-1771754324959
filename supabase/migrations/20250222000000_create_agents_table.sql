-- agents table (Agent Builder create/edit)
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  fields JSONB NOT NULL DEFAULT '[]',
  persona JSONB NOT NULL DEFAULT '{}',
  appearance JSONB NOT NULL DEFAULT '{}',
  context JSONB DEFAULT '{}',
  advanced JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "agents_read_own" ON agents
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "agents_insert_own" ON agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "agents_update_own" ON agents
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "agents_delete_own" ON agents
  FOR DELETE USING (auth.uid() = user_id);

-- Public read for published agents by slug (for public chat)
CREATE POLICY "agents_public_read_by_slug" ON agents
  FOR SELECT USING (status = 'published');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_agents_updated_at();

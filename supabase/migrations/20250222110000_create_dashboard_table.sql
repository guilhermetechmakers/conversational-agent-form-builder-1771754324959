-- dashboard table
CREATE TABLE IF NOT EXISTS dashboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dashboard ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "dashboard_read_own" ON dashboard
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "dashboard_insert_own" ON dashboard
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "dashboard_update_own" ON dashboard
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "dashboard_delete_own" ON dashboard
  FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_dashboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dashboard_updated_at
  BEFORE UPDATE ON dashboard
  FOR EACH ROW
  EXECUTE FUNCTION update_dashboard_updated_at();

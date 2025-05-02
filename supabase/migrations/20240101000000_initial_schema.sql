-- Create scripts table
CREATE TABLE scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  product_name TEXT NOT NULL,
  features TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create script_blocks table
CREATE TABLE script_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create script_versions table
CREATE TABLE script_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create version_blocks table to store blocks for each version
CREATE TABLE version_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version_id UUID NOT NULL REFERENCES script_versions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_script_blocks_script_id ON script_blocks(script_id);
CREATE INDEX idx_script_versions_script_id ON script_versions(script_id);
CREATE INDEX idx_version_blocks_version_id ON version_blocks(version_id);

-- Enable Row Level Security (RLS)
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE version_blocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own scripts"
  ON scripts FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own scripts"
  ON scripts FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own scripts"
  ON scripts FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own scripts"
  ON scripts FOR DELETE
  USING (auth.uid()::text = user_id);

-- Similar policies for script_blocks
CREATE POLICY "Users can view their own script blocks"
  ON script_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM scripts
    WHERE scripts.id = script_blocks.script_id
    AND scripts.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can insert their own script blocks"
  ON script_blocks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM scripts
    WHERE scripts.id = script_blocks.script_id
    AND scripts.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can update their own script blocks"
  ON script_blocks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM scripts
    WHERE scripts.id = script_blocks.script_id
    AND scripts.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can delete their own script blocks"
  ON script_blocks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM scripts
    WHERE scripts.id = script_blocks.script_id
    AND scripts.user_id = auth.uid()::text
  ));

-- Similar policies for script_versions and version_blocks
CREATE POLICY "Users can view their own script versions"
  ON script_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM scripts
    WHERE scripts.id = script_versions.script_id
    AND scripts.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can insert their own script versions"
  ON script_versions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM scripts
    WHERE scripts.id = script_versions.script_id
    AND scripts.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view their own version blocks"
  ON version_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM script_versions
    JOIN scripts ON scripts.id = script_versions.script_id
    WHERE script_versions.id = version_blocks.version_id
    AND scripts.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can insert their own version blocks"
  ON version_blocks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM script_versions
    JOIN scripts ON scripts.id = script_versions.script_id
    WHERE script_versions.id = version_blocks.version_id
    AND scripts.user_id = auth.uid()::text
  )); 
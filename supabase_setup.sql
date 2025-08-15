-- System Assets table (for platform templates)
CREATE TABLE IF NOT EXISTS public.system_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT, -- MIME type
    size BIGINT, -- File size in bytes
    category TEXT DEFAULT 'other', -- images, documents, icons, logos, other
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Assets table (for user uploads)
CREATE TABLE IF NOT EXISTS public.user_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT, -- MIME type
    size BIGINT, -- File size in bytes
    category TEXT DEFAULT 'other', -- images, documents, icons, logos, other
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    user_id UUID, -- For future auth implementation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.system_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;

-- System assets: read-only for all users
CREATE POLICY "Allow read system assets" ON public.system_assets
    FOR SELECT USING (true);

-- User assets: full access for now (adjust when auth is implemented)
CREATE POLICY "Allow all operations on user assets" ON public.user_assets
    FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_assets_updated_at BEFORE UPDATE ON public.system_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_assets_updated_at BEFORE UPDATE ON public.user_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_assets_category ON public.system_assets(category);
CREATE INDEX IF NOT EXISTS idx_system_assets_created_at ON public.system_assets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_assets_category ON public.user_assets(category);
CREATE INDEX IF NOT EXISTS idx_user_assets_project_id ON public.user_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_user_assets_user_id ON public.user_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assets_created_at ON public.user_assets(created_at DESC);
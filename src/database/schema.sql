-- Page Template Configurator Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    branding JSONB DEFAULT '{}',
    contextual_data JSONB DEFAULT '{}',
    active_page_id UUID
);

-- Pages table
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position JSONB DEFAULT '{"x": 0, "y": 0}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Custom',
    is_custom BOOLEAN DEFAULT true,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template elements table (for template definitions)
CREATE TABLE template_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    element_type TEXT NOT NULL,
    content TEXT DEFAULT '',
    x INTEGER DEFAULT 0,
    y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 250,
    height INTEGER DEFAULT 150,
    properties JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Elements table (actual page elements)
CREATE TABLE elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id),
    element_type TEXT NOT NULL,
    content TEXT DEFAULT '',
    x INTEGER DEFAULT 0,
    y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 250,
    height INTEGER DEFAULT 150,
    properties JSONB DEFAULT '{}',
    is_visible BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for active_page_id
ALTER TABLE projects 
ADD CONSTRAINT fk_projects_active_page 
FOREIGN KEY (active_page_id) REFERENCES pages(id) ON DELETE SET NULL;

-- Indexes for better performance
CREATE INDEX idx_pages_project_id ON pages(project_id);
CREATE INDEX idx_elements_page_id ON elements(page_id);
CREATE INDEX idx_template_elements_template_id ON template_elements(template_id);
CREATE INDEX idx_elements_visible ON elements(is_visible);
CREATE INDEX idx_elements_type ON elements(element_type);

-- RLS (Row Level Security) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_elements ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (we'll add authentication later)
CREATE POLICY "Allow all operations on projects" ON projects
    FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow all operations on pages" ON pages
    FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow all operations on elements" ON elements
    FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow all operations on templates" ON templates
    FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow all operations on template_elements" ON template_elements
    FOR ALL TO anon, authenticated USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on projects
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
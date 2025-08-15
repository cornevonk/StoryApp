-- Create template_libraries table
CREATE TABLE IF NOT EXISTS template_libraries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    icon VARCHAR(10) DEFAULT '📁',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add template_library_id column to templates table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'templates' AND column_name = 'template_library_id') THEN
        ALTER TABLE templates ADD COLUMN template_library_id UUID REFERENCES template_libraries(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_templates_template_library_id ON templates(template_library_id);

-- Insert default "Standaard" library if it doesn't exist
INSERT INTO template_libraries (name, description, icon, is_default)
SELECT 'Standaard', 'Standaard sjablonen', '📁', true
WHERE NOT EXISTS (
    SELECT 1 FROM template_libraries WHERE name = 'Standaard'
);

-- Update existing templates to belong to "Standaard" library if they don't have a library assigned
UPDATE templates 
SET template_library_id = (SELECT id FROM template_libraries WHERE name = 'Standaard' LIMIT 1)
WHERE template_library_id IS NULL;
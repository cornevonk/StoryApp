-- ========================================
-- SUPABASE SCHEMA SETUP FOR TEMPLATE LIBRARIES
-- Copy-paste this entire script into Supabase SQL Editor
-- ========================================

-- 1. Create template_libraries table
CREATE TABLE IF NOT EXISTS template_libraries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    icon VARCHAR(10) DEFAULT '📁',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add template_library_id column to templates table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'templates' AND column_name = 'template_library_id'
    ) THEN
        ALTER TABLE templates ADD COLUMN template_library_id UUID REFERENCES template_libraries(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_templates_template_library_id ON templates(template_library_id);

-- 4. Insert default "Standaard" library (if not exists)
INSERT INTO template_libraries (name, description, icon, is_default)
SELECT 'Standaard', 'Standaard sjablonen', '📁', true
WHERE NOT EXISTS (
    SELECT 1 FROM template_libraries WHERE name = 'Standaard'
);

-- 5. Update existing templates to belong to "Standaard" library
UPDATE templates 
SET template_library_id = (
    SELECT id FROM template_libraries WHERE name = 'Standaard' LIMIT 1
)
WHERE template_library_id IS NULL;

-- 6. Enable Row Level Security (recommended)
ALTER TABLE template_libraries ENABLE ROW LEVEL SECURITY;

-- 7. Create policy to allow read access to template libraries
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'template_libraries' AND policyname = 'Allow read access to template libraries'
    ) THEN
        CREATE POLICY "Allow read access to template libraries" ON template_libraries
            FOR SELECT USING (true);
    END IF;
END $$;

-- 8. Create policy to allow insert/update/delete for authenticated users  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'template_libraries' AND policyname = 'Allow full access to template libraries for authenticated users'
    ) THEN
        CREATE POLICY "Allow full access to template libraries for authenticated users" ON template_libraries
            FOR ALL USING (true);
    END IF;
END $$;

-- ========================================
-- VERIFICATION QUERIES (optional - run after setup)
-- ========================================

-- Check if template_libraries table was created
-- SELECT * FROM template_libraries;

-- Check if template_library_id column was added to templates
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'templates' AND column_name = 'template_library_id';

-- Count templates per library
-- SELECT tl.name, COUNT(t.id) as template_count
-- FROM template_libraries tl
-- LEFT JOIN templates t ON t.template_library_id = tl.id
-- GROUP BY tl.id, tl.name
-- ORDER BY tl.created_at;
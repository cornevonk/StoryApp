# 🚨 URGENT: Database Schema Fix Required

## Huidige Situatie:
Er zijn data type mismatches tussen de applicatie en database die fouten veroorzaken.

## Te Nemen Actie:

### 1. Run SQL Script in Supabase
Ga naar je Supabase dashboard → SQL Editor en voer dit script uit:

```sql
-- Schema fixes for Page Template Configurator
-- Run this in your Supabase SQL editor to fix data type issues

-- 1. Fix coordinate data types - allow decimals instead of integers
ALTER TABLE elements ALTER COLUMN x TYPE DECIMAL(10,2);
ALTER TABLE elements ALTER COLUMN y TYPE DECIMAL(10,2);
ALTER TABLE template_elements ALTER COLUMN x TYPE DECIMAL(10,2);
ALTER TABLE template_elements ALTER COLUMN y TYPE DECIMAL(10,2);

-- 2. Add proper foreign key names to avoid relationship ambiguity
-- Drop the problematic constraint first
ALTER TABLE projects DROP CONSTRAINT IF EXISTS fk_projects_active_page;

-- Re-add with better naming
ALTER TABLE projects 
ADD CONSTRAINT projects_active_page_fk 
FOREIGN KEY (active_page_id) REFERENCES pages(id) ON DELETE SET NULL;

-- 3. Add explicit naming to avoid relationship conflicts
-- Update indexes with better names
DROP INDEX IF EXISTS idx_pages_project_id;
CREATE INDEX pages_project_id_idx ON pages(project_id);

DROP INDEX IF EXISTS idx_elements_page_id;
CREATE INDEX elements_page_id_idx ON elements(page_id);

DROP INDEX IF EXISTS idx_template_elements_template_id;
CREATE INDEX template_elements_template_id_idx ON template_elements(template_id);

-- 4. Add some sample built-in templates with proper UUIDs
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) VALUES
(
  gen_random_uuid(),
  'Management Recap 2024',
  'Welkomstpagina met jaar overzicht en intro',
  'Reports',
  false,
  false
),
(
  gen_random_uuid(),
  'Executive Summary',
  'Hoofdpunten en strategische samenvatting',
  'Reports',
  false,
  false
),
(
  gen_random_uuid(),
  'Financiële Prestaties',
  'Q4 2024 financiële resultaten en analyse',
  'Analytics',
  false,
  false
)
ON CONFLICT (id) DO NOTHING;
```

### 2. Refresh je browser
Na het uitvoeren van de SQL, refresh je browser op localhost:5176

## Wat dit oplost:
- ✅ Decimale coördinaten (386.67 ipv integer errors)
- ✅ Database relationship ambiguity 
- ✅ UUID template IDs
- ✅ Proper foreign key constraints

## Status na fix:
De applicatie zou moeten werken zonder de console errors.
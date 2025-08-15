-- Add user_id to template_libraries table for user-based libraries
-- Migration: User-based Template Library System

-- Add user_id column to template_libraries table if it doesn't exist
-- Note: We use TEXT for user_id since we don't have auth.users table in this setup
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'template_libraries' AND column_name = 'user_id') THEN
        ALTER TABLE template_libraries ADD COLUMN user_id TEXT;
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_template_libraries_user_id ON template_libraries(user_id);

-- The "Standaard" library should remain global (user_id = NULL)
-- All other libraries will have a specific user_id when created

-- Note: System Design:
-- - Templates/Libraries belong to USERS (personal collections)
-- - Knowledge Documents belong to PROJECTS (project-specific knowledge)
-- - AI generates templates (user's library) based on knowledge docs (current project)
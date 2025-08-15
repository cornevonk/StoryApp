-- Simple Migration: Add ai_generated column to elements table
-- Run this in your Supabase SQL Editor

-- Add the ai_generated column
ALTER TABLE elements 
ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE;

-- Add index for performance
CREATE INDEX idx_elements_ai_generated ON elements(ai_generated);

-- Update existing AI placeholder content
UPDATE elements 
SET ai_generated = TRUE 
WHERE 
    content LIKE '%[AI Content:%' 
    OR content LIKE '%AI zal dit vullen%';

-- Verify the migration worked
SELECT 
    COUNT(*) as total_elements,
    COUNT(*) FILTER (WHERE ai_generated = TRUE) as ai_generated_elements,
    COUNT(*) FILTER (WHERE ai_generated = FALSE) as manual_elements
FROM elements;
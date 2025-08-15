-- ========================================
-- KNOWLEDGE DOCUMENTS DATABASE SCHEMA
-- Copy-paste this entire script into Supabase SQL Editor
-- ========================================

-- 1. Create knowledge_documents table
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    content_preview TEXT,
    extraction_status VARCHAR(50) DEFAULT 'pending',
    extracted_content TEXT,
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_project_id ON knowledge_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_name ON knowledge_documents(name);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_mime_type ON knowledge_documents(mime_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_created_at ON knowledge_documents(created_at);

-- 3. Create full-text search index for content
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_content_search 
ON knowledge_documents USING gin(to_tsvector('dutch', extracted_content));

-- 4. Enable Row Level Security
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for access control
-- Allow read access for all users (temporary - should be user-specific later)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'knowledge_documents' AND policyname = 'Allow read access to knowledge documents'
    ) THEN
        CREATE POLICY "Allow read access to knowledge documents" ON knowledge_documents
            FOR SELECT USING (true);
    END IF;
END $$;

-- Allow full access for authenticated users (temporary - should be user-specific later)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'knowledge_documents' AND policyname = 'Allow full access to knowledge documents for authenticated users'
    ) THEN
        CREATE POLICY "Allow full access to knowledge documents for authenticated users" ON knowledge_documents
            FOR ALL USING (true);
    END IF;
END $$;

-- 6. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_knowledge_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for automatic updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_knowledge_documents_updated_at'
    ) THEN
        CREATE TRIGGER trigger_knowledge_documents_updated_at
            BEFORE UPDATE ON knowledge_documents
            FOR EACH ROW
            EXECUTE FUNCTION update_knowledge_documents_updated_at();
    END IF;
END $$;

-- 8. Create storage bucket for knowledge documents (if not exists)
-- Note: This might need to be done via Supabase dashboard if RLS policies are strict
INSERT INTO storage.buckets (id, name, public)
SELECT 'knowledge-documents', 'knowledge-documents', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'knowledge-documents'
);

-- 9. Create storage policies for knowledge documents bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow authenticated users to upload knowledge documents'
    ) THEN
        CREATE POLICY "Allow authenticated users to upload knowledge documents" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'knowledge-documents');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow authenticated users to view knowledge documents'
    ) THEN
        CREATE POLICY "Allow authenticated users to view knowledge documents" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'knowledge-documents');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow authenticated users to delete knowledge documents'
    ) THEN
        CREATE POLICY "Allow authenticated users to delete knowledge documents" 
        ON storage.objects FOR DELETE 
        USING (bucket_id = 'knowledge-documents');
    END IF;
END $$;

-- 10. Add helpful constraints
ALTER TABLE knowledge_documents 
ADD CONSTRAINT check_file_size_positive 
CHECK (file_size > 0);

ALTER TABLE knowledge_documents 
ADD CONSTRAINT check_extraction_status 
CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed'));

-- 11. Create a view for easy document statistics
CREATE OR REPLACE VIEW knowledge_documents_stats AS
SELECT 
    project_id,
    COUNT(*) as total_documents,
    SUM(file_size) as total_size_bytes,
    ROUND(AVG(file_size)) as avg_size_bytes,
    COUNT(CASE WHEN extraction_status = 'completed' THEN 1 END) as processed_documents,
    COUNT(CASE WHEN extraction_status = 'failed' THEN 1 END) as failed_documents,
    array_agg(DISTINCT mime_type) as document_types,
    MIN(created_at) as first_upload,
    MAX(created_at) as last_upload
FROM knowledge_documents 
GROUP BY project_id;

-- 12. Insert sample data for testing (optional)
-- This will be removed in production
DO $$
DECLARE
    sample_project_id UUID;
BEGIN
    -- Get the first project ID for testing
    SELECT id INTO sample_project_id FROM projects LIMIT 1;
    
    IF sample_project_id IS NOT NULL THEN
        INSERT INTO knowledge_documents (
            project_id, 
            name, 
            original_name, 
            file_path, 
            file_size, 
            mime_type, 
            content_preview,
            extraction_status,
            extracted_content,
            metadata
        ) VALUES
        (
            sample_project_id,
            'company-annual-report-2024.pdf',
            'Annual Report 2024.pdf',
            'knowledge-documents/sample/company-annual-report-2024.pdf',
            2048576,
            'application/pdf',
            'Annual Report 2024 - Executive Summary: Record growth with 47% revenue increase...',
            'completed',
            'ANNUAL REPORT 2024\n\nExecutive Summary\nThis year has been exceptional for our company with record-breaking growth across all sectors. Revenue increased by 47% to €2.4M, driven by strategic investments in technology and market expansion.\n\nKey Achievements:\n- Revenue: €2.4M (+47%)\n- New customers: 156 (+23%)\n- Employee satisfaction: 94%\n- Market expansion: 3 new countries\n\nFinancial Highlights:\n- Q1: €480K revenue\n- Q2: €590K revenue  \n- Q3: €620K revenue\n- Q4: €710K revenue\n\nFuture Outlook:\nProjected 35% growth for 2025 with new product launches and continued market expansion.',
            '{"pages": 24, "language": "nl", "confidence": 0.95}'
        ),
        (
            sample_project_id,
            'marketing-strategy-2025.docx',
            'Marketing Strategy 2025.docx',
            'knowledge-documents/sample/marketing-strategy-2025.docx',
            1024768,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Marketing Strategy 2025 - Digital transformation roadmap with focus on AI-driven campaigns...',
            'completed',
            'MARKETING STRATEGY 2025\n\nDigital Transformation Roadmap\n\nOur marketing strategy for 2025 focuses on AI-driven campaigns and personalized customer experiences.\n\nKey Initiatives:\n1. AI-Powered Content Generation\n2. Personalized Email Campaigns  \n3. Social Media Automation\n4. Predictive Analytics\n\nBudget Allocation:\n- Digital Advertising: €150K\n- Content Creation: €75K\n- Technology Stack: €50K\n- Team Training: €25K\n\nTarget Metrics:\n- Lead Generation: +200%\n- Conversion Rate: 8%\n- Customer Acquisition Cost: -30%\n- Brand Awareness: +150%',
            '{"pages": 12, "language": "nl", "confidence": 0.92}'
        );
        
        RAISE NOTICE '✅ Sample knowledge documents inserted for testing';
    ELSE
        RAISE NOTICE '⚠️ No projects found - skipping sample data insertion';
    END IF;
END $$;

-- ========================================
-- VERIFICATION QUERIES (optional - run after setup)
-- ========================================

-- Check if knowledge_documents table was created
-- SELECT * FROM knowledge_documents LIMIT 5;

-- Check document statistics
-- SELECT * FROM knowledge_documents_stats;

-- Check storage bucket
-- SELECT * FROM storage.buckets WHERE id = 'knowledge-documents';

-- Count documents per project
-- SELECT 
--     p.name as project_name,
--     COUNT(kd.id) as document_count,
--     SUM(kd.file_size) as total_size
-- FROM projects p
-- LEFT JOIN knowledge_documents kd ON p.id = kd.project_id
-- GROUP BY p.id, p.name
-- ORDER BY document_count DESC;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🎉 Knowledge Documents database schema setup completed!';
    RAISE NOTICE '📁 Storage bucket: knowledge-documents created';
    RAISE NOTICE '🔍 Full-text search enabled for document content';
    RAISE NOTICE '📊 Statistics view created: knowledge_documents_stats';
    RAISE NOTICE '🔒 Row Level Security enabled with policies';
END $$;
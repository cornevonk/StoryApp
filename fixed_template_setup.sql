-- Fixed Template System Setup - Resolved Variable Naming Conflicts
-- This avoids variable/column naming conflicts

DO $$
DECLARE
    standaard_library_id UUID;
    new_template_id UUID;
BEGIN
    -- Step 1: Add user_id column to template_libraries if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'template_libraries' AND column_name = 'user_id') THEN
        ALTER TABLE template_libraries ADD COLUMN user_id TEXT;
    END IF;

    -- Step 2: Add template_library_id column WITHOUT foreign key constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'templates' AND column_name = 'template_library_id') THEN
        ALTER TABLE templates ADD COLUMN template_library_id UUID;
    END IF;

    -- Step 3: Create indexes
    CREATE INDEX IF NOT EXISTS idx_template_libraries_user_id ON template_libraries(user_id);
    CREATE INDEX IF NOT EXISTS idx_templates_template_library_id ON templates(template_library_id);

    -- Step 4: Get the "Standaard" library ID
    SELECT id INTO standaard_library_id 
    FROM template_libraries 
    WHERE name = 'Standaard' AND is_default = true 
    LIMIT 1;

    -- If no Standaard library exists, create it
    IF standaard_library_id IS NULL THEN
        INSERT INTO template_libraries (name, description, icon, is_default, user_id)
        VALUES ('Standaard', 'Standaard sjablonen', '📁', true, NULL)
        RETURNING id INTO standaard_library_id;
    END IF;

    -- Step 5: Clean existing templates in Standaard library
    DELETE FROM template_elements WHERE template_elements.template_id IN (
        SELECT templates.id FROM templates WHERE templates.template_library_id = standaard_library_id
    );
    DELETE FROM templates WHERE templates.template_library_id = standaard_library_id;

    -- Template 1: Executive Dashboard
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Executive Dashboard', 'Complete dashboard met KPIs en grafieken', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Q4 2024 Executive Dashboard', 50, 30, 500, 50, '{"fontSize": 32, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (new_template_id, 'datawidget', '2.4M', 50, 100, 150, 80, '{"widgetType": "counter", "value": 2400000, "label": "Total Revenue", "backgroundColor": "#10b981", "color": "#ffffff"}', 2),
    (new_template_id, 'datawidget', '23.4%', 220, 100, 150, 80, '{"widgetType": "percentage", "value": 23.4, "label": "Growth Rate", "backgroundColor": "#3b82f6", "color": "#ffffff"}', 3),
    (new_template_id, 'chart', 'Revenue Trend', 50, 200, 300, 200, '{"chartType": "line", "title": "Revenue Trend", "backgroundColor": "#f8fafc"}', 4);

    -- Template 2: Product Launch
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Product Launch', 'Modern product launch template', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Introducing Revolutionary Product X', 50, 40, 500, 60, '{"fontSize": 36, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (new_template_id, 'text', 'Transform your workflow with cutting-edge technology', 50, 120, 500, 40, '{"fontSize": 18, "color": "#6b7280"}', 2),
    (new_template_id, 'datawidget', '500+', 50, 180, 150, 60, '{"widgetType": "counter", "value": 500, "label": "Beta Users", "backgroundColor": "#f59e0b", "color": "#ffffff"}', 3),
    (new_template_id, 'cta', 'Start Free Trial', 50, 260, 200, 50, '{"text": "Start Free Trial", "backgroundColor": "#3b82f6", "color": "#ffffff"}', 4);

    -- Template 3: Team Portfolio
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Team Portfolio', 'Professional team overview', 'Business', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Meet Our Expert Team', 50, 30, 400, 50, '{"fontSize": 32, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (new_template_id, 'image', 'Team Photo', 50, 100, 120, 120, '{"src": "/api/placeholder/120/120", "alt": "Team Member", "borderRadius": "60px"}', 2),
    (new_template_id, 'text', 'Sarah Johnson - CEO', 190, 100, 200, 30, '{"fontSize": 22, "fontWeight": "600", "color": "#111827"}', 3),
    (new_template_id, 'text', '15+ years experience in fintech and AI', 190, 140, 350, 40, '{"fontSize": 14, "color": "#6b7280"}', 4);

    -- Template 4: Analytics Report
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Analytics Report', 'Data analytics dashboard', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Q4 Analytics Deep Dive', 50, 30, 400, 50, '{"fontSize": 30, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (new_template_id, 'chart', 'User Growth', 50, 100, 250, 150, '{"chartType": "line", "title": "Monthly Users", "backgroundColor": "#f8fafc"}', 2),
    (new_template_id, 'table', 'Key Metrics', 320, 100, 250, 150, '{"headers": ["Metric", "Value"], "rows": [["Users", "1.2M"], ["Revenue", "€890K"]], "headerBg": "#e2e8f0"}', 3);

    -- Template 5: Technical Demo
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Technical Demo', 'Code and API showcase', 'Education', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'API Integration Guide', 50, 30, 400, 50, '{"fontSize": 28, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (new_template_id, 'demo', 'API Example', 50, 100, 300, 120, '{"code": "fetch(\"/api/data\").then(r => r.json())", "language": "javascript"}', 2),
    (new_template_id, 'datawidget', '99.9%', 370, 100, 120, 60, '{"widgetType": "percentage", "value": 99.9, "label": "Uptime", "backgroundColor": "#10b981", "color": "#ffffff"}', 3);

    -- Template 6: Marketing Campaign
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Marketing Campaign', 'Campaign performance overview', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Campaign Results', 50, 30, 400, 50, '{"fontSize": 30, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (new_template_id, 'datawidget', '2.4M', 50, 100, 120, 70, '{"widgetType": "counter", "value": 2400000, "label": "Impressions", "backgroundColor": "#f59e0b", "color": "#ffffff"}', 2),
    (new_template_id, 'chart', 'Performance', 200, 100, 300, 150, '{"chartType": "bar", "title": "Weekly Results", "backgroundColor": "#f8fafc"}', 3);

    -- Template 7: Product Comparison
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Product Comparison', 'Feature and pricing comparison', 'Business', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Product Comparison', 50, 30, 400, 50, '{"fontSize": 28, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (new_template_id, 'table', 'Features', 50, 100, 400, 150, '{"headers": ["Feature", "Basic", "Pro"], "rows": [["Users", "5", "25"], ["Storage", "10GB", "100GB"]], "headerBg": "#1f2937", "headerColor": "#ffffff"}', 2),
    (new_template_id, 'datawidget', '€29', 50, 270, 100, 60, '{"widgetType": "currency", "value": 29, "label": "Basic", "backgroundColor": "#3b82f6", "color": "#ffffff"}', 3);

    -- Template 8: Company About
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Company About', 'Company information page', 'Business', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'About Our Company', 50, 30, 350, 50, '{"fontSize": 32, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (new_template_id, 'text', 'Founded in 2020, we help businesses transform through technology', 50, 100, 400, 60, '{"fontSize": 16, "color": "#374151"}', 2),
    (new_template_id, 'datawidget', '10K+', 50, 180, 90, 50, '{"widgetType": "counter", "value": 10000, "label": "Customers", "backgroundColor": "#10b981", "color": "#ffffff"}', 3),
    (new_template_id, 'footer', 'Contact Info', 50, 250, 400, 60, '{"content": "© 2024 Company | contact@company.com", "backgroundColor": "#1f2937", "color": "#ffffff"}', 4);

END $$;
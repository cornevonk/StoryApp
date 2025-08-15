-- Complete Template System Setup with Rich Professional Templates
-- This script does everything in the correct order

DO $$
DECLARE
    standaard_library_id UUID;
    template_id UUID;
BEGIN
    -- Step 1: Add user_id column to template_libraries if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'template_libraries' AND column_name = 'user_id') THEN
        ALTER TABLE template_libraries ADD COLUMN user_id TEXT;
    END IF;

    -- Step 2: Add template_library_id column to templates if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'templates' AND column_name = 'template_library_id') THEN
        ALTER TABLE templates ADD COLUMN template_library_id UUID REFERENCES template_libraries(id) ON DELETE SET NULL;
    END IF;

    -- Step 3: Create indexes
    CREATE INDEX IF NOT EXISTS idx_template_libraries_user_id ON template_libraries(user_id);
    CREATE INDEX IF NOT EXISTS idx_templates_template_library_id ON templates(template_library_id);

    -- Step 4: Get the "Standaard" library ID
    SELECT id INTO standaard_library_id 
    FROM template_libraries 
    WHERE name = 'Standaard' AND is_default = true 
    LIMIT 1;

    -- Step 5: Clean existing templates in Standaard library
    DELETE FROM template_elements WHERE template_id IN (
        SELECT id FROM templates WHERE template_library_id = standaard_library_id
    );
    DELETE FROM templates WHERE template_library_id = standaard_library_id;

    -- Template 1: Executive Dashboard with KPIs and Charts
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Executive Dashboard', 'Complete executive dashboard met KPIs, grafieken en data widgets', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id, 'heading', 'Q4 2024 Executive Dashboard', 50, 30, 500, 50, '{"fontSize": 32, "fontWeight": "bold", "color": "#1f2937", "textAlign": "left"}', 1),
    (template_id, 'datawidget', '2.4M', 50, 100, 150, 80, '{"widgetType": "counter", "value": 2400000, "label": "Total Revenue", "format": "currency", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "12px"}', 2),
    (template_id, 'datawidget', '23.4%', 220, 100, 150, 80, '{"widgetType": "percentage", "value": 23.4, "label": "Growth Rate", "format": "percentage", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "12px"}', 3),
    (template_id, 'datawidget', '1,247', 390, 100, 150, 80, '{"widgetType": "counter", "value": 1247, "label": "Active Users", "format": "number", "backgroundColor": "#8b5cf6", "color": "#ffffff", "borderRadius": "12px"}', 4),
    (template_id, 'chart', 'Revenue Trend', 50, 200, 300, 200, '{"chartType": "line", "title": "Revenue Trend", "backgroundColor": "#f8fafc", "borderRadius": "8px"}', 5),
    (template_id, 'table', 'Top Products', 370, 200, 250, 200, '{"headers": ["Product", "Revenue", "Growth"], "rows": [["Product A", "€890K", "+12%"], ["Product B", "€567K", "+8%"], ["Product C", "€234K", "+15%"]], "headerBg": "#f1f5f9"}', 6);

    -- Template 2: Product Launch Campaign with Video and CTAs
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Product Launch Campaign', 'Complete product launch met video, CTA en marketing elementen', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id, 'heading', 'Introducing Revolutionary Product X', 50, 40, 500, 60, '{"fontSize": 36, "fontWeight": "bold", "color": "#1f2937", "textAlign": "center"}', 1),
    (template_id, 'text', 'Transform your workflow with cutting-edge technology that delivers 10x faster results', 50, 120, 500, 40, '{"fontSize": 18, "color": "#6b7280", "textAlign": "center"}', 2),
    (template_id, 'video', 'Product Demo Video', 50, 180, 300, 200, '{"src": "https://example.com/demo", "controls": true, "poster": "/api/placeholder/300/200", "borderRadius": "12px"}', 3),
    (template_id, 'datawidget', '500+', 370, 180, 150, 60, '{"widgetType": "counter", "value": 500, "label": "Beta Users", "format": "number", "backgroundColor": "#f59e0b", "color": "#ffffff"}', 4),
    (template_id, 'datawidget', '99.2%', 370, 260, 150, 60, '{"widgetType": "percentage", "value": 99.2, "label": "Uptime", "format": "percentage", "backgroundColor": "#10b981", "color": "#ffffff"}', 5),
    (template_id, 'cta', 'Start Free Trial', 200, 400, 200, 50, '{"text": "Start Free Trial", "url": "#signup", "style": "primary", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "8px", "fontSize": 18}', 6);

    -- Template 3: Team Portfolio with Images and Bios
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Team Portfolio', 'Professioneel team overzicht met foto''s en gedetailleerde informatie', 'Business', standaard_library_id, false, false)
    RETURNING id INTO template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id, 'heading', 'Meet Our Expert Team', 50, 30, 400, 50, '{"fontSize": 32, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (template_id, 'image', 'Team Member Photo', 50, 100, 120, 120, '{"src": "/api/placeholder/120/120", "alt": "Sarah Johnson - CEO", "objectFit": "cover", "borderRadius": "60px"}', 2),
    (template_id, 'heading', 'Sarah Johnson', 190, 100, 200, 30, '{"fontSize": 22, "fontWeight": "600", "color": "#111827"}', 3),
    (template_id, 'text', 'Chief Executive Officer', 190, 135, 200, 25, '{"fontSize": 16, "color": "#7c3aed", "fontWeight": "500"}', 4),
    (template_id, 'text', '15+ years experience in fintech and AI. Former VP at Goldman Sachs. MBA from Stanford.', 190, 165, 350, 55, '{"fontSize": 14, "color": "#6b7280", "lineHeight": 1.5}', 5),
    (template_id, 'image', 'Team Member Photo 2', 50, 250, 120, 120, '{"src": "/api/placeholder/120/120", "alt": "Mark Chen - CTO", "objectFit": "cover", "borderRadius": "60px"}', 6),
    (template_id, 'heading', 'Mark Chen', 190, 250, 200, 30, '{"fontSize": 22, "fontWeight": "600", "color": "#111827"}', 7),
    (template_id, 'text', 'Chief Technology Officer', 190, 285, 200, 25, '{"fontSize": 16, "color": "#7c3aed", "fontWeight": "500"}', 8);

    -- Template 4: Data Analytics Report with Multiple Charts
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Analytics Deep Dive', 'Uitgebreide analytics rapportage met meerdere data visualisaties', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id, 'heading', 'Q4 Analytics Deep Dive', 50, 30, 400, 50, '{"fontSize": 30, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (template_id, 'text', 'Comprehensive analysis of user behavior, conversion metrics, and growth indicators', 50, 90, 500, 30, '{"fontSize": 16, "color": "#6b7280"}', 2),
    (template_id, 'chart', 'User Growth', 50, 140, 250, 150, '{"chartType": "line", "title": "Monthly Active Users", "backgroundColor": "#f8fafc"}', 3),
    (template_id, 'chart', 'Revenue by Channel', 320, 140, 250, 150, '{"chartType": "pie", "title": "Revenue by Channel", "backgroundColor": "#f8fafc"}', 4),
    (template_id, 'table', 'Key Metrics', 50, 310, 520, 120, '{"headers": ["Metric", "Current", "Previous", "Change"], "rows": [["Conversion Rate", "3.2%", "2.8%", "+14%"], ["Avg Order Value", "€127", "€118", "+8%"], ["Customer LTV", "€890", "€756", "+18%"]], "headerBg": "#e2e8f0"}', 5);

    -- Template 5: Technical Documentation with Code and Embeds
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Technical Showcase', 'Technische documentatie met code voorbeelden en demo''s', 'Education', standaard_library_id, false, false)
    RETURNING id INTO template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id, 'heading', 'API Integration Guide', 50, 30, 400, 50, '{"fontSize": 28, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (template_id, 'text', 'Learn how to integrate our powerful API in just a few simple steps', 50, 90, 450, 30, '{"fontSize": 16, "color": "#6b7280"}', 2),
    (template_id, 'demo', 'API Example', 50, 140, 300, 150, '{"code": "fetch(\"/api/v1/data\")\n  .then(response => response.json())\n  .then(data => {\n    console.log(data);\n  });", "language": "javascript", "editable": true}', 3),
    (template_id, 'datawidget', '99.9%', 370, 140, 120, 60, '{"widgetType": "percentage", "value": 99.9, "label": "API Uptime", "backgroundColor": "#10b981", "color": "#ffffff"}', 4),
    (template_id, 'datawidget', '<50ms', 370, 220, 120, 60, '{"widgetType": "text", "value": "<50ms", "label": "Response Time", "backgroundColor": "#3b82f6", "color": "#ffffff"}', 5),
    (template_id, 'embed', 'Interactive Demo', 50, 310, 500, 200, '{"embedType": "iframe", "src": "https://codepen.io/embed/example", "title": "Live API Demo"}', 6);

    -- Template 6: Marketing Campaign Overview with All Elements
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Campaign Overview', 'Complete marketing campagne overzicht met alle performance metrics', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id, 'heading', 'Spring 2024 Campaign Results', 50, 20, 450, 50, '{"fontSize": 30, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (template_id, 'datawidget', '2.4M', 50, 80, 120, 70, '{"widgetType": "counter", "value": 2400000, "label": "Impressions", "backgroundColor": "#f59e0b", "color": "#ffffff"}', 2),
    (template_id, 'datawidget', '3.2%', 190, 80, 120, 70, '{"widgetType": "percentage", "value": 3.2, "label": "CTR", "backgroundColor": "#10b981", "color": "#ffffff"}', 3),
    (template_id, 'datawidget', '€89K', 330, 80, 120, 70, '{"widgetType": "currency", "value": 89000, "label": "Revenue", "backgroundColor": "#3b82f6", "color": "#ffffff"}', 4),
    (template_id, 'chart', 'Campaign Performance', 50, 170, 400, 150, '{"chartType": "bar", "title": "Weekly Performance", "backgroundColor": "#f8fafc"}', 5),
    (template_id, 'image', 'Campaign Visual', 470, 170, 150, 150, '{"src": "/api/placeholder/150/150", "alt": "Campaign Creative", "objectFit": "cover", "borderRadius": "8px"}', 6),
    (template_id, 'ai-agent', 'Campaign Insights', 50, 340, 400, 80, '{"systemPrompt": "Analyze campaign performance and provide insights", "contentType": "insights", "backgroundColor": "#f3f4f6"}', 7),
    (template_id, 'cta', 'View Full Report', 470, 340, 150, 50, '{"text": "View Full Report", "style": "secondary", "backgroundColor": "#6b7280", "color": "#ffffff"}', 8);

    -- Template 7: Product Comparison Matrix
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Product Comparison', 'Uitgebreide product vergelijking met features en pricing', 'Business', standaard_library_id, false, false)
    RETURNING id INTO template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id, 'heading', 'Product Comparison Matrix', 50, 30, 400, 50, '{"fontSize": 28, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (template_id, 'table', 'Feature Comparison', 50, 100, 500, 200, '{"headers": ["Feature", "Basic", "Pro", "Enterprise"], "rows": [["Users", "5", "25", "Unlimited"], ["Storage", "10GB", "100GB", "1TB"], ["API Calls", "1K/month", "10K/month", "Unlimited"], ["Support", "Email", "Priority", "24/7 Phone"]], "headerBg": "#1f2937", "headerColor": "#ffffff"}', 2),
    (template_id, 'datawidget', '€29', 50, 320, 100, 60, '{"widgetType": "currency", "value": 29, "label": "Basic Plan", "backgroundColor": "#e5e7eb", "color": "#1f2937"}', 3),
    (template_id, 'datawidget', '€79', 170, 320, 100, 60, '{"widgetType": "currency", "value": 79, "label": "Pro Plan", "backgroundColor": "#3b82f6", "color": "#ffffff"}', 4),
    (template_id, 'datawidget', '€199', 290, 320, 100, 60, '{"widgetType": "currency", "value": 199, "label": "Enterprise", "backgroundColor": "#1f2937", "color": "#ffffff"}', 5),
    (template_id, 'cta', 'Start Free Trial', 420, 320, 130, 60, '{"text": "Start Free Trial", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "8px"}', 6);

    -- Template 8: Company About Page with Footer
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Company About', 'Complete company pagina met team, missie en contact informatie', 'Business', standaard_library_id, false, false)
    RETURNING id INTO template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id, 'heading', 'About Our Company', 50, 30, 350, 50, '{"fontSize": 32, "fontWeight": "bold", "color": "#1f2937"}', 1),
    (template_id, 'image', 'Company Photo', 50, 100, 200, 150, '{"src": "/api/placeholder/200/150", "alt": "Our Office", "objectFit": "cover", "borderRadius": "12px"}', 2),
    (template_id, 'text', 'Founded in 2020, we''ve been at the forefront of innovation, helping businesses transform through technology. Our mission is to democratize access to cutting-edge solutions.', 270, 100, 300, 80, '{"fontSize": 16, "color": "#374151", "lineHeight": 1.6}', 3),
    (template_id, 'datawidget', '10K+', 270, 200, 90, 50, '{"widgetType": "counter", "value": 10000, "label": "Customers", "backgroundColor": "#3b82f6", "color": "#ffffff"}', 4),
    (template_id, 'datawidget', '50+', 380, 200, 90, 50, '{"widgetType": "counter", "value": 50, "label": "Team Members", "backgroundColor": "#10b981", "color": "#ffffff"}', 5),
    (template_id, 'datawidget', '15+', 490, 200, 80, 50, '{"widgetType": "counter", "value": 15, "label": "Countries", "backgroundColor": "#f59e0b", "color": "#ffffff"}', 6),
    (template_id, 'ai-agent', 'Company Values', 50, 270, 520, 60, '{"systemPrompt": "Generate company values based on context", "contentType": "values", "backgroundColor": "#f9fafb"}', 7),
    (template_id, 'footer', 'Contact Information', 50, 350, 520, 80, '{"content": "© 2024 Company Name | contact@company.com | +31 20 123 4567", "backgroundColor": "#1f2937", "color": "#ffffff", "textAlign": "center"}', 8);

END $$;
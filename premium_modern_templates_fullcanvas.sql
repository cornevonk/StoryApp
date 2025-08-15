-- Premium Modern Templates with Full Canvas Positioning
-- Uses the full 1024x768 canvas space for better element distribution

DO $$
DECLARE
    standaard_library_id UUID;
    new_template_id UUID;
BEGIN
    -- Get the "Standaard" library ID
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

    -- Clean existing templates in Standaard library
    DELETE FROM template_elements WHERE template_elements.template_id IN (
        SELECT templates.id FROM templates WHERE templates.template_library_id = standaard_library_id
    );
    DELETE FROM templates WHERE templates.template_library_id = standaard_library_id;

    -- Template 1: Executive Dashboard - Full Canvas
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Executive Dashboard', 'Complete dashboard met KPIs en grafieken', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Q4 2024 Executive Dashboard', 212, 40, 600, 60, '{"fontSize": 42, "fontWeight": "bold", "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "WebkitBackgroundClip": "text", "backgroundClip": "text", "color": "transparent", "textAlign": "center", "fontFamily": "Inter, system-ui, sans-serif"}', 1),
    (new_template_id, 'datawidget', '€2.4M', 100, 150, 200, 100, '{"value": "€2.4M", "label": "Total Revenue", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "16px", "fontSize": 32, "boxShadow": "0 10px 25px rgba(16, 185, 129, 0.3)"}', 2),
    (new_template_id, 'datawidget', '+23.4%', 350, 150, 200, 100, '{"value": "+23.4%", "label": "Growth Rate", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "16px", "fontSize": 32, "boxShadow": "0 10px 25px rgba(59, 130, 246, 0.3)"}', 3),
    (new_template_id, 'datawidget', '1,247', 600, 150, 200, 100, '{"value": "1,247", "label": "Active Users", "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "color": "#ffffff", "borderRadius": "16px", "fontSize": 32, "boxShadow": "0 10px 25px rgba(102, 126, 234, 0.3)"}', 4),
    (new_template_id, 'chart', 'Revenue Trend', 100, 300, 400, 250, '{"chartType": "line", "title": "Revenue Growth Trend", "backgroundColor": "#ffffff", "borderRadius": "12px", "border": "1px solid #e5e7eb", "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.07)"}', 5),
    (new_template_id, 'table', 'Top Products', 550, 300, 350, 250, '{"headers": ["Product", "Revenue", "Growth"], "rows": [["Product A", "€890K", "+12%"], ["Product B", "€567K", "+8%"], ["Product C", "€234K", "+15%"]], "headerBg": "#f8fafc", "borderRadius": "12px", "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.07)"}', 6),
    (new_template_id, 'footer', '© 2024 Executive Dashboard', 212, 600, 600, 60, '{"content": "Last updated: December 2024 | Data refreshed every hour", "backgroundColor": "#1e293b", "color": "#94a3b8", "borderRadius": "8px", "textAlign": "center", "fontSize": 14}', 7);

    -- Template 2: Product Launch - Full Canvas
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Product Launch', 'Modern product launch template', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Revolutionary Product X', 162, 50, 700, 70, '{"fontSize": 48, "fontWeight": "bold", "background": "linear-gradient(90deg, #4F46E5 0%, #E11D48 100%)", "WebkitBackgroundClip": "text", "backgroundClip": "text", "color": "transparent", "textAlign": "center", "fontFamily": "Poppins, system-ui, sans-serif", "letterSpacing": "-0.02em"}', 1),
    (new_template_id, 'text', 'Transform your workflow with cutting-edge AI technology', 212, 140, 600, 50, '{"fontSize": 20, "color": "#64748b", "textAlign": "center", "lineHeight": 1.6, "fontFamily": "Inter, system-ui, sans-serif"}', 2),
    (new_template_id, 'video', 'Product Demo', 100, 220, 450, 280, '{"src": "/demo-video.mp4", "poster": "/api/placeholder/450/280", "controls": true, "borderRadius": "16px", "boxShadow": "0 20px 40px rgba(0, 0, 0, 0.15)"}', 3),
    (new_template_id, 'datawidget', '500+', 600, 220, 180, 90, '{"value": "500+", "label": "Beta Users", "background": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28, "boxShadow": "0 10px 25px rgba(245, 158, 11, 0.3)"}', 4),
    (new_template_id, 'datawidget', '99.9%', 600, 330, 180, 90, '{"value": "99.9%", "label": "Uptime", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28, "boxShadow": "0 10px 25px rgba(16, 185, 129, 0.3)"}', 5),
    (new_template_id, 'cta', 'Start Free Trial', 350, 550, 250, 60, '{"text": "Start Your Free Trial Today", "background": "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)", "color": "#ffffff", "borderRadius": "30px", "fontSize": 18, "fontWeight": "600", "boxShadow": "0 8px 20px rgba(79, 70, 229, 0.4)"}', 6),
    (new_template_id, 'ai-agent', 'AI Assistant', 100, 550, 200, 60, '{"systemPrompt": "Product support assistant", "backgroundColor": "#f1f5f9", "color": "#475569", "borderRadius": "12px", "border": "2px solid #e2e8f0"}', 7);

    -- Template 3: Team Portfolio - Full Canvas
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Team Portfolio', 'Professional team overview', 'Business', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Meet Our Expert Team', 262, 40, 500, 60, '{"fontSize": 42, "fontWeight": "bold", "color": "#0f172a", "textAlign": "center", "fontFamily": "Playfair Display, serif"}', 1),
    (new_template_id, 'image', 'Sarah Johnson', 150, 150, 150, 150, '{"src": "/api/placeholder/150/150", "alt": "Sarah Johnson - CEO", "borderRadius": "75px", "border": "4px solid #e5e7eb", "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.1)"}', 2),
    (new_template_id, 'heading', 'Sarah Johnson', 150, 320, 150, 30, '{"fontSize": 22, "fontWeight": "600", "color": "#1e293b", "textAlign": "center"}', 3),
    (new_template_id, 'text', 'Chief Executive Officer', 150, 355, 150, 25, '{"fontSize": 14, "color": "#7c3aed", "fontWeight": "500", "textAlign": "center"}', 4),
    (new_template_id, 'image', 'Mark Chen', 437, 150, 150, 150, '{"src": "/api/placeholder/150/150", "alt": "Mark Chen - CTO", "borderRadius": "75px", "border": "4px solid #e5e7eb", "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.1)"}', 5),
    (new_template_id, 'heading', 'Mark Chen', 437, 320, 150, 30, '{"fontSize": 22, "fontWeight": "600", "color": "#1e293b", "textAlign": "center"}', 6),
    (new_template_id, 'text', 'Chief Technology Officer', 437, 355, 150, 25, '{"fontSize": 14, "color": "#7c3aed", "fontWeight": "500", "textAlign": "center"}', 7),
    (new_template_id, 'image', 'Lisa Park', 724, 150, 150, 150, '{"src": "/api/placeholder/150/150", "alt": "Lisa Park - Head of Design", "borderRadius": "75px", "border": "4px solid #e5e7eb", "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.1)"}', 8),
    (new_template_id, 'heading', 'Lisa Park', 724, 320, 150, 30, '{"fontSize": 22, "fontWeight": "600", "color": "#1e293b", "textAlign": "center"}', 9),
    (new_template_id, 'text', 'Head of Design', 724, 355, 150, 25, '{"fontSize": 14, "color": "#7c3aed", "fontWeight": "500", "textAlign": "center"}', 10),
    (new_template_id, 'text', 'Our diverse team brings together decades of experience in technology, design, and business strategy to deliver exceptional results for our clients.', 212, 420, 600, 60, '{"fontSize": 16, "color": "#64748b", "textAlign": "center", "lineHeight": 1.6}', 11),
    (new_template_id, 'cta', 'Join Our Team', 412, 520, 200, 50, '{"text": "Join Our Team", "backgroundColor": "#7c3aed", "color": "#ffffff", "borderRadius": "8px", "fontSize": 16}', 12);

    -- Template 4: Analytics Report - Full Canvas
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Analytics Report', 'Data analytics dashboard', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Q4 Analytics Deep Dive', 262, 40, 500, 50, '{"fontSize": 36, "fontWeight": "bold", "color": "#0f172a", "textAlign": "center"}', 1),
    (new_template_id, 'chart', 'User Growth', 100, 120, 380, 200, '{"chartType": "line", "title": "Monthly Active Users", "backgroundColor": "#ffffff", "border": "2px solid #e5e7eb", "borderRadius": "12px"}', 2),
    (new_template_id, 'chart', 'Revenue Channels', 544, 120, 380, 200, '{"chartType": "pie", "title": "Revenue by Channel", "backgroundColor": "#ffffff", "border": "2px solid #e5e7eb", "borderRadius": "12px"}', 3),
    (new_template_id, 'table', 'Key Metrics', 100, 360, 824, 180, '{"headers": ["Metric", "Current", "Previous", "Change", "Target"], "rows": [["Conversion Rate", "3.2%", "2.8%", "+14%", "3.5%"], ["Avg Order Value", "€127", "€118", "+8%", "€130"], ["Customer LTV", "€890", "€756", "+18%", "€900"], ["Churn Rate", "5.2%", "6.1%", "-15%", "5%"]], "headerBg": "#1e293b", "headerColor": "#ffffff", "alternateRowBg": "#f8fafc", "borderRadius": "12px", "cellPadding": "12px"}', 4),
    (new_template_id, 'datawidget', '€2.8M', 100, 580, 180, 80, '{"value": "€2.8M", "label": "Total Revenue", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28}', 5),
    (new_template_id, 'datawidget', '45.2K', 322, 580, 180, 80, '{"value": "45.2K", "label": "Active Users", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28}', 6),
    (new_template_id, 'datawidget', '98.7%', 544, 580, 180, 80, '{"value": "98.7%", "label": "Satisfaction", "backgroundColor": "#8b5cf6", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28}', 7),
    (new_template_id, 'datawidget', '3.2%', 744, 580, 180, 80, '{"value": "3.2%", "label": "Growth Rate", "background": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28}', 8);

    -- Template 5: Technical Demo - Full Canvas
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Technical Demo', 'Code and API showcase', 'Education', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'API Integration Guide', 262, 40, 500, 50, '{"fontSize": 36, "fontWeight": "bold", "color": "#0f172a", "textAlign": "center", "fontFamily": "JetBrains Mono, monospace"}', 1),
    (new_template_id, 'demo', 'const api = new API();', 100, 120, 450, 200, '{"code": "// Initialize API client\nconst api = new API({\n  apiKey: process.env.API_KEY,\n  baseURL: \"https://api.example.com/v1\"\n});\n\n// Fetch data\nconst data = await api.getData();\nconsole.log(data);", "language": "javascript", "backgroundColor": "#1e293b", "color": "#64d86b", "borderRadius": "12px", "fontSize": 14, "fontFamily": "JetBrains Mono, monospace"}', 2),
    (new_template_id, 'datawidget', '99.99%', 600, 120, 150, 80, '{"value": "99.99%", "label": "API Uptime", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "12px", "fontSize": 24}', 3),
    (new_template_id, 'datawidget', '<50ms', 774, 120, 150, 80, '{"value": "<50ms", "label": "Response Time", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "12px", "fontSize": 24}', 4),
    (new_template_id, 'table', 'API Endpoints', 100, 350, 550, 150, '{"headers": ["Method", "Endpoint", "Description"], "rows": [["GET", "/api/users", "List all users"], ["POST", "/api/users", "Create new user"], ["PUT", "/api/users/:id", "Update user"], ["DELETE", "/api/users/:id", "Delete user"]], "headerBg": "#1e293b", "headerColor": "#ffffff", "borderRadius": "8px"}', 5),
    (new_template_id, 'embed', 'Live Demo', 700, 350, 224, 150, '{"embedType": "iframe", "src": "https://codepen.io/embed", "title": "Interactive Demo", "borderRadius": "12px", "border": "2px solid #e5e7eb"}', 6),
    (new_template_id, 'cta', 'Get API Key', 362, 550, 200, 50, '{"text": "Get Your API Key", "backgroundColor": "#7c3aed", "color": "#ffffff", "borderRadius": "25px", "fontSize": 16, "fontWeight": "600"}', 7),
    (new_template_id, 'footer', 'Documentation v2.0', 262, 640, 500, 40, '{"content": "Full documentation at docs.example.com", "color": "#64748b", "textAlign": "center", "fontSize": 14}', 8);

    -- Template 6: Marketing Campaign - Full Canvas
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Marketing Campaign', 'Campaign performance overview', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Spring 2024 Campaign', 212, 40, 600, 60, '{"fontSize": 42, "fontWeight": "bold", "background": "linear-gradient(90deg, #ec4899 0%, #f59e0b 100%)", "WebkitBackgroundClip": "text", "backgroundClip": "text", "color": "transparent", "textAlign": "center"}', 1),
    (new_template_id, 'datawidget', '2.4M', 100, 140, 160, 90, '{"value": "2.4M", "label": "Impressions", "background": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28}', 2),
    (new_template_id, 'datawidget', '3.2%', 290, 140, 160, 90, '{"value": "3.2%", "label": "CTR", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28}', 3),
    (new_template_id, 'datawidget', '€89K', 480, 140, 160, 90, '{"value": "€89K", "label": "Revenue", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28}', 4),
    (new_template_id, 'datawidget', '12.5K', 670, 140, 160, 90, '{"value": "12.5K", "label": "Conversions", "backgroundColor": "#8b5cf6", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28}', 5),
    (new_template_id, 'chart', 'Campaign Performance', 100, 270, 500, 220, '{"chartType": "bar", "title": "Weekly Performance Metrics", "backgroundColor": "#ffffff", "borderRadius": "12px", "border": "1px solid #e5e7eb"}', 6),
    (new_template_id, 'image', 'Campaign Visual', 650, 270, 274, 220, '{"src": "/api/placeholder/274/220", "alt": "Campaign Creative", "objectFit": "cover", "borderRadius": "12px", "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.1)"}', 7),
    (new_template_id, 'ai-agent', 'Campaign Insights', 100, 520, 550, 80, '{"systemPrompt": "Analyze campaign performance and provide optimization suggestions", "backgroundColor": "#f8fafc", "borderRadius": "12px", "border": "2px solid #e2e8f0"}', 8),
    (new_template_id, 'cta', 'View Full Report', 700, 520, 180, 50, '{"text": "Full Report", "backgroundColor": "#1e293b", "color": "#ffffff", "borderRadius": "8px", "fontSize": 16}', 9);

    -- Template 7: Product Comparison - Full Canvas
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Product Comparison', 'Feature and pricing comparison', 'Business', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Choose Your Plan', 262, 40, 500, 60, '{"fontSize": 42, "fontWeight": "bold", "color": "#0f172a", "textAlign": "center"}', 1),
    (new_template_id, 'table', 'Feature Comparison', 112, 130, 800, 250, '{"headers": ["Feature", "Basic", "Pro", "Enterprise"], "rows": [["Users", "5", "25", "Unlimited"], ["Storage", "10GB", "100GB", "1TB"], ["API Calls", "1K/month", "10K/month", "Unlimited"], ["Support", "Email", "Priority", "24/7 Phone"], ["Custom Domain", "❌", "✅", "✅"], ["Advanced Analytics", "❌", "✅", "✅"]], "headerBg": "#1e293b", "headerColor": "#ffffff", "alternateRowBg": "#f8fafc", "borderRadius": "12px", "fontSize": 15}', 2),
    (new_template_id, 'datawidget', '€29', 150, 420, 180, 100, '{"value": "€29", "label": "Basic Plan", "backgroundColor": "#e5e7eb", "color": "#1f2937", "borderRadius": "12px", "fontSize": 32, "border": "2px solid #d1d5db"}', 3),
    (new_template_id, 'datawidget', '€79', 372, 420, 180, 100, '{"value": "€79", "label": "Pro Plan", "background": "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", "color": "#ffffff", "borderRadius": "12px", "fontSize": 32, "boxShadow": "0 10px 30px rgba(59, 130, 246, 0.3)"}', 4),
    (new_template_id, 'datawidget', '€199', 594, 420, 180, 100, '{"value": "€199", "label": "Enterprise", "backgroundColor": "#1e293b", "color": "#ffffff", "borderRadius": "12px", "fontSize": 32}', 5),
    (new_template_id, 'cta', 'Start Free Trial', 362, 560, 200, 60, '{"text": "Start Free Trial", "background": "linear-gradient(90deg, #10b981 0%, #059669 100%)", "color": "#ffffff", "borderRadius": "30px", "fontSize": 18, "fontWeight": "600", "boxShadow": "0 8px 20px rgba(16, 185, 129, 0.3)"}', 6),
    (new_template_id, 'text', 'No credit card required • 14-day free trial • Cancel anytime', 262, 640, 500, 30, '{"fontSize": 14, "color": "#64748b", "textAlign": "center"}', 7);

    -- Template 8: Company About - Full Canvas
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Company About', 'Company information page', 'Business', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Building the Future', 212, 40, 600, 60, '{"fontSize": 42, "fontWeight": "bold", "color": "#0f172a", "textAlign": "center", "fontFamily": "Playfair Display, serif"}', 1),
    (new_template_id, 'image', 'Company Office', 100, 130, 350, 200, '{"src": "/api/placeholder/350/200", "alt": "Our Office", "objectFit": "cover", "borderRadius": "16px", "boxShadow": "0 20px 40px rgba(0, 0, 0, 0.1)"}', 2),
    (new_template_id, 'text', 'Founded in 2020, we have been at the forefront of innovation, helping businesses transform through cutting-edge technology. Our mission is to democratize access to advanced solutions and empower companies of all sizes.', 500, 130, 424, 100, '{"fontSize": 16, "color": "#475569", "lineHeight": 1.8, "fontFamily": "Inter, system-ui, sans-serif"}', 3),
    (new_template_id, 'datawidget', '10K+', 500, 250, 130, 80, '{"value": "10K+", "label": "Customers", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "12px", "fontSize": 24}', 4),
    (new_template_id, 'datawidget', '50+', 647, 250, 130, 80, '{"value": "50+", "label": "Team", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "12px", "fontSize": 24}', 5),
    (new_template_id, 'datawidget', '15+', 794, 250, 130, 80, '{"value": "15+", "label": "Countries", "backgroundColor": "#f59e0b", "color": "#ffffff", "borderRadius": "12px", "fontSize": 24}', 6),
    (new_template_id, 'heading', 'Our Values', 100, 380, 300, 40, '{"fontSize": 28, "fontWeight": "600", "color": "#1e293b"}', 7),
    (new_template_id, 'text', '• Innovation First\n• Customer Success\n• Transparency\n• Continuous Learning', 100, 430, 300, 100, '{"fontSize": 16, "color": "#64748b", "lineHeight": 1.8}', 8),
    (new_template_id, 'ai-agent', 'Company Culture', 450, 380, 474, 150, '{"systemPrompt": "Share insights about our company culture and values", "backgroundColor": "#f1f5f9", "borderRadius": "12px", "border": "2px solid #e2e8f0"}', 9),
    (new_template_id, 'footer', 'Get in Touch', 162, 580, 700, 100, '{"content": "© 2024 Company Name | contact@company.com | +31 20 123 4567\\nAmsterdam • London • New York • Singapore", "backgroundColor": "#1e293b", "color": "#cbd5e1", "textAlign": "center", "borderRadius": "12px", "padding": "20px", "lineHeight": 1.8}', 10);

END $$;
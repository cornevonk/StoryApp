-- Premium Modern Templates with Rich Styling for 1200x800 Canvas
-- Professional templates with full canvas utilization and complete styling

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

    -- Clean existing templates in Standaard library
    DELETE FROM template_elements WHERE template_elements.template_id IN (
        SELECT templates.id FROM templates WHERE templates.template_library_id = standaard_library_id
    );
    DELETE FROM templates WHERE templates.template_library_id = standaard_library_id;

    -- Template 1: SaaS Product Dashboard - Modern Purple/Blue Gradient Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('SaaS Analytics Dashboard', 'Modern SaaS dashboard met real-time metrics en beautiful gradients', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Dashboard Overview', 60, 40, 600, 60, '{"fontSize": 42, "fontWeight": "700", "color": "#1e293b", "fontFamily": "Inter, system-ui", "letterSpacing": "-0.02em"}', 1),
    (new_template_id, 'text', 'Real-time performance metrics updated every 5 minutes', 60, 110, 500, 30, '{"fontSize": 18, "color": "#64748b", "fontFamily": "Inter, system-ui"}', 2),
    
    -- KPI Cards Row - Spread across canvas width
    (new_template_id, 'datawidget', '€2.47M', 60, 160, 220, 120, '{"widgetType": "counter", "value": "€2.47M", "label": "Monthly Revenue", "format": "currency", "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "color": "#ffffff", "borderRadius": "16px", "padding": "24px", "boxShadow": "0 10px 30px rgba(102, 126, 234, 0.3)", "fontSize": 32, "fontWeight": "700"}', 3),
    (new_template_id, 'datawidget', '18,492', 300, 160, 220, 120, '{"widgetType": "counter", "value": "18,492", "label": "Active Users", "format": "number", "backgroundColor": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", "color": "#ffffff", "borderRadius": "16px", "padding": "24px", "boxShadow": "0 10px 30px rgba(240, 147, 251, 0.3)", "fontSize": 32, "fontWeight": "700"}', 4),
    (new_template_id, 'datawidget', '94.3%', 540, 160, 220, 120, '{"widgetType": "percentage", "value": "94.3%", "label": "Uptime SLA", "format": "percentage", "backgroundColor": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", "color": "#ffffff", "borderRadius": "16px", "padding": "24px", "boxShadow": "0 10px 30px rgba(79, 172, 254, 0.3)", "fontSize": 32, "fontWeight": "700"}', 5),
    (new_template_id, 'datawidget', '+23%', 780, 160, 220, 120, '{"widgetType": "text", "value": "+23%", "label": "Growth Rate", "backgroundColor": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", "color": "#1f2937", "borderRadius": "16px", "padding": "24px", "boxShadow": "0 10px 30px rgba(168, 237, 234, 0.3)", "fontSize": 32, "fontWeight": "700"}', 6),
    
    -- Main Chart - Larger for better visibility
    (new_template_id, 'chart', 'Revenue Growth', 60, 300, 480, 280, '{"chartType": "line", "title": "Revenue Growth - Last 12 Months", "backgroundColor": "#ffffff", "borderRadius": "20px", "padding": "28px", "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.08)", "border": "1px solid #e2e8f0"}', 7),
    
    -- Performance Metrics Table - Right side
    (new_template_id, 'table', 'Top Performing Products', 560, 300, 440, 280, '{"headers": ["Product", "Revenue", "Growth", "Status"], "rows": [["Pro Plan", "€892K", "+23%", "🟢"], ["Enterprise", "€567K", "+18%", "🟢"], ["Starter", "€234K", "+8%", "🟡"], ["Custom", "€189K", "-2%", "🔴"]], "headerBg": "#f8fafc", "headerColor": "#1e293b", "borderRadius": "20px", "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.08)", "cellPadding": "16px", "fontSize": 16, "alternateRowBg": "#fafbfc", "border": "1px solid #e2e8f0"}', 8),
    
    -- AI Insights - Full width at bottom
    (new_template_id, 'ai-agent', 'AI Performance Analysis', 60, 600, 780, 100, '{"systemPrompt": "Analyze dashboard metrics and provide actionable insights", "contentType": "insights", "backgroundColor": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", "borderRadius": "20px", "padding": "24px", "color": "#7c2d12", "fontSize": 16, "boxShadow": "0 8px 25px rgba(252, 182, 159, 0.3)"}', 9),
    
    -- Footer with Actions
    (new_template_id, 'cta', 'Export Report', 860, 600, 180, 60, '{"text": "Export to PDF", "backgroundColor": "#6366f1", "color": "#ffffff", "borderRadius": "16px", "fontSize": 18, "fontWeight": "600", "boxShadow": "0 6px 20px rgba(99, 102, 241, 0.4)"}', 10),
    (new_template_id, 'cta', 'Refresh Data', 860, 680, 180, 60, '{"text": "Refresh Data", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "16px", "fontSize": 18, "fontWeight": "600", "boxShadow": "0 6px 20px rgba(16, 185, 129, 0.4)"}', 11);

    -- Template 2: Marketing Campaign Results - Vibrant Orange/Pink Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Campaign Performance Report', 'Kleurrijke marketing campaign resultaten met engagement metrics', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Spring Campaign 2024', 60, 40, 700, 70, '{"fontSize": 48, "fontWeight": "800", "background": "linear-gradient(90deg, #f97316 0%, #ec4899 100%)", "backgroundClip": "text", "WebkitBackgroundClip": "text", "color": "transparent", "fontFamily": "Poppins, system-ui"}', 1),
    (new_template_id, 'text', 'Campaign Duration: March 1 - May 31, 2024 | Target: B2B SaaS Companies', 60, 120, 600, 30, '{"fontSize": 17, "color": "#6b7280", "fontStyle": "italic"}', 2),
    
    -- Campaign Metrics Grid - 4 columns
    (new_template_id, 'datawidget', '3.2M', 60, 170, 200, 110, '{"widgetType": "counter", "value": "3.2M", "label": "Impressions", "backgroundColor": "#fef3c7", "color": "#92400e", "borderRadius": "16px", "borderLeft": "6px solid #f59e0b", "fontSize": 32, "fontWeight": "700", "padding": "20px", "boxShadow": "0 4px 15px rgba(245, 158, 11, 0.2)"}', 3),
    (new_template_id, 'datawidget', '128K', 280, 170, 200, 110, '{"widgetType": "counter", "value": "128K", "label": "Clicks", "backgroundColor": "#fce7f3", "color": "#9f1239", "borderRadius": "16px", "borderLeft": "6px solid #ec4899", "fontSize": 32, "fontWeight": "700", "padding": "20px", "boxShadow": "0 4px 15px rgba(236, 72, 153, 0.2)"}', 4),
    (new_template_id, 'datawidget', '4.2%', 500, 170, 200, 110, '{"widgetType": "percentage", "value": "4.2%", "label": "CTR", "backgroundColor": "#ede9fe", "color": "#5b21b6", "borderRadius": "16px", "borderLeft": "6px solid #8b5cf6", "fontSize": 32, "fontWeight": "700", "padding": "20px", "boxShadow": "0 4px 15px rgba(139, 92, 246, 0.2)"}', 5),
    (new_template_id, 'datawidget', '€89K', 720, 170, 200, 110, '{"widgetType": "currency", "value": "€89K", "label": "Revenue", "backgroundColor": "#dcfce7", "color": "#14532d", "borderRadius": "16px", "borderLeft": "6px solid #22c55e", "fontSize": 32, "fontWeight": "700", "padding": "20px", "boxShadow": "0 4px 15px rgba(34, 197, 94, 0.2)"}', 6),
    
    -- Campaign Visuals Row
    (new_template_id, 'image', 'Campaign Creative', 60, 300, 280, 200, '{"src": "/api/placeholder/280/200", "alt": "Campaign Visual", "borderRadius": "20px", "objectFit": "cover", "boxShadow": "0 12px 35px rgba(0, 0, 0, 0.15)"}', 7),
    (new_template_id, 'video', 'Campaign Video', 360, 300, 320, 200, '{"src": "campaign-video.mp4", "poster": "/api/placeholder/320/200", "controls": true, "borderRadius": "20px", "boxShadow": "0 12px 35px rgba(0, 0, 0, 0.15)"}', 8),
    (new_template_id, 'chart', 'Weekly Performance', 700, 300, 240, 200, '{"chartType": "bar", "title": "Weekly CTR", "backgroundColor": "#ffffff", "borderRadius": "20px", "padding": "20px", "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.08)", "border": "1px solid #e2e8f0"}', 9),
    
    -- Channel Performance Table - Full width
    (new_template_id, 'table', 'Channel Performance', 60, 520, 880, 160, '{"headers": ["Channel", "Impressions", "Clicks", "CTR", "Cost", "Revenue", "ROI"], "rows": [["Google Ads", "1.2M", "52K", "4.3%", "€12K", "€34K", "283%"], ["Facebook", "890K", "38K", "4.3%", "€8K", "€28K", "350%"], ["LinkedIn", "650K", "28K", "4.3%", "€9K", "€18K", "200%"], ["Twitter", "460K", "10K", "2.2%", "€3K", "€9K", "300%"]], "headerBg": "#f97316", "headerColor": "#ffffff", "borderRadius": "16px", "fontSize": 15, "cellPadding": "12px", "boxShadow": "0 8px 25px rgba(249, 115, 22, 0.2)"}', 10),
    
    -- Call to Actions
    (new_template_id, 'cta', 'View Details', 60, 700, 200, 60, '{"text": "View Full Report", "backgroundColor": "#f97316", "color": "#ffffff", "borderRadius": "16px", "fontSize": 18, "fontWeight": "600", "boxShadow": "0 6px 20px rgba(249, 115, 22, 0.4)"}', 11),
    (new_template_id, 'cta', 'Schedule Meeting', 280, 700, 200, 60, '{"text": "Schedule Review", "backgroundColor": "#ec4899", "color": "#ffffff", "borderRadius": "16px", "fontSize": 18, "fontWeight": "600", "boxShadow": "0 6px 20px rgba(236, 72, 153, 0.4)"}', 12);

    -- Template 3: Tech Startup Pitch Deck - Dark Mode Professional
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Tech Startup Pitch', 'Sleek dark-mode pitch deck voor investeerders', 'Business', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'TechVenture AI', 80, 50, 600, 80, '{"fontSize": 56, "fontWeight": "800", "color": "#ffffff", "fontFamily": "SF Pro Display, system-ui", "letterSpacing": "-0.03em"}', 1),
    (new_template_id, 'text', 'Revolutionizing Enterprise AI with Next-Gen Language Models', 80, 140, 650, 40, '{"fontSize": 24, "color": "#94a3b8", "fontFamily": "SF Pro Text, system-ui", "fontWeight": "300"}', 2),
    
    -- Traction Metrics - 3 columns
    (new_template_id, 'datawidget', '$5.2M', 80, 200, 240, 130, '{"widgetType": "currency", "value": "$5.2M", "label": "ARR", "backgroundColor": "#1e293b", "color": "#10b981", "borderRadius": "20px", "border": "3px solid #10b981", "fontSize": 38, "fontWeight": "700", "padding": "24px", "boxShadow": "0 8px 25px rgba(16, 185, 129, 0.3)"}', 3),
    (new_template_id, 'datawidget', '47', 340, 200, 240, 130, '{"widgetType": "counter", "value": "47", "label": "Enterprise Clients", "backgroundColor": "#1e293b", "color": "#3b82f6", "borderRadius": "20px", "border": "3px solid #3b82f6", "fontSize": 38, "fontWeight": "700", "padding": "24px", "boxShadow": "0 8px 25px rgba(59, 130, 246, 0.3)"}', 4),
    (new_template_id, 'datawidget', '3.2x', 600, 200, 240, 130, '{"widgetType": "text", "value": "3.2x", "label": "YoY Growth", "backgroundColor": "#1e293b", "color": "#f59e0b", "borderRadius": "20px", "border": "3px solid #f59e0b", "fontSize": 38, "fontWeight": "700", "padding": "24px", "boxShadow": "0 8px 25px rgba(245, 158, 11, 0.3)"}', 5),
    
    -- Problem & Solution Section
    (new_template_id, 'heading', 'The Problem', 80, 360, 300, 50, '{"fontSize": 32, "fontWeight": "600", "color": "#ef4444", "fontFamily": "SF Pro Display, system-ui"}', 6),
    (new_template_id, 'text', '87% of enterprises struggle with AI implementation due to complexity, cost, and lack of expertise', 80, 420, 400, 80, '{"fontSize": 18, "color": "#cbd5e1", "lineHeight": 1.6, "fontFamily": "SF Pro Text, system-ui"}', 7),
    
    (new_template_id, 'heading', 'Our Solution', 520, 360, 300, 50, '{"fontSize": 32, "fontWeight": "600", "color": "#10b981", "fontFamily": "SF Pro Display, system-ui"}', 8),
    (new_template_id, 'text', 'Plug-and-play AI platform with pre-trained models, no-code interface, and 24/7 expert support', 520, 420, 400, 80, '{"fontSize": 18, "color": "#cbd5e1", "lineHeight": 1.6, "fontFamily": "SF Pro Text, system-ui"}', 9),
    
    -- Market Opportunity Chart - Full width
    (new_template_id, 'chart', 'Market Growth', 80, 520, 840, 200, '{"chartType": "line", "title": "Total Addressable Market (TAM)", "backgroundColor": "#1e293b", "borderRadius": "20px", "padding": "24px", "gridColor": "#334155", "axisColor": "#64748b", "dataColor": "#10b981", "boxShadow": "0 8px 25px rgba(30, 41, 59, 0.4)"}', 10),
    
    -- Footer with investment details
    (new_template_id, 'footer', 'Investment Details', 80, 740, 840, 50, '{"content": "Series A: $20M at $100M valuation | Lead: Sequoia Capital | Contact: invest@techventure.ai", "backgroundColor": "#0f172a", "color": "#64748b", "textAlign": "center", "fontSize": 16, "padding": "16px", "borderRadius": "12px", "border": "1px solid #334155"}', 11);

    -- Template 4: E-Learning Course Overview - Colorful Educational Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Online Course Module', 'Engaging e-learning course template met progress tracking', 'Education', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', '🎓 Advanced Web Development', 60, 40, 700, 70, '{"fontSize": 44, "fontWeight": "700", "color": "#1e40af", "fontFamily": "Nunito, system-ui"}', 1),
    (new_template_id, 'text', 'Module 3: React & Modern Frontend Frameworks', 60, 120, 500, 35, '{"fontSize": 22, "color": "#6b7280", "fontFamily": "Nunito, system-ui"}', 2),
    
    -- Progress Indicators - Circular design
    (new_template_id, 'datawidget', '68%', 60, 180, 150, 150, '{"widgetType": "percentage", "value": "68%", "label": "Complete", "backgroundColor": "#dbeafe", "color": "#1e40af", "borderRadius": "75px", "fontSize": 32, "fontWeight": "700", "textAlign": "center", "padding": "40px", "boxShadow": "0 8px 25px rgba(30, 64, 175, 0.2)"}', 3),
    (new_template_id, 'datawidget', '12/18', 230, 180, 150, 150, '{"widgetType": "text", "value": "12/18", "label": "Lessons", "backgroundColor": "#fce7f3", "color": "#be185d", "borderRadius": "75px", "fontSize": 32, "fontWeight": "700", "textAlign": "center", "padding": "40px", "boxShadow": "0 8px 25px rgba(190, 24, 93, 0.2)"}', 4),
    (new_template_id, 'datawidget', '4.8⭐', 400, 180, 150, 150, '{"widgetType": "text", "value": "4.8⭐", "label": "Rating", "backgroundColor": "#fef3c7", "color": "#d97706", "borderRadius": "75px", "fontSize": 32, "fontWeight": "700", "textAlign": "center", "padding": "40px", "boxShadow": "0 8px 25px rgba(217, 119, 6, 0.2)"}', 5),
    
    -- Course Content Table
    (new_template_id, 'table', 'Course Curriculum', 60, 350, 480, 240, '{"headers": ["📚 Lesson", "⏱ Duration", "✅ Status"], "rows": [["1. Introduction to React", "45 min", "✅ Complete"], ["2. Components & Props", "60 min", "✅ Complete"], ["3. State Management", "75 min", "🔄 In Progress"], ["4. Hooks Deep Dive", "90 min", "🔒 Locked"], ["5. Advanced Patterns", "60 min", "🔒 Locked"]], "headerBg": "#3b82f6", "headerColor": "#ffffff", "borderRadius": "16px", "fontSize": 16, "cellPadding": "16px", "alternateRowBg": "#f9fafb", "boxShadow": "0 8px 25px rgba(59, 130, 246, 0.1)"}', 6),
    
    -- Video Player - Larger
    (new_template_id, 'video', 'Current Lesson Video', 570, 180, 350, 240, '{"src": "lesson-video.mp4", "poster": "/api/placeholder/350/240", "controls": true, "borderRadius": "20px", "boxShadow": "0 12px 35px rgba(0, 0, 0, 0.2)"}', 7),
    
    -- Code Demo
    (new_template_id, 'demo', 'Live Code Example', 570, 440, 350, 150, '{"code": "const [count, setCount] = useState(0);\n\nreturn (\n  <button onClick={() => setCount(count + 1)}>\n    Count: {count}\n  </button>\n);", "language": "javascript", "backgroundColor": "#1e293b", "color": "#64d86b", "borderRadius": "16px", "padding": "20px", "fontSize": 14, "fontFamily": "Fira Code, monospace"}', 8),
    
    -- Learning Actions
    (new_template_id, 'cta', 'Continue Learning', 60, 610, 220, 70, '{"text": "▶️ Continue Learning", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "35px", "fontSize": 18, "fontWeight": "600", "boxShadow": "0 6px 20px rgba(59, 130, 246, 0.5)"}', 9),
    (new_template_id, 'cta', 'Download Resources', 300, 610, 220, 70, '{"text": "📥 Download Resources", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "35px", "fontSize": 18, "fontWeight": "600", "boxShadow": "0 6px 20px rgba(16, 185, 129, 0.4)"}', 10),
    
    -- AI Tutor
    (new_template_id, 'ai-agent', 'AI Learning Assistant', 60, 700, 860, 80, '{"systemPrompt": "Act as a helpful coding tutor", "contentType": "educational", "backgroundColor": "#f3f4f6", "borderRadius": "16px", "padding": "20px", "borderLeft": "6px solid #3b82f6", "fontSize": 16, "boxShadow": "0 4px 15px rgba(59, 130, 246, 0.1)"}', 11);

    -- Template 5: Financial Report - Professional Banking Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Quarterly Financial Report', 'Professional financial dashboard met advanced metrics', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'image', 'Company Logo', 60, 40, 80, 80, '{"src": "/api/placeholder/80/80", "alt": "Logo", "objectFit": "contain", "borderRadius": "8px"}', 1),
    (new_template_id, 'heading', 'Q4 2024 Financial Report', 160, 50, 600, 60, '{"fontSize": 40, "fontWeight": "600", "color": "#0f172a", "fontFamily": "Georgia, serif"}', 2),
    (new_template_id, 'text', 'Confidential - Board of Directors Only', 800, 60, 300, 30, '{"fontSize": 14, "color": "#dc2626", "fontWeight": "600", "textAlign": "right"}', 3),
    
    -- Key Financial Metrics - 4 columns
    (new_template_id, 'datawidget', '€14.7M', 60, 140, 220, 110, '{"widgetType": "currency", "value": "€14.7M", "label": "Total Revenue", "backgroundColor": "#ffffff", "color": "#059669", "borderRadius": "12px", "border": "2px solid #e5e7eb", "fontSize": 30, "fontWeight": "700", "boxShadow": "0 4px 15px rgba(0, 0, 0, 0.08)", "padding": "20px"}', 4),
    (new_template_id, 'datawidget', '€3.2M', 300, 140, 220, 110, '{"widgetType": "currency", "value": "€3.2M", "label": "Net Profit", "backgroundColor": "#ffffff", "color": "#059669", "borderRadius": "12px", "border": "2px solid #e5e7eb", "fontSize": 30, "fontWeight": "700", "boxShadow": "0 4px 15px rgba(0, 0, 0, 0.08)", "padding": "20px"}', 5),
    (new_template_id, 'datawidget', '21.8%', 540, 140, 220, 110, '{"widgetType": "percentage", "value": "21.8%", "label": "Profit Margin", "backgroundColor": "#ffffff", "color": "#0284c7", "borderRadius": "12px", "border": "2px solid #e5e7eb", "fontSize": 30, "fontWeight": "700", "boxShadow": "0 4px 15px rgba(0, 0, 0, 0.08)", "padding": "20px"}', 6),
    (new_template_id, 'datawidget', '+18.4%', 780, 140, 220, 110, '{"widgetType": "text", "value": "+18.4%", "label": "YoY Growth", "backgroundColor": "#ffffff", "color": "#059669", "borderRadius": "12px", "border": "2px solid #e5e7eb", "fontSize": 30, "fontWeight": "700", "boxShadow": "0 4px 15px rgba(0, 0, 0, 0.08)", "padding": "20px"}', 7),
    
    -- Revenue Breakdown Chart
    (new_template_id, 'chart', 'Revenue by Region', 60, 270, 460, 260, '{"chartType": "pie", "title": "Revenue Distribution by Region", "backgroundColor": "#ffffff", "borderRadius": "16px", "padding": "24px", "border": "2px solid #e5e7eb", "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.06)"}', 8),
    
    -- Financial Table
    (new_template_id, 'table', 'Detailed Financials', 540, 270, 460, 260, '{"headers": ["Category", "Q4 2024", "Q3 2024", "Change"], "rows": [["Revenue", "€14.7M", "€12.4M", "+18.5%"], ["Operating Costs", "€8.9M", "€8.1M", "+9.9%"], ["EBITDA", "€5.8M", "€4.3M", "+34.9%"], ["Net Profit", "€3.2M", "€2.1M", "+52.4%"], ["Cash Flow", "€4.1M", "€3.2M", "+28.1%"]], "headerBg": "#0f172a", "headerColor": "#ffffff", "borderRadius": "16px", "fontSize": 15, "cellPadding": "14px", "border": "2px solid #e5e7eb", "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.06)"}', 9),
    
    -- Forecast Chart - Full width
    (new_template_id, 'chart', '2025 Forecast', 60, 550, 940, 180, '{"chartType": "bar", "title": "2025 Revenue Forecast by Quarter", "backgroundColor": "#f8fafc", "borderRadius": "16px", "padding": "24px", "border": "2px solid #e5e7eb", "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.06)"}', 10),
    
    -- Executive Summary
    (new_template_id, 'text', 'Executive Summary: Q4 showed exceptional growth across all key metrics, with particularly strong performance in the European market (+32%) and Enterprise segment (+45%). Recommend increasing investment in sales and R&D for 2025.', 60, 750, 940, 50, '{"fontSize": 16, "color": "#475569", "lineHeight": 1.6, "fontStyle": "italic", "backgroundColor": "#f1f5f9", "padding": "16px", "borderRadius": "12px", "border": "1px solid #e2e8f0"}', 11);

    -- Template 6: Healthcare Dashboard - Medical Professional Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Patient Care Dashboard', 'Healthcare analytics dashboard voor medical professionals', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', '🏥 St. Mary Hospital Dashboard', 60, 40, 700, 60, '{"fontSize": 40, "fontWeight": "600", "color": "#0c4a6e", "fontFamily": "Inter, system-ui"}', 1),
    (new_template_id, 'text', 'Real-time patient care metrics and hospital operations', 60, 110, 500, 30, '{"fontSize": 18, "color": "#64748b"}', 2),
    
    -- Critical Metrics - 4 columns
    (new_template_id, 'datawidget', '142', 60, 160, 180, 100, '{"widgetType": "counter", "value": "142", "label": "Current Patients", "backgroundColor": "#0891b2", "color": "#ffffff", "borderRadius": "16px", "fontSize": 34, "fontWeight": "700", "padding": "20px", "boxShadow": "0 6px 20px rgba(8, 145, 178, 0.3)"}', 3),
    (new_template_id, 'datawidget', '89%', 260, 160, 180, 100, '{"widgetType": "percentage", "value": "89%", "label": "Bed Occupancy", "backgroundColor": "#16a34a", "color": "#ffffff", "borderRadius": "16px", "fontSize": 34, "fontWeight": "700", "padding": "20px", "boxShadow": "0 6px 20px rgba(22, 163, 74, 0.3)"}', 4),
    (new_template_id, 'datawidget', '12', 460, 160, 180, 100, '{"widgetType": "counter", "value": "12", "label": "Critical Care", "backgroundColor": "#dc2626", "color": "#ffffff", "borderRadius": "16px", "fontSize": 34, "fontWeight": "700", "padding": "20px", "boxShadow": "0 6px 20px rgba(220, 38, 38, 0.3)"}', 5),
    (new_template_id, 'datawidget', '4.2', 660, 160, 180, 100, '{"widgetType": "text", "value": "4.2 hrs", "label": "Avg Wait Time", "backgroundColor": "#ea580c", "color": "#ffffff", "borderRadius": "16px", "fontSize": 34, "fontWeight": "700", "padding": "20px", "boxShadow": "0 6px 20px rgba(234, 88, 12, 0.3)"}', 6),
    
    -- Department Status Table
    (new_template_id, 'table', 'Department Status', 60, 280, 500, 220, '{"headers": ["Department", "Patients", "Staff", "Status"], "rows": [["Emergency", "28", "12", "🔴 High"], ["ICU", "12", "8", "🟡 Moderate"], ["Surgery", "15", "10", "🟢 Normal"], ["Pediatrics", "22", "6", "🟡 Moderate"], ["Maternity", "18", "8", "🟢 Normal"]], "headerBg": "#0c4a6e", "headerColor": "#ffffff", "borderRadius": "16px", "fontSize": 15, "cellPadding": "14px", "boxShadow": "0 8px 25px rgba(12, 74, 110, 0.15)"}', 7),
    
    -- Patient Flow Chart
    (new_template_id, 'chart', 'Patient Admissions', 580, 280, 340, 220, '{"chartType": "line", "title": "24-Hour Patient Flow", "backgroundColor": "#ffffff", "borderRadius": "16px", "padding": "20px", "border": "2px solid #e2e8f0", "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.06)"}', 8),
    
    -- Staff Schedule
    (new_template_id, 'table', 'On-Call Staff', 60, 520, 380, 140, '{"headers": ["Name", "Department", "Shift"], "rows": [["Dr. Smith", "Emergency", "08:00-20:00"], ["Dr. Johnson", "ICU", "20:00-08:00"], ["Nurse Williams", "Surgery", "08:00-16:00"]], "headerBg": "#f1f5f9", "headerColor": "#0c4a6e", "borderRadius": "12px", "fontSize": 14, "cellPadding": "12px"}', 9),
    
    -- AI Medical Assistant
    (new_template_id, 'ai-agent', 'Medical AI Assistant', 460, 520, 460, 140, '{"systemPrompt": "Analyze patient flow and suggest resource optimization", "contentType": "medical", "backgroundColor": "#e0f2fe", "borderRadius": "16px", "padding": "20px", "color": "#0c4a6e", "borderLeft": "6px solid #0891b2", "fontSize": 16}', 10),
    
    -- Emergency Alert
    (new_template_id, 'text', '⚠️ Alert: Trauma patient arriving in 5 minutes. OR-3 prepared.', 60, 680, 860, 50, '{"fontSize": 18, "color": "#dc2626", "backgroundColor": "#fef2f2", "padding": "16px", "borderRadius": "12px", "fontWeight": "600", "borderLeft": "6px solid #dc2626", "boxShadow": "0 4px 15px rgba(220, 38, 38, 0.2)"}', 11);

END $$;
-- Premium Modern Templates with Rich Styling and Complete Layouts
-- 8 Unique, Themed Templates with Professional Design

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
    (new_template_id, 'heading', 'Dashboard Overview', 40, 20, 520, 45, '{"fontSize": 36, "fontWeight": "700", "color": "#1e293b", "fontFamily": "Inter, system-ui", "letterSpacing": "-0.02em"}', 1),
    (new_template_id, 'text', 'Real-time performance metrics updated every 5 minutes', 40, 70, 400, 25, '{"fontSize": 16, "color": "#64748b", "fontFamily": "Inter, system-ui"}', 2),
    
    -- KPI Cards Row
    (new_template_id, 'datawidget', '€2.47M', 40, 120, 160, 100, '{"widgetType": "counter", "value": 2470000, "label": "Monthly Revenue", "format": "currency", "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "color": "#ffffff", "borderRadius": "16px", "padding": "20px", "boxShadow": "0 10px 30px rgba(102, 126, 234, 0.3)", "fontSize": 28, "fontWeight": "700"}', 3),
    (new_template_id, 'datawidget', '18,492', 220, 120, 160, 100, '{"widgetType": "counter", "value": 18492, "label": "Active Users", "format": "number", "backgroundColor": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", "color": "#ffffff", "borderRadius": "16px", "padding": "20px", "boxShadow": "0 10px 30px rgba(240, 147, 251, 0.3)", "fontSize": 28, "fontWeight": "700"}', 4),
    (new_template_id, 'datawidget', '94.3%', 400, 120, 160, 100, '{"widgetType": "percentage", "value": 94.3, "label": "Uptime SLA", "format": "percentage", "backgroundColor": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", "color": "#ffffff", "borderRadius": "16px", "padding": "20px", "boxShadow": "0 10px 30px rgba(79, 172, 254, 0.3)", "fontSize": 28, "fontWeight": "700"}', 5),
    
    -- Main Chart
    (new_template_id, 'chart', 'Revenue Growth', 40, 240, 340, 220, '{"chartType": "line", "title": "Revenue Growth - Last 12 Months", "backgroundColor": "#ffffff", "borderRadius": "16px", "padding": "24px", "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.07)", "borderColor": "#e2e8f0", "borderWidth": 1, "gridColor": "#f1f5f9"}', 6),
    
    -- Performance Metrics Table
    (new_template_id, 'table', 'Top Performing Products', 400, 240, 280, 220, '{"headers": ["Product", "Revenue", "Growth", "Status"], "rows": [["Pro Plan", "€892K", "+23%", "🟢"], ["Enterprise", "€567K", "+18%", "🟢"], ["Starter", "€234K", "+8%", "🟡"], ["Custom", "€189K", "-2%", "🔴"]], "headerBg": "#f8fafc", "headerColor": "#1e293b", "borderRadius": "16px", "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.07)", "cellPadding": "12px", "fontSize": 14, "alternateRowBg": "#fafbfc"}', 7),
    
    -- AI Insights
    (new_template_id, 'ai-agent', 'AI Performance Analysis', 40, 480, 640, 80, '{"systemPrompt": "Analyze dashboard metrics and provide actionable insights", "contentType": "insights", "backgroundColor": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", "borderRadius": "16px", "padding": "20px", "color": "#7c2d12", "fontSize": 15}', 8),
    
    -- Footer with Actions
    (new_template_id, 'cta', 'Export Report', 520, 580, 160, 45, '{"text": "Export to PDF", "backgroundColor": "#6366f1", "color": "#ffffff", "borderRadius": "10px", "fontSize": 16, "fontWeight": "600", "boxShadow": "0 4px 14px rgba(99, 102, 241, 0.4)"}', 9);

    -- Template 2: Marketing Campaign Results - Vibrant Orange/Pink Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Campaign Performance Report', 'Kleurrijke marketing campaign resultaten met engagement metrics', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'Spring Campaign 2024', 40, 25, 480, 50, '{"fontSize": 42, "fontWeight": "800", "background": "linear-gradient(90deg, #f97316 0%, #ec4899 100%)", "backgroundClip": "text", "WebkitBackgroundClip": "text", "color": "transparent", "fontFamily": "Poppins, system-ui"}', 1),
    (new_template_id, 'text', 'Campaign Duration: March 1 - May 31, 2024 | Target: B2B SaaS Companies', 40, 80, 500, 25, '{"fontSize": 15, "color": "#6b7280", "fontStyle": "italic"}', 2),
    
    -- Campaign Metrics Grid
    (new_template_id, 'datawidget', '3.2M', 40, 130, 140, 90, '{"widgetType": "counter", "value": 3200000, "label": "Impressions", "backgroundColor": "#fef3c7", "color": "#92400e", "borderRadius": "12px", "borderLeft": "4px solid #f59e0b", "fontSize": 26, "fontWeight": "700"}', 3),
    (new_template_id, 'datawidget', '128K', 195, 130, 140, 90, '{"widgetType": "counter", "value": 128000, "label": "Clicks", "backgroundColor": "#fce7f3", "color": "#9f1239", "borderRadius": "12px", "borderLeft": "4px solid #ec4899", "fontSize": 26, "fontWeight": "700"}', 4),
    (new_template_id, 'datawidget', '4.2%', 350, 130, 140, 90, '{"widgetType": "percentage", "value": 4.2, "label": "CTR", "backgroundColor": "#ede9fe", "color": "#5b21b6", "borderRadius": "12px", "borderLeft": "4px solid #8b5cf6", "fontSize": 26, "fontWeight": "700"}', 5),
    (new_template_id, 'datawidget', '€89K', 505, 130, 140, 90, '{"widgetType": "currency", "value": 89000, "label": "Revenue", "backgroundColor": "#dcfce7", "color": "#14532d", "borderRadius": "12px", "borderLeft": "4px solid #22c55e", "fontSize": 26, "fontWeight": "700"}', 6),
    
    -- Campaign Visuals
    (new_template_id, 'image', 'Campaign Creative', 40, 240, 200, 150, '{"src": "/api/placeholder/200/150", "alt": "Campaign Visual", "borderRadius": "12px", "objectFit": "cover", "boxShadow": "0 10px 25px rgba(0, 0, 0, 0.1)"}', 7),
    (new_template_id, 'video', 'Campaign Video', 255, 240, 250, 150, '{"src": "campaign-video.mp4", "poster": "/api/placeholder/250/150", "controls": true, "borderRadius": "12px", "boxShadow": "0 10px 25px rgba(0, 0, 0, 0.1)"}', 8),
    
    -- Performance Chart
    (new_template_id, 'chart', 'Weekly Performance', 520, 240, 160, 150, '{"chartType": "bar", "title": "Weekly CTR", "backgroundColor": "#ffffff", "borderRadius": "12px", "padding": "16px", "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.07)"}', 9),
    
    -- Channel Performance Table
    (new_template_id, 'table', 'Channel Performance', 40, 410, 640, 140, '{"headers": ["Channel", "Impressions", "Clicks", "CTR", "Cost", "Revenue", "ROI"], "rows": [["Google Ads", "1.2M", "52K", "4.3%", "€12K", "€34K", "283%"], ["Facebook", "890K", "38K", "4.3%", "€8K", "€28K", "350%"], ["LinkedIn", "650K", "28K", "4.3%", "€9K", "€18K", "200%"], ["Twitter", "460K", "10K", "2.2%", "€3K", "€9K", "300%"]], "headerBg": "#f97316", "headerColor": "#ffffff", "borderRadius": "12px", "fontSize": 13, "cellPadding": "10px"}', 10),
    
    -- Call to Actions
    (new_template_id, 'cta', 'View Details', 40, 570, 150, 45, '{"text": "View Full Report", "backgroundColor": "#f97316", "color": "#ffffff", "borderRadius": "10px", "fontSize": 16, "fontWeight": "600"}', 11),
    (new_template_id, 'cta', 'Schedule Meeting', 205, 570, 150, 45, '{"text": "Schedule Review", "backgroundColor": "#ec4899", "color": "#ffffff", "borderRadius": "10px", "fontSize": 16, "fontWeight": "600"}', 12);

    -- Template 3: Tech Startup Pitch Deck - Dark Mode Professional
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Tech Startup Pitch', 'Sleek dark-mode pitch deck voor investeerders', 'Business', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'TechVenture AI', 50, 30, 400, 60, '{"fontSize": 48, "fontWeight": "800", "color": "#ffffff", "fontFamily": "SF Pro Display, system-ui", "letterSpacing": "-0.03em"}', 1),
    (new_template_id, 'text', 'Revolutionizing Enterprise AI with Next-Gen Language Models', 50, 95, 450, 30, '{"fontSize": 20, "color": "#94a3b8", "fontFamily": "SF Pro Text, system-ui", "fontWeight": "300"}', 2),
    
    -- Traction Metrics
    (new_template_id, 'datawidget', '$5.2M', 50, 150, 180, 100, '{"widgetType": "currency", "value": 5200000, "label": "ARR", "backgroundColor": "#1e293b", "color": "#10b981", "borderRadius": "16px", "border": "2px solid #10b981", "fontSize": 32, "fontWeight": "700", "padding": "20px"}', 3),
    (new_template_id, 'datawidget', '47', 250, 150, 180, 100, '{"widgetType": "counter", "value": 47, "label": "Enterprise Clients", "backgroundColor": "#1e293b", "color": "#3b82f6", "borderRadius": "16px", "border": "2px solid #3b82f6", "fontSize": 32, "fontWeight": "700", "padding": "20px"}', 4),
    (new_template_id, 'datawidget', '3.2x', 450, 150, 180, 100, '{"widgetType": "text", "value": "3.2x", "label": "YoY Growth", "backgroundColor": "#1e293b", "color": "#f59e0b", "borderRadius": "16px", "border": "2px solid #f59e0b", "fontSize": 32, "fontWeight": "700", "padding": "20px"}', 5),
    
    -- Problem & Solution
    (new_template_id, 'heading', 'The Problem', 50, 270, 200, 35, '{"fontSize": 24, "fontWeight": "600", "color": "#ef4444", "fontFamily": "SF Pro Display, system-ui"}', 6),
    (new_template_id, 'text', '87% of enterprises struggle with AI implementation due to complexity, cost, and lack of expertise', 50, 310, 280, 60, '{"fontSize": 16, "color": "#cbd5e1", "lineHeight": 1.6, "fontFamily": "SF Pro Text, system-ui"}', 7),
    
    (new_template_id, 'heading', 'Our Solution', 350, 270, 200, 35, '{"fontSize": 24, "fontWeight": "600", "color": "#10b981", "fontFamily": "SF Pro Display, system-ui"}', 8),
    (new_template_id, 'text', 'Plug-and-play AI platform with pre-trained models, no-code interface, and 24/7 expert support', 350, 310, 280, 60, '{"fontSize": 16, "color": "#cbd5e1", "lineHeight": 1.6, "fontFamily": "SF Pro Text, system-ui"}', 9),
    
    -- Market Opportunity Chart
    (new_template_id, 'chart', 'Market Growth', 50, 390, 580, 180, '{"chartType": "line", "title": "Total Addressable Market (TAM)", "backgroundColor": "#1e293b", "borderRadius": "16px", "padding": "20px", "gridColor": "#334155", "axisColor": "#64748b", "dataColor": "#10b981"}', 10),
    
    -- Footer
    (new_template_id, 'footer', 'Investment Details', 50, 590, 580, 40, '{"content": "Series A: $20M at $100M valuation | Lead: Sequoia Capital | Contact: invest@techventure.ai", "backgroundColor": "#0f172a", "color": "#64748b", "textAlign": "center", "fontSize": 14, "padding": "12px", "borderRadius": "8px"}', 11);

    -- Template 4: E-Learning Course Overview - Colorful Educational Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Online Course Module', 'Engaging e-learning course template met progress tracking', 'Education', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', '🎓 Advanced Web Development', 40, 20, 500, 50, '{"fontSize": 36, "fontWeight": "700", "color": "#1e40af", "fontFamily": "Nunito, system-ui"}', 1),
    (new_template_id, 'text', 'Module 3: React & Modern Frontend Frameworks', 40, 75, 400, 25, '{"fontSize": 18, "color": "#6b7280", "fontFamily": "Nunito, system-ui"}', 2),
    
    -- Progress Indicators
    (new_template_id, 'datawidget', '68%', 40, 120, 120, 120, '{"widgetType": "percentage", "value": 68, "label": "Complete", "backgroundColor": "#dbeafe", "color": "#1e40af", "borderRadius": "60px", "fontSize": 28, "fontWeight": "700", "textAlign": "center", "padding": "30px"}', 3),
    (new_template_id, 'datawidget', '12/18', 170, 120, 120, 120, '{"widgetType": "text", "value": "12/18", "label": "Lessons", "backgroundColor": "#fce7f3", "color": "#be185d", "borderRadius": "60px", "fontSize": 28, "fontWeight": "700", "textAlign": "center", "padding": "30px"}', 4),
    (new_template_id, 'datawidget', '4.8⭐', 300, 120, 120, 120, '{"widgetType": "text", "value": "4.8⭐", "label": "Rating", "backgroundColor": "#fef3c7", "color": "#d97706", "borderRadius": "60px", "fontSize": 28, "fontWeight": "700", "textAlign": "center", "padding": "30px"}', 5),
    
    -- Course Content Table
    (new_template_id, 'table', 'Course Curriculum', 40, 260, 380, 200, '{"headers": ["📚 Lesson", "⏱ Duration", "✅ Status"], "rows": [["1. Introduction to React", "45 min", "✅ Complete"], ["2. Components & Props", "60 min", "✅ Complete"], ["3. State Management", "75 min", "🔄 In Progress"], ["4. Hooks Deep Dive", "90 min", "🔒 Locked"], ["5. Advanced Patterns", "60 min", "🔒 Locked"]], "headerBg": "#3b82f6", "headerColor": "#ffffff", "borderRadius": "12px", "fontSize": 14, "cellPadding": "12px", "alternateRowBg": "#f9fafb"}', 6),
    
    -- Video Player
    (new_template_id, 'video', 'Current Lesson Video', 440, 120, 240, 180, '{"src": "lesson-video.mp4", "poster": "/api/placeholder/240/180", "controls": true, "borderRadius": "12px", "boxShadow": "0 10px 25px rgba(0, 0, 0, 0.15)"}', 7),
    
    -- Code Demo
    (new_template_id, 'demo', 'Live Code Example', 440, 320, 240, 140, '{"code": "const [count, setCount] = useState(0);\n\nreturn (\n  <button onClick={() => setCount(count + 1)}>\n    Count: {count}\n  </button>\n);", "language": "javascript", "backgroundColor": "#1e293b", "color": "#64d86b", "borderRadius": "8px", "padding": "12px", "fontSize": 12}', 8),
    
    -- Learning Actions
    (new_template_id, 'cta', 'Continue Learning', 40, 480, 180, 50, '{"text": "▶️ Continue Learning", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "25px", "fontSize": 16, "fontWeight": "600", "boxShadow": "0 4px 14px rgba(59, 130, 246, 0.5)"}', 9),
    (new_template_id, 'cta', 'Download Resources', 240, 480, 180, 50, '{"text": "📥 Download Resources", "backgroundColor": "#10b981", "color": "#ffffff", "borderRadius": "25px", "fontSize": 16, "fontWeight": "600"}', 10),
    
    -- AI Tutor
    (new_template_id, 'ai-agent', 'AI Learning Assistant', 40, 540, 640, 60, '{"systemPrompt": "Act as a helpful coding tutor", "contentType": "educational", "backgroundColor": "#f3f4f6", "borderRadius": "12px", "padding": "16px", "borderLeft": "4px solid #3b82f6"}', 11);

    -- Template 5: Financial Report - Professional Banking Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Quarterly Financial Report', 'Professional financial dashboard met advanced metrics', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'image', 'Company Logo', 40, 20, 60, 60, '{"src": "/api/placeholder/60/60", "alt": "Logo", "objectFit": "contain"}', 1),
    (new_template_id, 'heading', 'Q4 2024 Financial Report', 110, 30, 400, 40, '{"fontSize": 32, "fontWeight": "600", "color": "#0f172a", "fontFamily": "Georgia, serif"}', 2),
    (new_template_id, 'text', 'Confidential - Board of Directors Only', 520, 40, 200, 20, '{"fontSize": 12, "color": "#dc2626", "fontWeight": "600", "textAlign": "right"}', 3),
    
    -- Key Financial Metrics
    (new_template_id, 'datawidget', '€14.7M', 40, 100, 165, 85, '{"widgetType": "currency", "value": 14700000, "label": "Total Revenue", "backgroundColor": "#ffffff", "color": "#059669", "borderRadius": "8px", "border": "1px solid #e5e7eb", "fontSize": 24, "fontWeight": "700", "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"}', 4),
    (new_template_id, 'datawidget', '€3.2M', 215, 100, 165, 85, '{"widgetType": "currency", "value": 3200000, "label": "Net Profit", "backgroundColor": "#ffffff", "color": "#059669", "borderRadius": "8px", "border": "1px solid #e5e7eb", "fontSize": 24, "fontWeight": "700", "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"}', 5),
    (new_template_id, 'datawidget', '21.8%', 390, 100, 165, 85, '{"widgetType": "percentage", "value": 21.8, "label": "Profit Margin", "backgroundColor": "#ffffff", "color": "#0284c7", "borderRadius": "8px", "border": "1px solid #e5e7eb", "fontSize": 24, "fontWeight": "700", "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"}', 6),
    (new_template_id, 'datawidget', '+18.4%', 565, 100, 165, 85, '{"widgetType": "text", "value": "+18.4%", "label": "YoY Growth", "backgroundColor": "#ffffff", "color": "#059669", "borderRadius": "8px", "border": "1px solid #e5e7eb", "fontSize": 24, "fontWeight": "700", "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"}', 7),
    
    -- Revenue Breakdown Chart
    (new_template_id, 'chart', 'Revenue by Region', 40, 200, 340, 200, '{"chartType": "pie", "title": "Revenue Distribution by Region", "backgroundColor": "#ffffff", "borderRadius": "8px", "padding": "16px", "border": "1px solid #e5e7eb"}', 8),
    
    -- Financial Table
    (new_template_id, 'table', 'Detailed Financials', 400, 200, 330, 200, '{"headers": ["Category", "Q4 2024", "Q3 2024", "Change"], "rows": [["Revenue", "€14.7M", "€12.4M", "+18.5%"], ["Operating Costs", "€8.9M", "€8.1M", "+9.9%"], ["EBITDA", "€5.8M", "€4.3M", "+34.9%"], ["Net Profit", "€3.2M", "€2.1M", "+52.4%"], ["Cash Flow", "€4.1M", "€3.2M", "+28.1%"]], "headerBg": "#0f172a", "headerColor": "#ffffff", "borderRadius": "8px", "fontSize": 13, "cellPadding": "10px", "border": "1px solid #e5e7eb"}', 9),
    
    -- Forecast Chart
    (new_template_id, 'chart', '2025 Forecast', 40, 420, 690, 160, '{"chartType": "bar", "title": "2025 Revenue Forecast by Quarter", "backgroundColor": "#f8fafc", "borderRadius": "8px", "padding": "16px", "border": "1px solid #e5e7eb"}', 10),
    
    -- Executive Summary
    (new_template_id, 'text', 'Executive Summary: Q4 showed exceptional growth across all key metrics, with particularly strong performance in the European market (+32%) and Enterprise segment (+45%). Recommend increasing investment in sales and R&D for 2025.', 40, 590, 690, 40, '{"fontSize": 14, "color": "#475569", "lineHeight": 1.6, "fontStyle": "italic", "backgroundColor": "#f1f5f9", "padding": "12px", "borderRadius": "6px"}', 11);

    -- Template 6: Product Showcase - Modern E-commerce Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Product Launch Showcase', 'Beautiful product presentation met specifications en reviews', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', 'AirPods Pro Max', 40, 25, 400, 50, '{"fontSize": 42, "fontWeight": "300", "color": "#000000", "fontFamily": "SF Pro Display, -apple-system", "letterSpacing": "-0.02em"}', 1),
    (new_template_id, 'text', 'Magical Listening Experience', 40, 80, 300, 25, '{"fontSize": 20, "color": "#86868b", "fontFamily": "SF Pro Text, -apple-system"}', 2),
    
    -- Product Image
    (new_template_id, 'image', 'Product Hero', 40, 120, 280, 280, '{"src": "/api/placeholder/280/280", "alt": "AirPods Pro Max", "borderRadius": "20px", "backgroundColor": "#f5f5f7", "objectFit": "contain", "padding": "20px"}', 3),
    
    -- Pricing & Availability
    (new_template_id, 'datawidget', '€629', 340, 120, 140, 80, '{"widgetType": "currency", "value": 629, "label": "Starting at", "backgroundColor": "#000000", "color": "#ffffff", "borderRadius": "16px", "fontSize": 32, "fontWeight": "600", "padding": "16px"}', 4),
    (new_template_id, 'datawidget', '4.8★', 500, 120, 140, 80, '{"widgetType": "text", "value": "4.8★", "label": "2,847 Reviews", "backgroundColor": "#f5f5f7", "color": "#000000", "borderRadius": "16px", "fontSize": 24, "fontWeight": "600", "padding": "16px"}', 5),
    
    -- Key Features
    (new_template_id, 'heading', 'Key Features', 340, 220, 200, 30, '{"fontSize": 20, "fontWeight": "600", "color": "#000000"}', 6),
    (new_template_id, 'text', '• Active Noise Cancellation\n• Spatial Audio with head tracking\n• 20-hour battery life\n• Premium materials & comfort\n• Seamless device switching', 340, 260, 340, 140, '{"fontSize": 15, "color": "#1d1d1f", "lineHeight": 2, "backgroundColor": "#f5f5f7", "padding": "20px", "borderRadius": "12px"}', 7),
    
    -- Specifications Table
    (new_template_id, 'table', 'Technical Specifications', 40, 420, 320, 160, '{"headers": ["Spec", "Details"], "rows": [["Weight", "384.8 grams"], ["Connectivity", "Bluetooth 5.0"], ["Chip", "Apple H1"], ["Battery", "20 hours ANC"], ["Colors", "5 options"]], "headerBg": "#1d1d1f", "headerColor": "#ffffff", "borderRadius": "12px", "fontSize": 13, "cellPadding": "12px"}', 8),
    
    -- Customer Reviews
    (new_template_id, 'text', '"The best headphones I have ever owned. The sound quality is absolutely incredible." - Sarah M.', 380, 420, 300, 60, '{"fontSize": 14, "color": "#1d1d1f", "fontStyle": "italic", "backgroundColor": "#fef3c7", "padding": "16px", "borderRadius": "12px", "borderLeft": "4px solid #f59e0b"}', 9),
    
    -- Call to Actions
    (new_template_id, 'cta', 'Buy Now', 380, 500, 140, 50, '{"text": "Buy Now", "backgroundColor": "#0071e3", "color": "#ffffff", "borderRadius": "25px", "fontSize": 17, "fontWeight": "600"}', 10),
    (new_template_id, 'cta', 'Learn More', 540, 500, 140, 50, '{"text": "Learn More", "backgroundColor": "#ffffff", "color": "#0071e3", "borderRadius": "25px", "fontSize": 17, "fontWeight": "600", "border": "2px solid #0071e3"}', 11),
    
    -- Embed Video
    (new_template_id, 'embed', 'Product Video', 40, 600, 640, 40, '{"embedType": "text", "src": "Watch the keynote at apple.com/airpods-pro-max", "backgroundColor": "#f5f5f7", "textAlign": "center", "padding": "12px", "borderRadius": "8px", "fontSize": 14, "color": "#0071e3"}', 12);

    -- Template 7: Healthcare Dashboard - Medical Professional Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Patient Care Dashboard', 'Healthcare analytics dashboard voor medical professionals', 'Analytics', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', '🏥 St. Mary Hospital Dashboard', 40, 20, 500, 45, '{"fontSize": 32, "fontWeight": "600", "color": "#0c4a6e", "fontFamily": "Inter, system-ui"}', 1),
    (new_template_id, 'text', 'Real-time patient care metrics and hospital operations', 40, 70, 400, 20, '{"fontSize": 15, "color": "#64748b"}', 2),
    
    -- Critical Metrics
    (new_template_id, 'datawidget', '142', 40, 110, 130, 80, '{"widgetType": "counter", "value": 142, "label": "Current Patients", "backgroundColor": "#0891b2", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28, "fontWeight": "700", "padding": "16px"}', 3),
    (new_template_id, 'datawidget', '89%', 185, 110, 130, 80, '{"widgetType": "percentage", "value": 89, "label": "Bed Occupancy", "backgroundColor": "#16a34a", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28, "fontWeight": "700", "padding": "16px"}', 4),
    (new_template_id, 'datawidget', '12', 330, 110, 130, 80, '{"widgetType": "counter", "value": 12, "label": "Critical Care", "backgroundColor": "#dc2626", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28, "fontWeight": "700", "padding": "16px"}', 5),
    (new_template_id, 'datawidget', '4.2', 475, 110, 130, 80, '{"widgetType": "text", "value": "4.2 hrs", "label": "Avg Wait Time", "backgroundColor": "#ea580c", "color": "#ffffff", "borderRadius": "12px", "fontSize": 28, "fontWeight": "700", "padding": "16px"}', 6),
    
    -- Department Status Table
    (new_template_id, 'table', 'Department Status', 40, 210, 380, 180, '{"headers": ["Department", "Patients", "Staff", "Status"], "rows": [["Emergency", "28", "12", "🔴 High"], ["ICU", "12", "8", "🟡 Moderate"], ["Surgery", "15", "10", "🟢 Normal"], ["Pediatrics", "22", "6", "🟡 Moderate"], ["Maternity", "18", "8", "🟢 Normal"]], "headerBg": "#0c4a6e", "headerColor": "#ffffff", "borderRadius": "12px", "fontSize": 13, "cellPadding": "10px"}', 7),
    
    -- Patient Flow Chart
    (new_template_id, 'chart', 'Patient Admissions', 440, 210, 240, 180, '{"chartType": "line", "title": "24-Hour Patient Flow", "backgroundColor": "#ffffff", "borderRadius": "12px", "padding": "16px", "border": "1px solid #e2e8f0"}', 8),
    
    -- Staff Schedule
    (new_template_id, 'table', 'On-Call Staff', 40, 410, 280, 120, '{"headers": ["Name", "Department", "Shift"], "rows": [["Dr. Smith", "Emergency", "08:00-20:00"], ["Dr. Johnson", "ICU", "20:00-08:00"], ["Nurse Williams", "Surgery", "08:00-16:00"]], "headerBg": "#f1f5f9", "headerColor": "#0c4a6e", "borderRadius": "8px", "fontSize": 12}', 9),
    
    -- AI Medical Assistant
    (new_template_id, 'ai-agent', 'Medical AI Assistant', 340, 410, 340, 120, '{"systemPrompt": "Analyze patient flow and suggest resource optimization", "contentType": "medical", "backgroundColor": "#e0f2fe", "borderRadius": "12px", "padding": "16px", "color": "#0c4a6e", "borderLeft": "4px solid #0891b2"}', 10),
    
    -- Emergency Alert
    (new_template_id, 'text', '⚠️ Alert: Trauma patient arriving in 5 minutes. OR-3 prepared.', 40, 550, 640, 40, '{"fontSize": 16, "color": "#dc2626", "backgroundColor": "#fef2f2", "padding": "12px", "borderRadius": "8px", "fontWeight": "600", "borderLeft": "4px solid #dc2626"}', 11);

    -- Template 8: Social Media Analytics - Instagram/TikTok Theme
    INSERT INTO templates (name, description, category, template_library_id, is_custom, is_hidden)
    VALUES ('Social Media Analytics', 'Trendy social media performance dashboard', 'Marketing', standaard_library_id, false, false)
    RETURNING id INTO new_template_id;

    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (new_template_id, 'heading', '📱 Social Media Hub', 40, 20, 400, 50, '{"fontSize": 38, "fontWeight": "800", "background": "linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)", "backgroundClip": "text", "WebkitBackgroundClip": "text", "color": "transparent"}', 1),
    (new_template_id, 'text', '@yourbrand performance across all platforms', 40, 75, 350, 20, '{"fontSize": 16, "color": "#64748b"}', 2),
    
    -- Platform Metrics
    (new_template_id, 'datawidget', '245K', 40, 110, 120, 90, '{"widgetType": "counter", "value": 245000, "label": "Instagram", "backgroundColor": "linear-gradient(45deg, #833ab4, #fd1d1d)", "color": "#ffffff", "borderRadius": "16px", "fontSize": 24, "fontWeight": "700", "padding": "16px"}', 3),
    (new_template_id, 'datawidget', '182K', 175, 110, 120, 90, '{"widgetType": "counter", "value": 182000, "label": "TikTok", "backgroundColor": "#000000", "color": "#ffffff", "borderRadius": "16px", "fontSize": 24, "fontWeight": "700", "padding": "16px"}', 4),
    (new_template_id, 'datawidget', '89K', 310, 110, 120, 90, '{"widgetType": "counter", "value": 89000, "label": "Twitter", "backgroundColor": "#1da1f2", "color": "#ffffff", "borderRadius": "16px", "fontSize": 24, "fontWeight": "700", "padding": "16px"}', 5),
    (new_template_id, 'datawidget', '124K', 445, 110, 120, 90, '{"widgetType": "counter", "value": 124000, "label": "YouTube", "backgroundColor": "#ff0000", "color": "#ffffff", "borderRadius": "16px", "fontSize": 24, "fontWeight": "700", "padding": "16px"}', 6),
    
    -- Engagement Metrics
    (new_template_id, 'heading', 'This Week Performance', 40, 220, 250, 30, '{"fontSize": 20, "fontWeight": "600", "color": "#1e293b"}', 7),
    (new_template_id, 'datawidget', '5.2M', 40, 260, 100, 70, '{"widgetType": "text", "value": "5.2M", "label": "Reach", "backgroundColor": "#f0f9ff", "color": "#0284c7", "borderRadius": "12px", "fontSize": 20}', 8),
    (new_template_id, 'datawidget', '342K', 150, 260, 100, 70, '{"widgetType": "text", "value": "342K", "label": "Likes", "backgroundColor": "#fef2f2", "color": "#dc2626", "borderRadius": "12px", "fontSize": 20}', 9),
    (new_template_id, 'datawidget', '18.2K', 260, 260, 100, 70, '{"widgetType": "text", "value": "18.2K", "label": "Comments", "backgroundColor": "#f0fdf4", "color": "#16a34a", "borderRadius": "12px", "fontSize": 20}', 10),
    (new_template_id, 'datawidget', '8.9K', 370, 260, 100, 70, '{"widgetType": "text", "value": "8.9K", "label": "Shares", "backgroundColor": "#fefce8", "color": "#ca8a04", "borderRadius": "12px", "fontSize": 20}', 11),
    
    -- Top Posts
    (new_template_id, 'image', 'Top Post 1', 40, 350, 140, 140, '{"src": "/api/placeholder/140/140", "alt": "Top Post", "borderRadius": "12px", "objectFit": "cover"}', 12),
    (new_template_id, 'image', 'Top Post 2', 195, 350, 140, 140, '{"src": "/api/placeholder/140/140", "alt": "Top Post", "borderRadius": "12px", "objectFit": "cover"}', 13),
    (new_template_id, 'image', 'Top Post 3', 350, 350, 140, 140, '{"src": "/api/placeholder/140/140", "alt": "Top Post", "borderRadius": "12px", "objectFit": "cover"}', 14),
    
    -- Engagement Chart
    (new_template_id, 'chart', 'Weekly Engagement', 505, 260, 175, 230, '{"chartType": "bar", "title": "Engagement Rate", "backgroundColor": "#ffffff", "borderRadius": "12px", "padding": "12px", "border": "1px solid #e2e8f0"}', 15),
    
    -- Trending Hashtags
    (new_template_id, 'text', '#trending #viral #brandname #socialmedia #marketing', 40, 505, 450, 30, '{"fontSize": 16, "color": "#3b82f6", "fontWeight": "600", "letterSpacing": "0.5px"}', 16),
    
    -- Schedule Next Post
    (new_template_id, 'cta', '📅 Schedule Post', 510, 505, 170, 45, '{"text": "📅 Schedule Post", "backgroundColor": "linear-gradient(45deg, #833ab4, #fd1d1d)", "color": "#ffffff", "borderRadius": "22px", "fontSize": 16, "fontWeight": "600"}', 17),
    
    -- AI Content Suggestion
    (new_template_id, 'ai-agent', 'AI Content Ideas', 40, 550, 640, 60, '{"systemPrompt": "Generate viral content ideas based on current trends", "contentType": "social", "backgroundColor": "#faf5ff", "borderRadius": "12px", "padding": "16px", "borderLeft": "4px solid #833ab4"}', 18);

END $$;
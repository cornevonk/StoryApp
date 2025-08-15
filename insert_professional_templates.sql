-- ========================================
-- PROFESSIONAL TEMPLATES FOR SUPABASE
-- Copy-paste this entire script into Supabase SQL Editor
-- ========================================

-- Insert 8 professional templates with elements
-- These will be proper Supabase templates that can be moved to libraries

-- Template 1: Executive Dashboard
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) 
VALUES (
  gen_random_uuid(), 
  'Executive Dashboard', 
  'Professioneel dashboard voor executive reporting met KPI widgets',
  'Business', 
  true, 
  false
);

-- Get the template ID for elements
DO $$
DECLARE
    template_id_1 UUID;
BEGIN
    SELECT id INTO template_id_1 FROM templates WHERE name = 'Executive Dashboard' ORDER BY created_at DESC LIMIT 1;
    
    -- Insert elements for Executive Dashboard
    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id_1, 'heading', 'Executive Dashboard Q4 2024', 60, 40, 1080, 80, '{"fontSize": "48px", "fontWeight": "bold", "color": "#1e40af", "textAlign": "left"}', 0),
    (template_id_1, 'datawidget', 'Revenue\n€2.4M\n+12%', 60, 140, 240, 120, '{"backgroundColor": "#3b82f6", "color": "white", "fontSize": "20px", "textAlign": "center", "borderRadius": "12px", "fontWeight": "bold"}', 1),
    (template_id_1, 'datawidget', 'Growth\n47%\n+5%', 340, 140, 240, 120, '{"backgroundColor": "#10b981", "color": "white", "fontSize": "20px", "textAlign": "center", "borderRadius": "12px", "fontWeight": "bold"}', 2),
    (template_id_1, 'datawidget', 'Customers\n1,847\n+23%', 620, 140, 240, 120, '{"backgroundColor": "#f59e0b", "color": "white", "fontSize": "20px", "textAlign": "center", "borderRadius": "12px", "fontWeight": "bold"}', 3),
    (template_id_1, 'datawidget', 'Satisfaction\n94%\n+2%', 900, 140, 240, 120, '{"backgroundColor": "#8b5cf6", "color": "white", "fontSize": "20px", "textAlign": "center", "borderRadius": "12px", "fontWeight": "bold"}', 4),
    (template_id_1, 'chart', 'Monthly Revenue Growth\n\nJan: €180K\nFeb: €195K\nMar: €210K\nApr: €225K\nMay: €240K\nJun: €255K', 60, 300, 520, 300, '{"backgroundColor": "#f8fafc", "border": "2px solid #e2e8f0", "borderRadius": "12px", "fontSize": "16px", "padding": "20px"}', 5),
    (template_id_1, 'chart', 'Customer Acquisition\n\nNew Customers: 156\nRetained: 1,691\nChurn Rate: 3.2%\nLTV: €4,250', 620, 300, 520, 300, '{"backgroundColor": "#f0fdf4", "border": "2px solid #10b981", "borderRadius": "12px", "fontSize": "16px", "padding": "20px"}', 6),
    (template_id_1, 'text', 'Key Achievements: Product launch success, team expansion completed, new market penetration achieved.', 60, 640, 1080, 60, '{"fontSize": "16px", "color": "#374151", "backgroundColor": "#eff6ff", "padding": "20px", "borderRadius": "8px"}', 7);
END $$;

-- Template 2: Project Proposal
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) 
VALUES (
  gen_random_uuid(), 
  'Project Proposal', 
  'Professionele projectvoorstel template met tijdlijn en budget',
  'Business', 
  true, 
  false
);

DO $$
DECLARE
    template_id_2 UUID;
BEGIN
    SELECT id INTO template_id_2 FROM templates WHERE name = 'Project Proposal' ORDER BY created_at DESC LIMIT 1;
    
    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id_2, 'heading', 'Digital Transformation Project', 60, 40, 800, 80, '{"fontSize": "42px", "fontWeight": "bold", "color": "#1f2937"}', 0),
    (template_id_2, 'text', 'Project Timeline: Q1 2025 - Q3 2025', 60, 140, 400, 40, '{"fontSize": "18px", "color": "#6b7280", "fontWeight": "600"}', 1),
    (template_id_2, 'text', 'Projectomschrijving:\n\nDeze digitale transformatie zal onze organisatie moderniseren door implementatie van cloud-native oplossingen, process automation, en data-driven besluitvorming.\n\nDoelstellingen:\n• Efficiency verbeteren met 40%\n• Kosten reduceren met €500K/jaar\n• Customer experience verbeteren\n• Schaalbaarheid voor groei', 60, 200, 520, 300, '{"fontSize": "16px", "color": "#374151", "lineHeight": "1.6"}', 2),
    (template_id_2, 'text', 'Budget Overzicht', 620, 200, 300, 40, '{"fontSize": "20px", "fontWeight": "bold", "color": "#1f2937"}', 3),
    (template_id_2, 'datawidget', 'Development\n€150K', 620, 260, 200, 80, '{"backgroundColor": "#3b82f6", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px"}', 4),
    (template_id_2, 'datawidget', 'Infrastructure\n€75K', 840, 260, 200, 80, '{"backgroundColor": "#10b981", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px"}', 5),
    (template_id_2, 'datawidget', 'Training\n€25K', 620, 360, 200, 80, '{"backgroundColor": "#f59e0b", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px"}', 6),
    (template_id_2, 'datawidget', 'Totaal\n€250K', 840, 360, 200, 80, '{"backgroundColor": "#1f2937", "color": "white", "fontSize": "18px", "textAlign": "center", "borderRadius": "8px", "fontWeight": "bold"}', 7),
    (template_id_2, 'text', 'Team: 8 developers, 2 designers, 1 project manager\nVerwachte ROI: 240% binnen 18 maanden', 60, 540, 1080, 80, '{"fontSize": "16px", "color": "#1f2937", "backgroundColor": "#f3f4f6", "padding": "20px", "borderRadius": "8px"}', 8);
END $$;

-- Template 3: Marketing Campaign
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) 
VALUES (
  gen_random_uuid(), 
  'Marketing Campaign Overview', 
  'Complete marketing campagne overzicht met metrics en doelstellingen',
  'Marketing', 
  true, 
  false
);

DO $$
DECLARE
    template_id_3 UUID;
BEGIN
    SELECT id INTO template_id_3 FROM templates WHERE name = 'Marketing Campaign Overview' ORDER BY created_at DESC LIMIT 1;
    
    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id_3, 'heading', 'Spring Launch Campaign 2025', 60, 40, 800, 80, '{"fontSize": "44px", "fontWeight": "bold", "color": "#dc2626"}', 0),
    (template_id_3, 'text', 'Campaign Periode: Maart - Mei 2025', 60, 140, 400, 40, '{"fontSize": "18px", "color": "#6b7280", "fontWeight": "600"}', 1),
    (template_id_3, 'text', 'Campagne Doelstellingen:\n\n• Brand awareness verhogen met 60%\n• Lead generatie: 2,500 nieuwe leads\n• Conversie rate verbeteren naar 8%\n• Social media engagement +150%\n• Website traffic verdubbelen', 60, 200, 450, 200, '{"fontSize": "16px", "color": "#374151", "lineHeight": "1.8"}', 2),
    (template_id_3, 'text', 'Budget Verdeling', 540, 200, 300, 40, '{"fontSize": "20px", "fontWeight": "bold", "color": "#dc2626"}', 3),
    (template_id_3, 'datawidget', 'Digital Ads\n€45K', 540, 260, 180, 70, '{"backgroundColor": "#dc2626", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px"}', 4),
    (template_id_3, 'datawidget', 'Social Media\n€25K', 740, 260, 180, 70, '{"backgroundColor": "#7c3aed", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px"}', 5),
    (template_id_3, 'datawidget', 'Content\n€15K', 540, 350, 180, 70, '{"backgroundColor": "#059669", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px"}', 6),
    (template_id_3, 'datawidget', 'Events\n€35K', 740, 350, 180, 70, '{"backgroundColor": "#d97706", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px"}', 7),
    (template_id_3, 'chart', 'Expected Results\n\n• Reach: 500K mensen\n• Impressions: 2.5M\n• CTR: 3.2%\n• CPC: €1.20\n• ROAS: 4.5x', 60, 450, 400, 200, '{"backgroundColor": "#fef3c7", "border": "2px solid #f59e0b", "borderRadius": "12px", "fontSize": "16px", "padding": "20px"}', 8),
    (template_id_3, 'text', 'Kanalen: Google Ads, Facebook, Instagram, LinkedIn, YouTube, Email Marketing', 540, 450, 400, 60, '{"fontSize": "16px", "color": "#374151", "backgroundColor": "#f9fafb", "padding": "15px", "borderRadius": "8px"}', 9);
END $$;

-- Template 4: Financial Report
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) 
VALUES (
  gen_random_uuid(), 
  'Quarterly Financial Report', 
  'Kwartaal financieel rapport met grafieken en analyse',
  'Reports', 
  true, 
  false
);

DO $$
DECLARE
    template_id_4 UUID;
BEGIN
    SELECT id INTO template_id_4 FROM templates WHERE name = 'Quarterly Financial Report' ORDER BY created_at DESC LIMIT 1;
    
    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id_4, 'heading', 'Q4 2024 Financial Report', 60, 40, 600, 80, '{"fontSize": "40px", "fontWeight": "bold", "color": "#065f46"}', 0),
    (template_id_4, 'text', 'Reporting Periode: Oktober - December 2024', 60, 140, 500, 40, '{"fontSize": "18px", "color": "#6b7280", "fontWeight": "600"}', 1),
    (template_id_4, 'datawidget', 'Omzet\n€2.4M\n+18%', 60, 200, 200, 100, '{"backgroundColor": "#065f46", "color": "white", "fontSize": "18px", "textAlign": "center", "borderRadius": "10px", "fontWeight": "bold"}', 2),
    (template_id_4, 'datawidget', 'Winst\n€485K\n+25%', 280, 200, 200, 100, '{"backgroundColor": "#047857", "color": "white", "fontSize": "18px", "textAlign": "center", "borderRadius": "10px", "fontWeight": "bold"}', 3),
    (template_id_4, 'datawidget', 'Marge\n20.2%\n+1.8%', 500, 200, 200, 100, '{"backgroundColor": "#059669", "color": "white", "fontSize": "18px", "textAlign": "center", "borderRadius": "10px", "fontWeight": "bold"}', 4),
    (template_id_4, 'datawidget', 'Cash Flow\n€385K\n+12%', 720, 200, 200, 100, '{"backgroundColor": "#10b981", "color": "white", "fontSize": "18px", "textAlign": "center", "borderRadius": "10px", "fontWeight": "bold"}', 5),
    (template_id_4, 'chart', 'Revenue Breakdown\n\nProduct Sales: 65% (€1.56M)\nServices: 25% (€600K)\nSubscriptions: 10% (€240K)\n\nTop Performing Products:\n1. Enterprise Suite: €890K\n2. Professional Tools: €670K\n3. Starter Package: €880K', 60, 340, 450, 280, '{"backgroundColor": "#f0fdf4", "border": "2px solid #10b981", "borderRadius": "12px", "fontSize": "15px", "padding": "20px", "lineHeight": "1.6"}', 6),
    (template_id_4, 'chart', 'Expense Analysis\n\nPersoneel: 45% (€1.08M)\nMarketing: 15% (€360K)\nOperationeel: 12% (€288K)\nR&D: 18% (€432K)\nOverig: 10% (€240K)\n\nTrend: -3% t.o.v. Q3', 540, 340, 450, 280, '{"backgroundColor": "#fef7ff", "border": "2px solid #8b5cf6", "borderRadius": "12px", "fontSize": "15px", "padding": "20px", "lineHeight": "1.6"}', 7),
    (template_id_4, 'text', 'Outlook 2025: Verwachte groei van 22% door marktexpansie en nieuwe productlanceringen.', 60, 650, 930, 60, '{"fontSize": "16px", "color": "#065f46", "backgroundColor": "#d1fae5", "padding": "20px", "borderRadius": "8px", "fontWeight": "600"}', 8);
END $$;

-- Template 5: Team Presentation
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) 
VALUES (
  gen_random_uuid(), 
  'Team Presentation', 
  'Professionele team voorstelling met rollen en prestaties',
  'Business', 
  true, 
  false
);

DO $$
DECLARE
    template_id_5 UUID;
BEGIN
    SELECT id INTO template_id_5 FROM templates WHERE name = 'Team Presentation' ORDER BY created_at DESC LIMIT 1;
    
    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id_5, 'heading', 'Ons Development Team', 60, 40, 600, 80, '{"fontSize": "44px", "fontWeight": "bold", "color": "#1f2937"}', 0),
    (template_id_5, 'text', 'Een team van 12 ervaren professionals', 60, 140, 500, 40, '{"fontSize": "18px", "color": "#6b7280", "fontWeight": "600"}', 1),
    (template_id_5, 'text', 'Team Lead\nSarah Johnson\n8 jaar ervaring', 60, 200, 180, 120, '{"fontSize": "16px", "color": "#374151", "textAlign": "center", "backgroundColor": "#f3f4f6", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 2),
    (template_id_5, 'text', 'Senior Developer\nMike Chen\n6 jaar ervaring', 260, 200, 180, 120, '{"fontSize": "16px", "color": "#374151", "textAlign": "center", "backgroundColor": "#f3f4f6", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 3),
    (template_id_5, 'text', 'UX Designer\nEmma Wilson\n5 jaar ervaring', 460, 200, 180, 120, '{"fontSize": "16px", "color": "#374151", "textAlign": "center", "backgroundColor": "#f3f4f6", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 4),
    (template_id_5, 'text', 'DevOps Engineer\nDavid Kumar\n7 jaar ervaring', 660, 200, 180, 120, '{"fontSize": "16px", "color": "#374151", "textAlign": "center", "backgroundColor": "#f3f4f6", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 5),
    (template_id_5, 'datawidget', 'Projects\nCompleted\n47', 60, 360, 160, 100, '{"backgroundColor": "#3b82f6", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "12px", "fontWeight": "bold"}', 6),
    (template_id_5, 'datawidget', 'Client\nSatisfaction\n96%', 240, 360, 160, 100, '{"backgroundColor": "#10b981", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "12px", "fontWeight": "bold"}', 7),
    (template_id_5, 'datawidget', 'Code Quality\nScore\n9.2/10', 420, 360, 160, 100, '{"backgroundColor": "#f59e0b", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "12px", "fontWeight": "bold"}', 8),
    (template_id_5, 'datawidget', 'Delivery\nOn Time\n94%', 600, 360, 160, 100, '{"backgroundColor": "#8b5cf6", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "12px", "fontWeight": "bold"}', 9),
    (template_id_5, 'text', 'Specialisaties: React, Node.js, Python, AWS, Docker, Kubernetes, MongoDB, PostgreSQL', 60, 500, 700, 60, '{"fontSize": "16px", "color": "#374151", "backgroundColor": "#eff6ff", "padding": "20px", "borderRadius": "8px"}', 10),
    (template_id_5, 'text', 'Recent Projecten:\n• E-commerce Platform (Q4 2024)\n• Mobile App Redesign (Q3 2024)\n• API Integration Suite (Q2 2024)', 60, 590, 400, 120, '{"fontSize": "15px", "color": "#374151", "lineHeight": "1.7"}', 11);
END $$;

-- Template 6: Product Roadmap
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) 
VALUES (
  gen_random_uuid(), 
  'Product Roadmap 2025', 
  'Strategische product roadmap met features en tijdlijnen',
  'Business', 
  true, 
  false
);

DO $$
DECLARE
    template_id_6 UUID;
BEGIN
    SELECT id INTO template_id_6 FROM templates WHERE name = 'Product Roadmap 2025' ORDER BY created_at DESC LIMIT 1;
    
    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id_6, 'heading', 'Product Roadmap 2025', 60, 40, 600, 80, '{"fontSize": "44px", "fontWeight": "bold", "color": "#7c3aed"}', 0),
    (template_id_6, 'text', 'Strategische productontwikkeling voor het komende jaar', 60, 140, 600, 40, '{"fontSize": "18px", "color": "#6b7280", "fontWeight": "600"}', 1),
    (template_id_6, 'text', 'Q1 2025\nCore Features', 60, 200, 200, 60, '{"fontSize": "18px", "color": "#7c3aed", "textAlign": "center", "backgroundColor": "#f3e8ff", "padding": "15px", "borderRadius": "8px", "fontWeight": "bold"}', 2),
    (template_id_6, 'text', '• AI-powered analytics\n• Advanced reporting\n• Mobile optimization\n• Security updates', 60, 280, 200, 120, '{"fontSize": "14px", "color": "#374151", "lineHeight": "1.8", "backgroundColor": "#fafafa", "padding": "15px", "borderRadius": "8px"}', 3),
    (template_id_6, 'text', 'Q2 2025\nIntegrations', 300, 200, 200, 60, '{"fontSize": "18px", "color": "#059669", "textAlign": "center", "backgroundColor": "#d1fae5", "padding": "15px", "borderRadius": "8px", "fontWeight": "bold"}', 4),
    (template_id_6, 'text', '• Third-party APIs\n• Webhook support\n• SSO integration\n• Data export tools', 300, 280, 200, 120, '{"fontSize": "14px", "color": "#374151", "lineHeight": "1.8", "backgroundColor": "#fafafa", "padding": "15px", "borderRadius": "8px"}', 5),
    (template_id_6, 'text', 'Q3 2025\nUser Experience', 540, 200, 200, 60, '{"fontSize": "18px", "color": "#dc2626", "textAlign": "center", "backgroundColor": "#fee2e2", "padding": "15px", "borderRadius": "8px", "fontWeight": "bold"}', 6),
    (template_id_6, 'text', '• UI redesign\n• Dark mode\n• Accessibility\n• Performance boost', 540, 280, 200, 120, '{"fontSize": "14px", "color": "#374151", "lineHeight": "1.8", "backgroundColor": "#fafafa", "padding": "15px", "borderRadius": "8px"}', 7),
    (template_id_6, 'text', 'Q4 2025\nScaling', 780, 200, 200, 60, '{"fontSize": "18px", "color": "#d97706", "textAlign": "center", "backgroundColor": "#fed7aa", "padding": "15px", "borderRadius": "8px", "fontWeight": "bold"}', 8),
    (template_id_6, 'text', '• Enterprise features\n• Advanced permissions\n• Custom workflows\n• Multi-tenant support', 780, 280, 200, 120, '{"fontSize": "14px", "color": "#374151", "lineHeight": "1.8", "backgroundColor": "#fafafa", "padding": "15px", "borderRadius": "8px"}', 9),
    (template_id_6, 'chart', 'Success Metrics\n\n• User Adoption: +150%\n• Feature Usage: +85%\n• Performance: +60%\n• Customer Satisfaction: 95%+\n• Revenue Impact: +35%', 60, 440, 450, 200, '{"backgroundColor": "#f8fafc", "border": "2px solid #7c3aed", "borderRadius": "12px", "fontSize": "16px", "padding": "20px", "lineHeight": "1.6"}', 10),
    (template_id_6, 'text', 'Budget: €1.2M allocated across 4 quarters\nTeam: 15 developers, 3 designers, 2 PMs', 540, 440, 450, 80, '{"fontSize": "16px", "color": "#374151", "backgroundColor": "#f3f4f6", "padding": "20px", "borderRadius": "8px"}', 11);
END $$;

-- Template 7: Training Workshop
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) 
VALUES (
  gen_random_uuid(), 
  'Training Workshop Agenda', 
  'Gestructureerde workshop agenda met tijdslots en activiteiten',
  'Education', 
  true, 
  false
);

DO $$
DECLARE
    template_id_7 UUID;
BEGIN
    SELECT id INTO template_id_7 FROM templates WHERE name = 'Training Workshop Agenda' ORDER BY created_at DESC LIMIT 1;
    
    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id_7, 'heading', 'Digital Skills Workshop', 60, 40, 700, 80, '{"fontSize": "44px", "fontWeight": "bold", "color": "#1d4ed8"}', 0),
    (template_id_7, 'text', 'Datum: 15 Maart 2025 | Locatie: Amsterdam Training Center', 60, 140, 700, 40, '{"fontSize": "18px", "color": "#6b7280", "fontWeight": "600"}', 1),
    (template_id_7, 'text', '09:00 - 09:30\nWelkom & Introductie', 60, 200, 280, 80, '{"fontSize": "16px", "color": "#1d4ed8", "backgroundColor": "#dbeafe", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 2),
    (template_id_7, 'text', '09:30 - 11:00\nModule 1: Digital Fundamentals', 360, 200, 280, 80, '{"fontSize": "16px", "color": "#059669", "backgroundColor": "#d1fae5", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 3),
    (template_id_7, 'text', '11:00 - 11:15\nKoffiepauze', 660, 200, 280, 80, '{"fontSize": "16px", "color": "#d97706", "backgroundColor": "#fed7aa", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 4),
    (template_id_7, 'text', '11:15 - 12:30\nModule 2: Praktische Oefeningen', 60, 300, 280, 80, '{"fontSize": "16px", "color": "#7c3aed", "backgroundColor": "#f3e8ff", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 5),
    (template_id_7, 'text', '12:30 - 13:30\nLunch', 360, 300, 280, 80, '{"fontSize": "16px", "color": "#dc2626", "backgroundColor": "#fee2e2", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 6),
    (template_id_7, 'text', '13:30 - 15:00\nModule 3: Advanced Topics', 660, 300, 280, 80, '{"fontSize": "16px", "color": "#059669", "backgroundColor": "#d1fae5", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 7),
    (template_id_7, 'text', '15:00 - 16:00\nQ&A en Certificering', 60, 400, 280, 80, '{"fontSize": "16px", "color": "#1d4ed8", "backgroundColor": "#dbeafe", "padding": "15px", "borderRadius": "8px", "fontWeight": "600"}', 8),
    (template_id_7, 'datawidget', 'Deelnemers\n24', 360, 400, 140, 80, '{"backgroundColor": "#3b82f6", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px", "fontWeight": "bold"}', 9),
    (template_id_7, 'datawidget', 'Trainers\n3', 520, 400, 140, 80, '{"backgroundColor": "#10b981", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "8px", "fontWeight": "bold"}', 10),
    (template_id_7, 'text', 'Benodigdheden:\n• Laptop/tablet\n• Notitieblok\n• WiFi toegang\n• Workshop materialen (verstrekt)', 60, 520, 300, 120, '{"fontSize": "15px", "color": "#374151", "lineHeight": "1.7", "backgroundColor": "#f9fafb", "padding": "15px", "borderRadius": "8px"}', 11),
    (template_id_7, 'text', 'Leerdoelen:\n• Digital literacy verbeteren\n• Praktische vaardigheden ontwikkelen\n• Certificaat behalen\n• Netwerken met collega''s', 380, 520, 300, 120, '{"fontSize": "15px", "color": "#374151", "lineHeight": "1.7", "backgroundColor": "#f0fdf4", "padding": "15px", "borderRadius": "8px"}', 12),
    (template_id_7, 'text', 'Contact: training@company.com | Tel: 020-1234567', 700, 520, 280, 50, '{"fontSize": "14px", "color": "#6b7280", "backgroundColor": "#f3f4f6", "padding": "15px", "borderRadius": "8px"}', 13);
END $$;

-- Template 8: Analytics Report
INSERT INTO templates (id, name, description, category, is_custom, is_hidden) 
VALUES (
  gen_random_uuid(), 
  'Website Analytics Report', 
  'Uitgebreide website analytics met conversie en traffic data',
  'Analytics', 
  true, 
  false
);

DO $$
DECLARE
    template_id_8 UUID;
BEGIN
    SELECT id INTO template_id_8 FROM templates WHERE name = 'Website Analytics Report' ORDER BY created_at DESC LIMIT 1;
    
    INSERT INTO template_elements (template_id, element_type, content, x, y, width, height, properties, order_index) VALUES
    (template_id_8, 'heading', 'Website Analytics - December 2024', 60, 40, 800, 80, '{"fontSize": "40px", "fontWeight": "bold", "color": "#ea580c"}', 0),
    (template_id_8, 'text', 'Reporting periode: 1-31 December 2024', 60, 140, 500, 40, '{"fontSize": "18px", "color": "#6b7280", "fontWeight": "600"}', 1),
    (template_id_8, 'datawidget', 'Bezoekers\n47,832\n+23%', 60, 200, 180, 100, '{"backgroundColor": "#ea580c", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "10px", "fontWeight": "bold"}', 2),
    (template_id_8, 'datawidget', 'Paginaweergaven\n125,491\n+18%', 260, 200, 180, 100, '{"backgroundColor": "#dc2626", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "10px", "fontWeight": "bold"}', 3),
    (template_id_8, 'datawidget', 'Sessieduur\n3:24 min\n+12%', 460, 200, 180, 100, '{"backgroundColor": "#7c3aed", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "10px", "fontWeight": "bold"}', 4),
    (template_id_8, 'datawidget', 'BounceRate\n34.2%\n-8%', 660, 200, 180, 100, '{"backgroundColor": "#059669", "color": "white", "fontSize": "16px", "textAlign": "center", "borderRadius": "10px", "fontWeight": "bold"}', 5),
    (template_id_8, 'chart', 'Traffic Bronnen\n\nOrganic Search: 42% (20,109)\nDirect: 28% (13,393)\nSocial Media: 18% (8,610)\nReferrals: 8% (3,827)\nPaid Ads: 4% (1,913)\n\nTop Keywords:\n1. "digital solutions" - 2,847\n2. "business tools" - 1,923\n3. "automation software" - 1,456', 60, 340, 400, 280, '{"backgroundColor": "#fff7ed", "border": "2px solid #ea580c", "borderRadius": "12px", "fontSize": "15px", "padding": "20px", "lineHeight": "1.6"}', 6),
    (template_id_8, 'chart', 'Conversie Analyse\n\nTotal Conversions: 1,247\nConversion Rate: 2.6%\nGoal Completions:\n• Newsletter: 542\n• Demo Request: 298\n• Download: 407\n\nTop Converting Pages:\n1. /pricing - 34%\n2. /features - 28%\n3. /demo - 22%', 480, 340, 400, 280, '{"backgroundColor": "#f0fdf4", "border": "2px solid #059669", "borderRadius": "12px", "fontSize": "15px", "padding": "20px", "lineHeight": "1.6"}', 7),
    (template_id_8, 'text', 'Device Breakdown: Desktop 58% | Mobile 35% | Tablet 7%', 60, 650, 420, 50, '{"fontSize": "16px", "color": "#374151", "backgroundColor": "#f3f4f6", "padding": "15px", "borderRadius": "8px"}', 8),
    (template_id_8, 'text', 'Top Countries: Nederland 45%, België 18%, Duitsland 12%, UK 10%', 500, 650, 420, 50, '{"fontSize": "16px", "color": "#374151", "backgroundColor": "#fef7ff", "padding": "15px", "borderRadius": "8px"}', 9);
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Successfully inserted 8 professional templates with elements!';
    RAISE NOTICE '📊 Templates can now be moved to libraries via drag & drop';
    RAISE NOTICE '🎨 Categories: Business (4), Marketing (1), Reports (1), Education (1), Analytics (1)';
END $$;
# 🤖 Complete AI Flows Analyse - Story App

## 📋 Overzicht

De Story App heeft **4 verschillende AI content generatie flows** die samenwerken:

1. **🎨 Template Styling** - Hoe templates hun layout en styling krijgen
2. **📄 Individual Element Content** - Hoe individuele elementen (Magic Button) content krijgen  
3. **🔄 Page Content Fill** - Hoe hele pagina's tegelijk gevuld worden
4. **🏗️ Template Library Generation** - Hoe complete template sets worden gegenereerd

---

## 🎨 1. TEMPLATE STYLING FLOW

### **Hoe styling tot stand komt:**

#### **A. Layout Patterns (Hardcoded)**
```javascript
// src/services/aiTemplateService.js - Regel 9-118
const LAYOUT_PATTERNS = {
  intro: {
    name: 'Introductie Slide',
    elements: [
      { 
        type: 'heading', 
        x: 60, y: 180, width: 1080, height: 120,    // ← STYLING
        fontSize: 64, fontWeight: 'bold', textAlign: 'center',
        color: 'var(--brand-primary)'               // ← CSS VARIABELEN
      }
    ]
  }
}
```

#### **B. Design Principes:**
- **Canvas Size**: 1200x800px (standaard presentatie formaat)
- **Rule of Thirds**: Elementen op 1/3 en 2/3 posities
- **Margins**: 60px vanaf randen voor leesbaarheid  
- **Typography Hierarchy**:
  - Intro headings: 64px (grote impact)
  - Section headings: 48px (structuur)
  - Body text: 18-22px (leesbaarheid)
  - Subtitles: 24px (ondersteunend)

#### **C. Color System:**
```javascript
// Gebruik CSS custom properties uit hoofdthema
backgroundColor: 'var(--brand-primary)'    // Paars
backgroundColor: 'var(--brand-secondary)'  // Blauw  
backgroundColor: 'var(--brand-accent)'     // Accent kleur
color: 'var(--brand-text)'                // Tekst kleur
```

---

## 📄 2. INDIVIDUAL ELEMENT CONTENT FLOW (Magic Button ✨)

### **Locatie**: `src/components/panels/ElementSettings.jsx` - Regel 87-110

### **Proces**:
```
1. User klikt ✨ Magic Button bij tekst/heading element
     ↓
2. handleMagicGeneration() wordt aangeroepen
     ↓
3. Validaties:
   - Is er een project? ✓
   - Is OpenAI beschikbaar? ✓  
   - Is er content in het veld? ✓
     ↓
4. Load knowledge documents voor project
     ↓
5. Call openaiService.generateContent(currentContent, knowledgeDocuments)
     ↓
6. Update element met: { content: generatedContent }
```

### **AI Prompt Structure**:
```javascript
// src/services/openaiService.js - Regel 35
const userPrompt = `Creëer content over: "${prompt}"

Zoek in de kennisdocumenten naar relevante informatie die gerelateerd is aan dit onderwerp. 
Gebruik alle beschikbare informatie, ook als het gedeeltelijk relevant is.`

// System Prompt - Regel 96-111
const systemPrompt = `Je bent een AI content specialist voor de Story App.

BESCHIKBARE KENNISDOCUMENTEN:
${knowledgeContext}

ZOEKSTRATEGIE:
1. Scan alle documentinhoud grondig
2. Zoek naar directe matches, maar ook gerelateerde concepten
3. Combineer informatie uit meerdere bronnen

CONTENT INSTRUCTIES:
- Creëer altijd bruikbare content, ook bij gedeeltelijke matches
- Verhaal-vertellende, professionele stijl
- Beknopt maar informatief (2-4 zinnen)
- Nederlandse taal`
```

### **Token Settings**:
- **Model**: `gpt-4o-mini` 
- **Max Tokens**: 800
- **Temperature**: 0.6
- **Cost**: ~€0.001-0.005 per element

---

## 🔄 3. PAGE CONTENT FILL FLOW (Canvas ✨ Button)

### **Locatie**: `src/components/layout/Canvas.jsx` - Regel 51-162

### **Proces**:
```
1. User selecteert pagina en klikt ✨ button in canvas toolbar
     ↓
2. handleFillPageWithAI() wordt aangeroepen
     ↓
3. Validaties:
   - Is er een active page? ✓
   - Is er een project? ✓
   - Is OpenAI beschikbaar? ✓
     ↓
4. Find current page: pages.find(p => p.id === activePage)
     ↓
5. Check page elements: currentPage.elements 
     ↓
6. Load knowledge documents voor project
     ↓
7. Filter fillable elements:
   - Only text & heading types
   - Ignore image, datawidget, etc.
     ↓
8. Generate context: `Pagina ${index + 1} van ${total}`
     ↓
9. Promise.all - Fill each element parallel:
   - For heading: 'Genereer een pakkende titel voor deze sectie'
   - For text: 'Schrijf informatieve content voor deze sectie (2-4 zinnen)'
     ↓
10. Update each element: updatePageElement(pageId, elementId, {content, aiGenerated: true})
```

### **Element Processing**:
```javascript
// Regel 114-144
const updatedElements = await Promise.all(
  fillableElements.map(async (element) => {
    const generatedContent = await aiTemplateService.generateElementContent(
      {
        ...element,
        aiPrompt: element.element_type === 'heading' 
          ? 'Genereer een pakkende titel voor deze sectie'
          : 'Schrijf informatieve content voor deze sectie (2-4 zinnen)'
      },
      knowledgeDocuments,
      pageContext
    )
    
    updatePageElement(activePage, element.id, { 
      content: generatedContent,
      aiGenerated: true  // ← Marker voor tracking
    })
  })
)
```

---

## 🏗️ 4. TEMPLATE LIBRARY GENERATION FLOW

### **Locatie**: `src/services/aiTemplateService.js` & `src/components/panels/TemplatesTab.jsx`

### **Complete Proces**:

#### **Stap 1: Document Analysis**
```
1. User klikt "🤖 AI Bibliotheek Genereren"
     ↓
2. aiTemplateService.analyzeDocumentsForTemplates(projectId)
     ↓
3. Load alle knowledge documents
     ↓
4. performDocumentAnalysis():
   - Limit elke doc tot 500 chars (cost optimization)
   - Build knowledgeContext string
   - Send to OpenAI met analysis prompt
     ↓
5. AI Response (JSON):
{
  "mainTopics": ["onderwerp1", "onderwerp2"], 
  "slideCount": 6,
  "presentationType": "business|educational|marketing",
  "keyThemes": ["thema1", "thema2"],
  "suggestedFlow": ["intro", "content", "data", "conclusion"]
}
```

#### **Stap 2: Template Structure Generation**
```javascript
// aiTemplateService.js - Regel 208-247
async generateTemplateStructure(analysis, knowledgeDocuments) {
  const { slideCount, suggestedFlow, mainTopics } = analysis
  const templates = []
  
  for (let i = 0; i < Math.min(slideCount, 8); i++) {
    const flowIndex = i % suggestedFlow.length
    const layoutType = suggestedFlow[flowIndex]        // ← "intro", "content", etc
    const pattern = LAYOUT_PATTERNS[layoutType]       // ← Get styling pattern
    
    const template = {
      id: `ai-generated-${Date.now()}-${i}`,
      name: this.generateTemplateName(layoutType, mainTopics[i], i),
      elements: pattern.elements.map((element, idx) => ({
        ...element,                                    // ← Styling komt van LAYOUT_PATTERNS
        id: `element-${i}-${idx}`,
        content: `[AI zal dit vullen: ${element.prompt}]`,
        aiPrompt: element.prompt,                      // ← Voor later vullen
        aiContext: mainTopics[i]
      })),
      aiGenerated: true,
      sourceDocuments: knowledgeDocuments.length,
      layoutType: layoutType
    }
    
    templates.push(template)
  }
  
  return templates
}
```

#### **Stap 3: Database Storage**
```javascript
// TemplatesTab.jsx - Regel 349-378
for (const template of aiAnalysis.templateStructure) {
  await templateService.create({
    ...template,                    // ← Alle styling properties
    template_library_id: library.id,
    project_id: currentProject.id,
    is_custom: true
  })
}
```

---

## 🎯 STYLING BESLISSINGEN

### **Layout Patterns Rationale**:

#### **Intro Pattern**:
```javascript
heading: { x: 60, y: 180, fontSize: 64, textAlign: 'center' }
subtitle: { x: 60, y: 320, fontSize: 24, textAlign: 'center', fontStyle: 'italic' }
```
- **Waarom**: Grote impact, gecentreerd voor aandacht
- **Typography**: 64px = imposant, 24px = ondersteunend
- **Position**: y: 180 = boven center, y: 320 = onder center

#### **Content Pattern**:  
```javascript
heading: { x: 60, y: 40, fontSize: 48 }           // Top-left anchor
text: { x: 60, y: 150, width: 700, fontSize: 18 } // Left column  
image: { x: 800, y: 150, width: 340 }            // Right column
```
- **Waarom**: F-pattern reading flow
- **Layout**: 60/40 split = text emphasis
- **Margins**: 60px = breathing room

#### **Data Showcase Pattern**:
```javascript
datawidget: { 
  x: 620, y: 150, width: 240, height: 140,
  backgroundColor: 'var(--brand-primary)',
  borderRadius: '16px',
  textAlign: 'center'
}
```
- **Waarom**: Visual hierarchy, data prominence
- **Grid**: 240px widgets = consistent sizing
- **Colors**: Brand colors = professional look

---

## 🔄 CONTENT GENERATION DETAILS

### **OpenAI API Calls**:

#### **Template Analysis Call**:
```javascript
// Cost: ~€0.002-0.005 per analysis
model: 'gpt-4o-mini',
max_tokens: 400,           // ← Cost optimization  
temperature: 0.3,          // ← Consistent results
messages: [
  {role: 'system', content: 'Je bent een AI specialist voor presentatie analyse'},
  {role: 'user', content: analysisPrompt}
]
```

#### **Element Content Call**:
```javascript  
// Cost: ~€0.001-0.003 per element
model: 'gpt-4o-mini',
max_tokens: element.type === 'heading' ? 50 : 200,  // ← Dynamic optimization
temperature: 0.5,                                    // ← Creative but controlled
messages: [
  {role: 'system', content: professionalWriterPrompt},
  {role: 'user', content: elementSpecificPrompt}
]
```

---

## 🐛 DEBUGGING TIPS

### **Als styling niet klopt**:
1. Check `LAYOUT_PATTERNS` in `aiTemplateService.js` regel 9-118
2. Verify CSS custom properties in main theme
3. Check canvas rendering in `PageContainer` component

### **Als content niet genereert**:
1. Check browser console voor OpenAI API errors
2. Verify `VITE_OPENAI_API_KEY` in `.env.local`
3. Check knowledge documents zijn geladen
4. Verify element heeft `aiPrompt` property

### **Als templates niet verschijnen**:
1. Check database `templates` table
2. Verify `template_library_id` is set
3. Check `loadTemplates()` function werkt
4. Browser refresh als fallback

---

## 💡 PERFORMANCE OPTIMALISATIES

### **Token Usage**:
- Document analysis: Max 500 chars per doc
- Template generation: Max 400 tokens response  
- Element content: 50-200 tokens based on type
- **Total cost per template set**: ~€0.01-0.02

### **Parallel Processing**:
- Page fill: All elements filled simultaneously  
- Template creation: Sequential (database constraints)
- Knowledge loading: Cached per project

### **Caching Strategy**:
- Knowledge docs cached in memory during session
- Template patterns hardcoded (no API calls)
- Analysis results temporary (not stored)

---

Dit is de complete flow van alle AI functionaliteiten in de Story App! 🚀
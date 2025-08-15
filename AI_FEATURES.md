# 🤖 AI Features - Story App

Deze documentatie beschrijft de AI-functionaliteiten die zijn geïmplementeerd in de Story App.

## 🎯 Overzicht

De Story App heeft twee krachtige AI-features die samenwerken om automatisch presentaties te genereren op basis van kennisdocumenten:

1. **AI Template Library Generator** - Genereert automatisch een complete template bibliotheek
2. **AI Content Filler** - Vult individuele pagina's met relevante content

## 🚀 Feature 1: AI Template Library Generator

### Wat doet het?
- Analyseert alle kennisdocumenten van een project
- Determineert optimale presentatie structuur (aantal slides, volgorde, type)
- Genereert professionele template layouts gebaseerd op best practices
- Creëert een complete bibliotheek met 6-8 templates

### Hoe te gebruiken:
1. Upload kennisdocumenten via "Kennis Documenten" menu
2. Ga naar "Sjablonen" tab
3. Klik op "🤖 AI Bibliotheek Genereren" button
4. AI analyseert je documenten (30-60 seconden)
5. Bekijk preview van gegenereerde templates
6. Klik "Bibliotheek Aanmaken" om te bevestigen

### Template Types:
- **Introductie**: Titel + ondertitel layout
- **Content**: Tekst + afbeelding combinatie  
- **Lijst**: Bullet points en overzichten
- **Data Showcase**: Metrics en KPI widgets
- **Conclusie**: Samenvatting en call-to-action

## 🎨 Feature 2: AI Content Filler

### Wat doet het?
- Scant huidige pagina voor tekst en heading elementen
- Zoekt relevante informatie in kennisdocumenten
- Genereert contextual content per element type
- Vult alle elementen in één keer

### Hoe te gebruiken:
1. Selecteer een pagina met tekst/heading elementen
2. Klik op ✨ button in canvas toolbar
3. AI genereert content voor alle elementen (15-30 seconden)
4. Content wordt automatisch ingevuld

### Content Types:
- **Headings**: Korte, pakkende titels (max 50 karakters)
- **Text**: Informatieve content (2-4 zinnen)
- **Context-aware**: Gebaseerd op pagina positie en bestaande content

## ⚙️ Technische Details

### AI Model & Kosten:
- **Model**: OpenAI GPT-4o-mini (beste prijs/kwaliteit verhouding)
- **Kosten**: ~€0.01-0.02 per template set generatie
- **Token optimalisatie**: 
  - Template generatie: 400 tokens max
  - Content generatie: 50-200 tokens per element
  - Batch processing waar mogelijk

### API Configuratie:
```env
# .env.local
VITE_OPENAI_API_KEY=your_api_key_here
```

### Services:
- `aiTemplateService.js` - Template generatie en content analyse
- `openaiService.js` - Basis OpenAI integratie  
- `knowledgeDocumentService.js` - Document management

## 🔧 Layout Engine

### Presentation Best Practices:
- **Rule of thirds** positionering
- **Visual hierarchy** met consistent typography
- **Whitespace optimalisatie** voor leesbaarheid
- **Responsive layouts** (1200x800 canvas)
- **Color theming** met brand kleuren

### Element Positioning:
```javascript
const LAYOUT_PATTERNS = {
  intro: {
    heading: { x: 60, y: 180, width: 1080, height: 120, fontSize: 64 },
    subtitle: { x: 60, y: 320, width: 1080, height: 80, fontSize: 24 }
  },
  content: {
    heading: { x: 60, y: 40, width: 1080, height: 80, fontSize: 48 },
    text: { x: 60, y: 150, width: 700, height: 400, fontSize: 18 },
    image: { x: 800, y: 150, width: 340, height: 300 }
  }
}
```

## 📋 Workflow

### Complete AI Workflow:
1. **Document Upload** → Kennisdocumenten toevoegen aan project
2. **AI Analysis** → Template bibliotheek genereren
3. **Template Selection** → Gewenste templates kiezen uit bibliotheek
4. **Canvas Placement** → Templates naar canvas slepen  
5. **AI Content Fill** → ✨ button om pagina's te vullen
6. **Manual Refinement** → Content aanpassen waar nodig
7. **Presentation Ready** → Directe presentatie of export

### Error Handling:
- API key validatie
- Document availability checks  
- Element type verification
- Graceful fallbacks bij API failures
- Gebruiksvriendelijke error messages

## 🎯 Use Cases

### Ideaal voor:
- **Business presentaties** gebaseerd op rapporten
- **Educatieve content** uit documentatie
- **Marketing materials** uit product informatie  
- **Project updates** uit status documenten

### Ondersteunde Document Types:
- PDF bestanden (via text extractie)
- Word documenten
- Markdown bestanden
- Plain text bestanden

## 🔮 Toekomstige Uitbreidingen

### Gepland:
- **Bulk template filling** - Hele presentatie tegelijk vullen
- **Smart image suggestions** - AI-powered afbeelding selectie
- **Multi-language support** - Template generatie in verschillende talen
- **Custom prompt templates** - Gebruiker-gedefinieerde AI prompts
- **Advanced analytics** - Presentation effectiveness metrics

---

Deze AI features maken de Story App een krachtige tool voor automatische presentatie generatie, waarbij handmatige content creatie wordt geminimaliseerd terwijl professionele kwaliteit wordt gegarandeerd.
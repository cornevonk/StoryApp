// Mock built-in templates migration
// This will seed the database with the built-in templates during first migration

import { templateService } from './database.js'

export const BUILT_IN_TEMPLATES = [
  {
    name: 'AI-Ready Toekomst Cover',
    description: 'Donkere coverpagina met grote titel en logo',
    category: 'Cover',
    is_custom: false,
    elements: [
      { 
        type: '_page_meta',
        content: JSON.stringify({ backgroundColor: '#1E293B' }),
        x: -100, y: -100, width: 1, height: 1
      },
      { 
        type: 'text', 
        content: 'Bedrijfsnaam', 
        x: 80, y: 60, width: 400, height: 60,
        fontSize: '24px', fontWeight: 'normal', color: '#FFFFFF',
        textAlign: 'left', display: 'flex', alignItems: 'center'
      },
      { 
        type: 'heading', 
        content: 'Bouwen aan een\nAI-ready toekomst', 
        x: 80, y: 300, width: 800, height: 200,
        fontSize: '64px', fontWeight: 'bold', color: '#FFFFFF',
        textAlign: 'left', lineHeight: '1.1', display: 'flex', alignItems: 'center'
      },
      { 
        type: 'text', 
        content: 'Offerte AI PoC', 
        x: 80, y: 520, width: 400, height: 40,
        fontSize: '28px', fontWeight: 'normal', color: '#FFFFFF',
        textAlign: 'left', display: 'flex', alignItems: 'center'
      },
      { 
        type: 'text', 
        content: 'Voorstel versie 1.0\nMei 2025', 
        x: 80, y: 720, width: 300, height: 60,
        fontSize: '16px', fontWeight: 'normal', color: '#CCCCCC',
        textAlign: 'left', display: 'flex', alignItems: 'flex-start', padding: '4px 0'
      }
    ]
  },
  {
    name: 'Introductie Brief',
    description: 'Split-layout met persoonlijke introductie',
    category: 'Content',
    is_custom: false,
    elements: [
      { 
        type: 'heading', 
        content: 'DEPA maakt werk van AI', 
        x: 600, 
        y: 100, 
        width: 500, 
        height: 80,
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#2563EB',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Beste Tobias, Bernadet,', 
        x: 600, 
        y: 200, 
        width: 500, 
        height: 40,
        fontSize: '18px',
        fontWeight: 'normal',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Bedankt voor de geboden kans om mee te denken over het uitwerken van een PoC voor het toepassen van AI-oplossingen binnen uw organisatie.\n\nTijdens ons gesprek hebben we gesproken over hoe generatieve AI jullie interne processen kan versterken.\n\nWe gaan in dit voorstel daar graag dieper op in. We kijken ernaar uit om samen met jullie aan de slag te gaan!', 
        x: 600, 
        y: 260, 
        width: 500, 
        height: 400,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Maurice Taekema & Team CUMLAUDE.AI', 
        x: 600, 
        y: 680, 
        width: 500, 
        height: 40,
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#374151',
        textAlign: 'left'
      }
    ]
  },
  {
    name: 'Kansrijke Ideeën',
    description: 'Bullet point lijst met AI-toepassingen',
    category: 'Content',
    is_custom: false,
    elements: [
      { 
        type: 'heading', 
        content: 'Kansrijke ideeën', 
        x: 60, 
        y: 80, 
        width: 600, 
        height: 80,
        fontSize: '42px',
        fontWeight: 'bold',
        color: '#2563EB',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Binnen uw organisatie is er grote interesse in de inzet van generatieve AI en AI-agents in werkprocessen. Geïdentificeerde use cases:', 
        x: 60, 
        y: 180, 
        width: 600, 
        height: 100,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: '• Algemene efficiëntieslag voor dagelijks werk met AI-agents\n\n• Geautomatiseerd opstellen van documenten en rapporten\n\n• Monitoren van meldingen en incidenten\n\n• Genereren van werkbonnen richting leveranciers\n\n• Historische kennis en data-analyse voor betere besluitvorming', 
        x: 60, 
        y: 300, 
        width: 600, 
        height: 350,
        fontSize: '18px',
        lineHeight: '1.8',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'CUMLAUDE.AI kan hierin faciliteren in zowel het uitdenken en specificeren van deze AI-agents en processen en ook de volledige realisatie hiervan waarmaken.', 
        x: 60, 
        y: 680, 
        width: 600, 
        height: 80,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      }
    ]
  },
  {
    name: 'AI-ready in 2 stappen',
    description: '2-kolom proces overzicht met tijdsindicatie',
    category: 'Process',
    is_custom: false,
    elements: [
      { 
        type: 'heading', 
        content: 'AI-ready in 2 stappen', 
        x: 60, 
        y: 60, 
        width: 800, 
        height: 80,
        fontSize: '42px',
        fontWeight: 'bold',
        color: '#2563EB',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: '16 uur', 
        x: 360, 
        y: 180, 
        width: 100, 
        height: 40,
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#2563EB',
        textAlign: 'center',
        padding: '8px'
      },
      { 
        type: 'heading', 
        content: '1. Strategiesessie', 
        x: 60, 
        y: 240, 
        width: 400, 
        height: 60,
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#1E293B',
        padding: '20px'
      },
      { 
        type: 'text', 
        content: '• Uitgebreide ervaring in de vastgoedsector\n• AI Process Re-engineering toepassen\n• Concrete toepassingen laten zien\n• Use cases identificeren en prioriteren\n• Tenminste twee processen uitwerken', 
        x: 80, 
        y: 320, 
        width: 360, 
        height: 200,
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#FFFFFF',
        backgroundColor: '#1E293B',
        padding: '20px'
      },
      { 
        type: 'text', 
        content: '8 uur', 
        x: 860, 
        y: 180, 
        width: 100, 
        height: 40,
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#2563EB',
        textAlign: 'center',
        padding: '8px'
      },
      { 
        type: 'heading', 
        content: '2. Een concreet rapport', 
        x: 560, 
        y: 240, 
        width: 400, 
        height: 60,
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#1E293B',
        padding: '20px'
      },
      { 
        type: 'text', 
        content: '• Analyseren van elke stap in het proces\n• Plan van aanpak met concrete vervolgstappen\n• Belangrijkste mijlpalen omschreven\n• Deliverables voor implementatie\n• Tijdsinschatting en investeringsindicatie', 
        x: 580, 
        y: 320, 
        width: 360, 
        height: 200,
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#FFFFFF',
        backgroundColor: '#1E293B',
        padding: '20px'
      }
    ]
  },
  {
    name: 'Transformatie 2025',
    description: 'Inspirerende toekomstvisie met groot jaar',
    category: 'Vision',
    is_custom: false,
    elements: [
      { 
        type: 'heading', 
        content: '2025', 
        x: 120, 
        y: 200, 
        width: 400, 
        height: 200,
        fontSize: '120px',
        fontWeight: 'bold',
        color: '#2563EB',
        textAlign: 'left'
      },
      { 
        type: 'heading', 
        content: 'het jaar van\ntransformatie\nnaar co-intelligent\nwerken', 
        x: 550, 
        y: 200, 
        width: 500, 
        height: 240,
        fontSize: '36px',
        fontWeight: '300',
        color: '#FFFFFF',
        textAlign: 'left',
        lineHeight: '1.2'
      },
      { 
        type: 'text', 
        content: 'Samen met jullie brengen we verandering die ertoe doet. Bij CUMLAUDE.AI geloven we in oplossingen die meer opleveren dan alleen efficiëntie. AI-agents nemen routinetaken én complexe vraagstukken uit handen.', 
        x: 120, 
        y: 480, 
        width: 600, 
        height: 120,
        fontSize: '18px',
        lineHeight: '1.6',
        color: '#FFFFFF',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Tijd over, voor menselijke creativiteit en volle focus op de klant.', 
        x: 120, 
        y: 620, 
        width: 600, 
        height: 60,
        fontSize: '18px',
        fontWeight: 'bold',
        lineHeight: '1.6',
        color: '#FFFFFF',
        textAlign: 'left'
      }
    ]
  },
  {
    name: 'Planning & Investering',
    description: 'Prijsoverzicht met duidelijke bedragen',
    category: 'Business',
    is_custom: false,
    elements: [
      { 
        type: 'heading', 
        content: 'Planning & investering', 
        x: 60, 
        y: 80, 
        width: 600, 
        height: 80,
        fontSize: '42px',
        fontWeight: 'bold',
        color: '#2563EB',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'We zouden de strategiesessie medio mei of juni kunnen uitvoeren en in juni de eindresultaten kunnen presenteren.\n\nOns standaard uurtarief is €145.', 
        x: 60, 
        y: 180, 
        width: 600, 
        height: 100,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: '• AI Process Re-engineering sessie, incl. intake en voorbereiding (16 uur):', 
        x: 60, 
        y: 320, 
        width: 500, 
        height: 40,
        fontSize: '16px',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: '€2.320', 
        x: 600, y: 320, width: 100, height: 40,
        fontSize: '16px', fontWeight: 'bold', color: '#2563EB',
        textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
      },
      { 
        type: 'text', 
        content: '• Concreet en beknopt rapport met het nieuwe proces en PvA (8 uur):', 
        x: 60, 
        y: 380, 
        width: 500, 
        height: 40,
        fontSize: '16px',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: '€1.160', 
        x: 600, y: 380, width: 100, height: 40,
        fontSize: '16px', fontWeight: 'bold', color: '#2563EB',
        textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
      },
      { 
        type: 'heading', 
        content: '€3.380', 
        x: 60, 
        y: 480, 
        width: 300, 
        height: 100,
        fontSize: '72px',
        fontWeight: 'bold',
        color: '#2563EB',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Genoemde prijzen zijn exclusief btw en inclusief reiskosten', 
        x: 60, 
        y: 600, 
        width: 600, 
        height: 40,
        fontSize: '14px',
        color: '#6B7280',
        textAlign: 'left'
      }
    ]
  },
  {
    name: 'Het Resultaat',
    description: 'Overzicht van deliverables en vervolgstappen',
    category: 'Results',
    is_custom: false,
    elements: [
      { 
        type: 'heading', 
        content: 'Het resultaat', 
        x: 60, 
        y: 80, 
        width: 600, 
        height: 80,
        fontSize: '42px',
        fontWeight: 'bold',
        color: '#2563EB',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: '1. Uw organisatie wordt geïnspireerd en aangezet tot actie om werk te maken van AI;', 
        x: 60, 
        y: 200, 
        width: 600, 
        height: 60,
        fontSize: '18px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: '2. Uw organisatie heeft een gedetailleerd plan van aanpak in handen voor de toepassing van generatieve AI en AI-agents voor tenminste 2 van hun kernprocessen.', 
        x: 60, 
        y: 280, 
        width: 600, 
        height: 100,
        fontSize: '18px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Deze offerte legt de basis voor een concreet plan van de AI-first strategie binnen uw organisatie en is een fundament om verder op te bouwen.', 
        x: 60, 
        y: 420, 
        width: 600, 
        height: 80,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Vervolg: Hierna volgt de uitvoeringsfase, waarin de implementatie sprintgewijs wordt gerealiseerd.', 
        x: 80, 
        y: 550, 
        width: 560, 
        height: 60,
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#2563EB',
        backgroundColor: '#F3F4F6',
        padding: '20px',
        textAlign: 'left'
      }
    ]
  },
  {
    name: 'Samenwerken',
    description: 'Contractuele informatie en handtekeningen',
    category: 'Contract',
    is_custom: false,
    elements: [
      { 
        type: 'heading', 
        content: 'Samenwerken', 
        x: 60, 
        y: 80, 
        width: 600, 
        height: 80,
        fontSize: '42px',
        fontWeight: 'bold',
        color: '#2563EB',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Wij vertrouwen erop jou hiermee een passend aanbod te doen. Als je akkoord bent met dit aanbod verzoeken wij je één exemplaar getekend aan ons retour te zenden.', 
        x: 60, 
        y: 180, 
        width: 500, 
        height: 100,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Plaats | Datum:', 
        x: 60, 
        y: 320, 
        width: 200, 
        height: 40,
        fontSize: '16px',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Plaats | Datum\nZwolle, 15-05-2025', 
        x: 300, 
        y: 320, 
        width: 200, 
        height: 60,
        fontSize: '16px',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Voor akkoord:\n\nUw Organisatie', 
        x: 60, 
        y: 420, 
        width: 200, 
        height: 100,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Voor akkoord:\n\nCUMLAUDE.AI\nMaurice Taekema', 
        x: 300, 
        y: 420, 
        width: 200, 
        height: 100,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        textAlign: 'left'
      },
      { 
        type: 'text', 
        content: 'Algemene voorwaarden\n\nOp al onze aanbiedingen, aanvaardingen, mededelingen en overeenkomsten zijn algemene voorwaarden van toepassing.\n\nCUMLAUDE.AI maakt hierbij gebruik van de voorwaarden van NLdigital.', 
        x: 600, 
        y: 200, 
        width: 500, 
        height: 200,
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#FFFFFF',
        backgroundColor: '#1E293B',
        padding: '20px',
        textAlign: 'left'
      }
    ]
  }
]

// Enhanced template replacement with comprehensive styling
window.replaceAllTemplatesEnhanced = async function() {
  console.log('🔄 Enhanced template replacement with comprehensive styling...')
  
  try {
    // Delete all existing templates
    const existingTemplates = await templateService.getAll()
    for (const template of existingTemplates) {
      await templateService.delete(template.id)
      console.log(`🗑️ Deleted: ${template.name}`)
    }
    
    // Enhanced templates with all styling capabilities
    const ENHANCED_TEMPLATES = [
      {
        name: 'AI-Ready Toekomst Cover',
        description: 'Donkere coverpagina met grote titel en logo',
        category: 'Cover',
        is_custom: false,
        backgroundColor: '#1E293B',
        elements: [
          { 
            type: 'text', 
            content: 'Bedrijfsnaam', 
            x: 80, y: 60, width: 400, height: 60,
            fontSize: '24px', fontWeight: 'normal', color: '#FFFFFF', 
            textAlign: 'left', display: 'flex', alignItems: 'center'
          },
          { 
            type: 'heading', 
            content: 'Bouwen aan een\nAI-ready toekomst', 
            x: 80, y: 300, width: 800, height: 200,
            fontSize: '64px', fontWeight: 'bold', color: '#FFFFFF', 
            textAlign: 'left', lineHeight: '1.1', display: 'flex', alignItems: 'center'
          },
          { 
            type: 'text', 
            content: 'Offerte AI PoC', 
            x: 80, y: 520, width: 400, height: 40,
            fontSize: '28px', fontWeight: 'normal', color: '#FFFFFF', 
            textAlign: 'left', display: 'flex', alignItems: 'center'
          },
          { 
            type: 'text', 
            content: 'Voorstel versie 1.0\nMei 2025', 
            x: 80, y: 720, width: 300, height: 60,
            fontSize: '16px', fontWeight: 'normal', color: '#CCCCCC', 
            textAlign: 'left', display: 'flex', alignItems: 'flex-start', padding: '4px 0'
          }
        ]
      },
      {
        name: 'Planning & Investering',
        description: 'Prijsoverzicht met duidelijke bedragen',
        category: 'Business',
        is_custom: false,
        backgroundColor: '#FFFFFF',
        elements: [
          { 
            type: 'heading', 
            content: 'Planning & investering', 
            x: 60, y: 80, width: 600, height: 80,
            fontSize: '42px', fontWeight: 'bold', color: '#2563EB', 
            textAlign: 'left', display: 'flex', alignItems: 'center'
          },
          { 
            type: 'text', 
            content: 'We zouden de strategiesessie medio mei of juni kunnen uitvoeren en in juni de eindresultaten kunnen presenteren.\n\nOns standaard uurtarief is €145.', 
            x: 60, y: 180, width: 600, height: 100,
            fontSize: '16px', lineHeight: '1.6', color: '#374151', textAlign: 'left',
            display: 'flex', alignItems: 'flex-start', padding: '8px 0'
          },
          { 
            type: 'text', 
            content: '• AI Process Re-engineering sessie, incl. intake en voorbereiding (16 uur):', 
            x: 60, y: 320, width: 500, height: 40,
            fontSize: '16px', color: '#374151', textAlign: 'left',
            display: 'flex', alignItems: 'center'
          },
          { 
            type: 'text', 
            content: '€2.320', 
            x: 600, y: 320, width: 100, height: 40,
            fontSize: '16px', fontWeight: 'bold', color: '#2563EB', 
            textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
          },
          { 
            type: 'text', 
            content: '• Concreet en beknopt rapport met het nieuwe proces en PvA (8 uur):', 
            x: 60, y: 380, width: 500, height: 40,
            fontSize: '16px', color: '#374151', textAlign: 'left',
            display: 'flex', alignItems: 'center'
          },
          { 
            type: 'text', 
            content: '€1.160', 
            x: 600, y: 380, width: 100, height: 40,
            fontSize: '16px', fontWeight: 'bold', color: '#2563EB', 
            textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
          },
          { 
            type: 'heading', 
            content: '€3.380', 
            x: 60, y: 480, width: 300, height: 100,
            fontSize: '72px', fontWeight: 'bold', color: '#2563EB', 
            textAlign: 'left', display: 'flex', alignItems: 'center'
          },
          { 
            type: 'text', 
            content: 'Genoemde prijzen zijn exclusief btw en inclusief reiskosten', 
            x: 60, y: 600, width: 600, height: 40,
            fontSize: '14px', color: '#6B7280', textAlign: 'left',
            display: 'flex', alignItems: 'center'
          }
        ]
      },
      {
        name: 'AI-ready in 2 stappen',
        description: '2-kolom proces overzicht met tijdsindicatie',
        category: 'Process',
        is_custom: false,
        backgroundColor: '#FFFFFF',
        elements: [
          { 
            type: 'heading', 
            content: 'AI-ready in 2 stappen', 
            x: 60, y: 60, width: 800, height: 80,
            fontSize: '42px', fontWeight: 'bold', color: '#2563EB', 
            textAlign: 'left', display: 'flex', alignItems: 'center'
          },
          {
            type: 'text',
            content: '16 uur',
            x: 360, y: 180, width: 100, height: 40,
            fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF',
            backgroundColor: '#2563EB', textAlign: 'center', 
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          },
          {
            type: 'heading',
            content: '1. Strategiesessie',
            x: 60, y: 240, width: 400, height: 60,
            fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF',
            backgroundColor: '#1E293B', borderRadius: '8px',
            display: 'flex', alignItems: 'center', padding: '0 20px'
          },
          {
            type: 'text',
            content: '• Uitgebreide ervaring in de vastgoedsector\n• AI Process Re-engineering toepassen\n• Concrete toepassingen laten zien\n• Use cases identificeren en prioriteren\n• Tenminste twee processen uitwerken',
            x: 60, y: 310, width: 400, height: 200,
            fontSize: '14px', lineHeight: '1.6', color: '#FFFFFF',
            backgroundColor: '#1E293B', borderRadius: '0 0 8px 8px',
            display: 'flex', alignItems: 'flex-start', padding: '20px'
          },
          {
            type: 'text',
            content: '8 uur',
            x: 860, y: 180, width: 100, height: 40,
            fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF',
            backgroundColor: '#2563EB', textAlign: 'center',
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          },
          {
            type: 'heading',
            content: '2. Een concreet rapport',
            x: 560, y: 240, width: 400, height: 60,
            fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF',
            backgroundColor: '#1E293B', borderRadius: '8px',
            display: 'flex', alignItems: 'center', padding: '0 20px'
          },
          {
            type: 'text',
            content: '• Analyseren van elke stap in het proces\n• Plan van aanpak met concrete vervolgstappen\n• Belangrijkste mijlpalen omschreven\n• Deliverables voor implementatie\n• Tijdsinschatting en investeringsindicatie',
            x: 560, y: 310, width: 400, height: 200,
            fontSize: '14px', lineHeight: '1.6', color: '#FFFFFF',
            backgroundColor: '#1E293B', borderRadius: '0 0 8px 8px',
            display: 'flex', alignItems: 'flex-start', padding: '20px'
          }
        ]
      }
    ]
    
    // Create enhanced templates with workaround for page properties
    for (const templateData of ENHANCED_TEMPLATES) {
      // Add a special metadata element for page properties
      const elementsWithPageMeta = [
        {
          type: '_page_meta',
          content: JSON.stringify({ 
            backgroundColor: templateData.backgroundColor,
            ...templateData.properties 
          }),
          x: -100, y: -100, width: 1, height: 1, // Hidden off-screen
        },
        ...templateData.elements
      ]
      
      const templateToCreate = {
        ...templateData,
        elements: elementsWithPageMeta
      }
      delete templateToCreate.backgroundColor // Remove since we can't store it
      
      await templateService.create(templateToCreate)
      console.log(`✅ Created enhanced: ${templateData.name}`)
    }
    
    console.log('🎉 Enhanced template replacement complete!')
    return { success: true, count: ENHANCED_TEMPLATES.length }
    
  } catch (error) {
    console.error('❌ Error:', error)
    return { success: false, error: error.message }
  }
}

// Function to replace all existing templates with new ones
// Make this function available globally for testing  
window.replaceAllTemplates = async function() {
  console.log('🔄 Replacing all templates with CUMLAUDE.AI designs...')
  
  try {
    // First, get all existing templates
    const existingTemplates = await templateService.getAll()
    console.log(`Found ${existingTemplates.length} existing templates`)
    
    // Delete all existing templates
    for (const template of existingTemplates) {
      try {
        await templateService.delete(template.id)
        console.log(`🗑️ Deleted template: ${template.name}`)
      } catch (error) {
        console.error(`❌ Failed to delete template ${template.name}:`, error)
      }
    }
    
    // Add new CUMLAUDE.AI templates
    for (const templateData of BUILT_IN_TEMPLATES) {
      try {
        await templateService.create(templateData)
        console.log(`✅ Created new template: ${templateData.name}`)
      } catch (error) {
        console.error(`❌ Failed to create template ${templateData.name}:`, error)
      }
    }
    
    console.log('🎉 Successfully replaced all templates with CUMLAUDE.AI designs!')
    return { success: true, count: BUILT_IN_TEMPLATES.length }
  } catch (error) {
    console.error('❌ Failed to replace templates:', error)
    return { success: false, error: error.message }
  }
}

export async function replaceAllTemplates() {
  console.log('🔄 Replacing all templates with CUMLAUDE.AI designs...')
  
  try {
    // First, get all existing templates
    const existingTemplates = await templateService.getAll()
    console.log(`Found ${existingTemplates.length} existing templates`)
    
    // Delete all existing templates
    for (const template of existingTemplates) {
      try {
        await templateService.delete(template.id)
        console.log(`🗑️ Deleted template: ${template.name}`)
      } catch (error) {
        console.error(`❌ Failed to delete template ${template.name}:`, error)
      }
    }
    
    // Add new CUMLAUDE.AI templates
    for (const templateData of BUILT_IN_TEMPLATES) {
      try {
        await templateService.create(templateData)
        console.log(`✅ Created new template: ${templateData.name}`)
      } catch (error) {
        console.error(`❌ Failed to create template ${templateData.name}:`, error)
      }
    }
    
    console.log('🎉 Successfully replaced all templates with CUMLAUDE.AI designs!')
    return { success: true, count: BUILT_IN_TEMPLATES.length }
  } catch (error) {
    console.error('❌ Failed to replace templates:', error)
    return { success: false, error: error.message }
  }
}

// Function to seed built-in templates (legacy function kept for compatibility)
export async function seedBuiltInTemplates() {
  console.log('🌱 Seeding built-in templates...')
  
  for (const templateData of BUILT_IN_TEMPLATES) {
    try {
      await templateService.create(templateData)
      console.log(`✅ Seeded template: ${templateData.name}`)
    } catch (error) {
      console.error(`❌ Failed to seed template ${templateData.name}:`, error)
    }
  }
  
  console.log('🌱 Built-in templates seeded')
}
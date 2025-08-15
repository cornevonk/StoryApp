import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found')
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Premium Cum Laude templates based on CUMLAUDE.AI document
const CUM_LAUDE_TEMPLATES = [
  {
    name: 'AI Consultancy Proposal',
    description: 'Premium consultancy voorstel template met AI focus',
    category: 'Business',
    elements: [
      {
        id: 'bg_meta',
        type: '_page_meta',
        content: JSON.stringify({ backgroundColor: '#0f172a' }),
        x: 0, y: 0, width: 1, height: 1
      },
      {
        id: '1',
        type: 'heading',
        content: 'Bouwen aan een\\nAI-ready toekomst',
        x: 80, y: 120, width: 600, height: 200,
        fontSize: '56px', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.1'
      },
      {
        id: '2',
        type: 'text',
        content: 'Offerte AI PoC',
        x: 80, y: 340, width: 400, height: 50,
        fontSize: '24px', color: '#94a3b8', fontWeight: '500'
      },
      {
        id: '3',
        type: 'text',
        content: 'Voorstel versie 1.0\\nMei 2025',
        x: 80, y: 680, width: 300, height: 80,
        fontSize: '16px', color: '#e2e8f0', lineHeight: '1.5'
      },
      {
        id: '4',
        type: 'text',
        content: 'CUMLAUDE.AI',
        x: 950, y: 720, width: 200, height: 40,
        fontSize: '18px', color: '#3b82f6', fontWeight: 'bold'
      },
      {
        id: '5',
        type: 'image',
        content: 'AI Technology visualization with blue glowing lines and data points',
        x: 700, y: 80, width: 450, height: 600,
        opacity: '0.8'
      }
    ]
  },
  
  {
    name: 'Executive Introduction', 
    description: 'Persoonlijke introductie pagina voor executives',
    category: 'Business',
    elements: [
      {
        id: 'bg_meta',
        type: '_page_meta', 
        content: JSON.stringify({ backgroundColor: '#ffffff' }),
        x: 0, y: 0, width: 1, height: 1
      },
      {
        id: '1',
        type: 'heading',
        content: 'DEPA maakt werk van AI',
        x: 660, y: 80, width: 480, height: 80,
        fontSize: '48px', fontWeight: 'bold', color: '#1e40af'
      },
      {
        id: '2',
        type: 'text',
        content: 'Beste Tobias, Bernadet,',
        x: 660, y: 180, width: 480, height: 40,
        fontSize: '18px', color: '#374151', fontWeight: '600'
      },
      {
        id: '3',
        type: 'text',
        content: 'Bedankt voor de geboden kans om mee te denken over het uitwerken van een PoC voor het toepassen van AI-oplossingen binnen uw organisatie.\\n\\nTijdens ons gesprek hebben we gesproken over hoe generatieve AI jullie interne processen kan versterken. De nieuwsgierigheid naar wat AI kan betekenen voor uw organisatie.',
        x: 660, y: 240, width: 480, height: 200,
        fontSize: '16px', color: '#374151', lineHeight: '1.6'
      },
      {
        id: '4',
        type: 'text',
        content: 'We stellen voor om een Strategiesessie AI Process Re-engineering uit te voeren om in te spelen op de meest kansrijke AI-toepassingen. Daaruit volgt een concreet rapport waarmee we verder kunnen bouwen aan AI-oplossingen voor jullie organisatie.',
        x: 660, y: 460, width: 480, height: 120,
        fontSize: '16px', color: '#374151', lineHeight: '1.6', backgroundColor: '#f0f9ff', 
        padding: '20px', borderRadius: '8px', border: '2px solid #3b82f6'
      },
      {
        id: '5',
        type: 'text',
        content: 'Maurice Taekema & Team CUMLAUDE.AI',
        x: 660, y: 620, width: 480, height: 40,
        fontSize: '16px', color: '#1e40af', fontWeight: '600'
      },
      {
        id: '6',
        type: 'image',
        content: 'Professional team collaboration in modern office environment',
        x: 60, y: 80, width: 540, height: 600,
        borderRadius: '12px'
      }
    ]
  },

  {
    name: 'AI Opportunities Matrix',
    description: 'Kansrijke AI-ideeën en toepassingen overzicht',
    category: 'Analytics', 
    elements: [
      {
        id: 'bg_meta',
        type: '_page_meta',
        content: JSON.stringify({ backgroundColor: '#ffffff' }),
        x: 0, y: 0, width: 1, height: 1
      },
      {
        id: '1',
        type: 'heading',
        content: 'Kansrijke ideeën',
        x: 80, y: 40, width: 500, height: 80,
        fontSize: '48px', fontWeight: 'bold', color: '#1e40af'
      },
      {
        id: '2',
        type: 'text',
        content: 'Binnen uw organisatie is er grote interesse in de inzet van generatieve AI en AI-agents in werkprocessen. U ziet kansen in met name de interne efficiëntieslag die gemaakt kan worden.',
        x: 80, y: 140, width: 500, height: 100,
        fontSize: '16px', color: '#374151', lineHeight: '1.6'
      },
      {
        id: '3',
        type: 'text',
        content: '◆ Algemene efficiëntieslag voor dagelijks werk\\n\\n◆ Geautomatiseerde documentgeneratie\\n\\n◆ Intelligente data-analyse en rapportage\\n\\n◆ AI-gestuurde klantenservice\\n\\n◆ Procesoptimalisatie en workflow automation',
        x: 80, y: 260, width: 500, height: 300,
        fontSize: '16px', color: '#374151', lineHeight: '2.0'
      },
      {
        id: '4',
        type: 'text',
        content: 'CUMLAUDE.AI kan hierin faciliteren in zowel het uitdenken en specificeren van deze AI-agents en processen als ook de volledige realisatie hiervan.',
        x: 80, y: 580, width: 500, height: 80,
        fontSize: '15px', color: '#1e40af', fontWeight: '600', 
        backgroundColor: '#eff6ff', padding: '16px', borderRadius: '8px'
      },
      {
        id: '5',
        type: 'image',
        content: 'Modern professional analyzing AI data visualizations on screens',
        x: 620, y: 80, width: 500, height: 580,
        borderRadius: '12px'
      }
    ]
  },

  {
    name: 'Process Re-engineering',
    description: 'AI Process Re-engineering methodologie visualisatie',
    category: 'Business',
    elements: [
      {
        id: 'bg_meta',
        type: '_page_meta',
        content: JSON.stringify({ backgroundColor: '#ffffff' }),
        x: 0, y: 0, width: 1, height: 1
      },
      {
        id: '1',
        type: 'heading',
        content: 'AI Process Re-engineering',
        x: 80, y: 40, width: 600, height: 80,
        fontSize: '48px', fontWeight: 'bold', color: '#1e40af'
      },
      {
        id: '2',
        type: 'text',
        content: 'We adviseren om een strategiesessie te organiseren. De sessie bestaat uit de volgende onderdelen:',
        x: 80, y: 140, width: 500, height: 60,
        fontSize: '16px', color: '#374151', lineHeight: '1.5'
      },
      {
        id: '3',
        type: 'text',
        content: '◆ We hebben uitgebreide ervaring en we laten concrete toepassingen zien\\n\\n◆ We bieden een werkvorm aan waarbij we een longlist opstellen met AI-kansen\\n\\n◆ Hieruit volgt na de sessie een concreet en beknopt rapport met PvA',
        x: 80, y: 220, width: 500, height: 200,
        fontSize: '16px', color: '#374151', lineHeight: '2.0'
      },
      {
        id: '4',
        type: 'chart',
        content: 'Impact/Complexiteit Matrix\\n\\nHoge Impact, Lage Complexiteit:\\n• Proces A\\n• Proces B\\n\\nHoge Impact, Hoge Complexiteit:\\n• Proces C\\n• Proces D',
        x: 80, y: 450, width: 500, height: 250,
        backgroundColor: '#f8fafc', border: '2px solid #e2e8f0',
        borderRadius: '12px', fontSize: '14px', padding: '20px'
      },
      {
        id: '5',
        type: 'image',
        content: 'Geïdentificeerde kansen en prioritering matrix visualization',
        x: 620, y: 140, width: 500, height: 560,
        borderRadius: '12px'
      }
    ]
  },

  {
    name: 'AI Transformation Vision',
    description: 'Visie op co-intelligent werken en transformatie',
    category: 'Business',
    elements: [
      {
        id: 'bg_meta',
        type: '_page_meta',
        content: JSON.stringify({ backgroundColor: '#0f172a' }),
        x: 0, y: 0, width: 1, height: 1
      },
      {
        id: '1',
        type: 'text',
        content: '2025',
        x: 150, y: 200, width: 400, height: 200,
        fontSize: '120px', fontWeight: 'bold', color: '#3b82f6'
      },
      {
        id: '2',
        type: 'heading',
        content: 'het jaar van\\ntransformatie\\nnaar co-intelligent\\nwerken',
        x: 600, y: 160, width: 500, height: 280,
        fontSize: '48px', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.2'
      },
      {
        id: '3',
        type: 'text',
        content: 'Samen met jullie brengen we verandering die ertoe doet. Bij CUMLAUDE.AI geloven we in oplossingen die meer opleveren dan alleen efficiëntie. AI-agents nemen routinetaken én complexe vraagstukken uit handen.',
        x: 150, y: 480, width: 900, height: 100,
        fontSize: '18px', color: '#e2e8f0', lineHeight: '1.6'
      },
      {
        id: '4',
        type: 'text',
        content: 'Tijd over, voor menselijke creativiteit en volle focus op de klant.',
        x: 150, y: 620, width: 900, height: 60,
        fontSize: '20px', color: '#94a3b8', fontWeight: '600', lineHeight: '1.5'
      },
      {
        id: '5',
        type: 'image',
        content: 'CUMLAUDE.AI logo in modern geometric style',
        x: 150, y: 80, width: 200, height: 80
      }
    ]
  },

  {
    name: 'Implementation Roadmap',
    description: 'AI-ready in 2 stappen implementatie overzicht',
    category: 'Business',
    elements: [
      {
        id: 'bg_meta',
        type: '_page_meta',
        content: JSON.stringify({ backgroundColor: '#ffffff' }),
        x: 0, y: 0, width: 1, height: 1
      },
      {
        id: '1',
        type: 'heading',
        content: 'AI-ready in 2 stappen',
        x: 80, y: 40, width: 600, height: 80,
        fontSize: '48px', fontWeight: 'bold', color: '#1e40af'
      },
      {
        id: '2',
        type: 'datawidget',
        content: '16 uur',
        x: 420, y: 150, width: 100, height: 40,
        backgroundColor: '#1e40af', color: 'white', fontSize: '18px', 
        textAlign: 'center', borderRadius: '6px', fontWeight: 'bold'
      },
      {
        id: '3',
        type: 'text',
        content: '1. Strategiesessie',
        x: 80, y: 200, width: 450, height: 50,
        fontSize: '24px', fontWeight: 'bold', color: '#ffffff',
        backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px'
      },
      {
        id: '4',
        type: 'text',
        content: '◆ Uitgebreide ervaring in de sector\\n◆ Concrete toepassingen laten zien\\n◆ Use cases in kaart brengen\\n◆ Impact/complexiteit matrix\\n◆ Twee processen uitwerken',
        x: 80, y: 270, width: 450, height: 200,
        fontSize: '15px', color: '#374151', lineHeight: '1.8',
        backgroundColor: '#1e293b', color: '#e2e8f0', padding: '20px', borderRadius: '8px'
      },
      {
        id: '5',
        type: 'datawidget',
        content: '8 uur',
        x: 970, y: 150, width: 100, height: 40,
        backgroundColor: '#1e40af', color: 'white', fontSize: '18px',
        textAlign: 'center', borderRadius: '6px', fontWeight: 'bold'
      },
      {
        id: '6',
        type: 'text',
        content: '2. Een concreet rapport',
        x: 580, y: 200, width: 450, height: 50,
        fontSize: '24px', fontWeight: 'bold', color: '#ffffff',
        backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px'
      },
      {
        id: '7',
        type: 'text',
        content: '◆ Elke stap analyseren\\n◆ Plan van aanpak uitwerken\\n◆ Belangrijkste mijlpalen\\n◆ Deliverables bepalen\\n◆ Tijdsinschatting en investering',
        x: 580, y: 270, width: 450, height: 200,
        fontSize: '15px', lineHeight: '1.8',
        backgroundColor: '#1e293b', color: '#e2e8f0', padding: '20px', borderRadius: '8px'
      },
      {
        id: '8',
        type: 'image',
        content: 'Modern building architecture representing transformation',
        x: 80, y: 500, width: 1040, height: 200,
        borderRadius: '12px', opacity: '0.7'
      }
    ]
  },

  {
    name: 'Investment Proposal',
    description: 'Planning & investering overzicht met prijsstructuur',
    category: 'Business',
    elements: [
      {
        id: 'bg_meta',
        type: '_page_meta',
        content: JSON.stringify({ backgroundColor: '#0f172a' }),
        x: 0, y: 0, width: 1, height: 1
      },
      {
        id: '1',
        type: 'heading',
        content: 'Planning & investering',
        x: 80, y: 40, width: 600, height: 80,
        fontSize: '48px', fontWeight: 'bold', color: '#3b82f6'
      },
      {
        id: '2',
        type: 'text',
        content: 'We zouden de strategiesessie medio mei of juni kunnen uitvoeren en in juni de eindresultaten kunnen presenteren.',
        x: 80, y: 140, width: 500, height: 80,
        fontSize: '16px', color: '#e2e8f0', lineHeight: '1.6'
      },
      {
        id: '3',
        type: 'text',
        content: 'Ons standaard uurtarief is €145.',
        x: 80, y: 240, width: 500, height: 40,
        fontSize: '18px', color: '#e2e8f0', fontWeight: '600'
      },
      {
        id: '4',
        type: 'text',
        content: '• AI Process Re-engineering sessie, incl. intake en voorbereiding (16 uur): €2.320\\n\\n• Concreet en beknopt rapport met het nieuwe proces en PvA (8 uur): €1.160',
        x: 80, y: 300, width: 500, height: 120,
        fontSize: '16px', color: '#e2e8f0', lineHeight: '1.8'
      },
      {
        id: '5',
        type: 'datawidget',
        content: '€2.320',
        x: 600, y: 300, width: 120, height: 50,
        backgroundColor: '#3b82f6', color: 'white', fontSize: '20px',
        textAlign: 'center', borderRadius: '8px', fontWeight: 'bold'
      },
      {
        id: '6',
        type: 'datawidget',
        content: '€1.160',
        x: 600, y: 370, width: 120, height: 50,
        backgroundColor: '#3b82f6', color: 'white', fontSize: '20px',
        textAlign: 'center', borderRadius: '8px', fontWeight: 'bold'
      },
      {
        id: '7',
        type: 'datawidget',
        content: '€3.480',
        x: 80, y: 460, width: 200, height: 80,
        backgroundColor: '#3b82f6', color: 'white', fontSize: '36px',
        textAlign: 'center', borderRadius: '12px', fontWeight: 'bold'
      },
      {
        id: '8',
        type: 'text',
        content: 'Genoemde prijzen zijn exclusief btw en inclusief reiskosten',
        x: 80, y: 560, width: 500, height: 40,
        fontSize: '14px', color: '#94a3b8'
      },
      {
        id: '9',
        type: 'image',
        content: 'Modern geometric shapes in blue and white',
        x: 750, y: 200, width: 370, height: 400,
        opacity: '0.6'
      }
    ]
  },

  {
    name: 'Team Presentation',
    description: 'Ons team overzicht met professionele headshots',
    category: 'Business',
    elements: [
      {
        id: 'bg_meta',
        type: '_page_meta',
        content: JSON.stringify({ backgroundColor: '#ffffff' }),
        x: 0, y: 0, width: 1, height: 1
      },
      {
        id: '1',
        type: 'heading',
        content: 'Ons team',
        x: 80, y: 40, width: 400, height: 80,
        fontSize: '48px', fontWeight: 'bold', color: '#1e40af'
      },
      {
        id: '2',
        type: 'text',
        content: 'Ons team is enthousiast om uw organisatie maximaal te laten profiteren van de kracht van generatieve AI.',
        x: 80, y: 140, width: 1040, height: 60,
        fontSize: '18px', color: '#374151', lineHeight: '1.6'
      },
      {
        id: '3',
        type: 'image',
        content: 'Professional headshot - Team member 1',
        x: 80, y: 220, width: 150, height: 150,
        borderRadius: '8px'
      },
      {
        id: '4',
        type: 'image',
        content: 'Professional headshot - Team member 2', 
        x: 260, y: 220, width: 150, height: 150,
        borderRadius: '8px'
      },
      {
        id: '5',
        type: 'image',
        content: 'Professional headshot - Team member 3',
        x: 440, y: 220, width: 150, height: 150,
        borderRadius: '8px'
      },
      {
        id: '6',
        type: 'image',
        content: 'Professional headshot - Team member 4',
        x: 620, y: 220, width: 150, height: 150,
        borderRadius: '8px'
      },
      {
        id: '7',
        type: 'image',
        content: 'Professional headshot - Team member 5',
        x: 800, y: 220, width: 150, height: 150,
        borderRadius: '8px'
      },
      {
        id: '8',
        type: 'image',
        content: 'Professional headshot - Team member 6',
        x: 980, y: 220, width: 150, height: 150,
        borderRadius: '8px'
      },
      {
        id: '9',
        type: 'image',
        content: 'Professional headshot - Team member 7',
        x: 80, y: 400, width: 150, height: 150,
        borderRadius: '8px'
      },
      {
        id: '10',
        type: 'image',
        content: 'Professional headshot - Team member 8',
        x: 260, y: 400, width: 150, height: 150,
        borderRadius: '8px'
      },
      {
        id: '11',
        type: 'text',
        content: 'Ervaring in AI implementatie\\nVastgoedsector expertise\\nStrategische advisering\\nTechnische realisatie',
        x: 500, y: 420, width: 300, height: 160,
        fontSize: '16px', color: '#374151', lineHeight: '2.0',
        backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px'
      },
      {
        id: '12',
        type: 'text',
        content: 'Met bewezen expertise in de vastgoedsector en uitgebreide ervaring in AI-implementaties zijn wij de ideale partner voor uw digitale transformatie.',
        x: 80, y: 580, width: 1040, height: 80,
        fontSize: '16px', color: '#1e40af', fontWeight: '600',
        backgroundColor: '#eff6ff', padding: '20px', borderRadius: '8px'
      }
    ]
  }
]

async function createCumLaudeLibraryAndTemplates() {
  try {
    console.log('🎓 Creating Cum Laude template library...')
    
    // First, create the Cum Laude template library
    const { data: library, error: libraryError } = await supabase
      .from('template_libraries')
      .insert([{
        name: 'Cum Laude',
        description: 'Premium zakelijke sjablonen',
        icon: '🎓',
        is_default: false
      }])
      .select()
      .single()

    if (libraryError) {
      console.error('❌ Error creating template library:', libraryError)
      return
    }

    console.log('✅ Template library created:', library.name)
    
    // Now create each template with its elements
    let templatesCreated = 0
    
    for (const templateData of CUM_LAUDE_TEMPLATES) {
      try {
        console.log(`📝 Creating template: ${templateData.name}`)
        
        // Create the template record
        const { data: template, error: templateError } = await supabase
          .from('templates')
          .insert([{
            name: templateData.name,
            description: templateData.description,
            category: templateData.category,
            template_library_id: library.id,
            is_custom: true,
            is_hidden: false
          }])
          .select()
          .single()

        if (templateError) {
          console.error(`❌ Error creating template ${templateData.name}:`, templateError)
          continue
        }

        // Create template elements
        if (templateData.elements && templateData.elements.length > 0) {
          const elementsData = templateData.elements.map((el, index) => {
            // Separate core properties from styling properties
            const { id, type, content, x, y, width, height, ...properties } = el
            
            return {
              template_id: template.id,
              element_type: type,
              content: content || '',
              x: Math.round((x || 0) * 100) / 100,
              y: Math.round((y || 0) * 100) / 100,
              width: Math.round((width || 250) * 100) / 100,
              height: Math.round((height || 150) * 100) / 100,
              properties: properties,
              order_index: index,
            }
          })

          const { error: elementsError } = await supabase
            .from('template_elements')
            .insert(elementsData)

          if (elementsError) {
            console.error(`❌ Error creating elements for ${templateData.name}:`, elementsError)
            continue
          }
        }
        
        templatesCreated++
        console.log(`✅ Template created: ${templateData.name} (${templateData.elements?.length || 0} elements)`)
        
      } catch (error) {
        console.error(`❌ Error processing template ${templateData.name}:`, error)
        continue
      }
    }
    
    console.log(`🎉 Successfully created ${templatesCreated} Cum Laude templates!`)
    console.log(`📚 All templates added to library: ${library.name}`)
    
  } catch (error) {
    console.error('❌ Fatal error:', error)
  }
}

// Run the script
createCumLaudeLibraryAndTemplates()
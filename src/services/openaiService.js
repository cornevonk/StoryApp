/**
 * OpenAI Service
 * Handles AI content generation using OpenAI API
 */
class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY
    this.baseUrl = 'https://api.openai.com/v1'
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.')
    }
  }

  /**
   * Generate content based on user prompt and knowledge documents
   */
  async generateContent(prompt, knowledgeDocuments) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    try {
      // Prepare knowledge context from documents
      const knowledgeContext = this.prepareKnowledgeContext(knowledgeDocuments)
      
      // Debug logging
      console.log('🔍 Knowledge Documents:', knowledgeDocuments.length)
      console.log('📄 Knowledge Context Preview:', knowledgeContext.substring(0, 500) + '...')
      
      // Create system prompt
      const systemPrompt = this.createSystemPrompt(knowledgeContext)
      
      // Create user prompt with better search instructions
      const userPrompt = `Creëer content over: "${prompt}"\n\nZoek in de kennisdocumenten naar relevante informatie die gerelateerd is aan dit onderwerp. Gebruik alle beschikbare informatie, ook als het gedeeltelijk relevant is. Als er geen directe match is, zoek dan naar gerelateerde concepten, synoniemen of contextuele verbanden.`

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Cost-effective but capable model
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user', 
              content: userPrompt
            }
          ],
          max_tokens: 800,
          temperature: 0.6
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`)
      }

      const data = await response.json()
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated from OpenAI')
      }

      return data.choices[0].message.content.trim()

    } catch (error) {
      console.error('OpenAI Service Error:', error)
      throw error
    }
  }

  /**
   * Prepare knowledge context from documents
   */
  prepareKnowledgeContext(knowledgeDocuments) {
    if (!knowledgeDocuments || knowledgeDocuments.length === 0) {
      return 'Geen kennisdocumenten beschikbaar.'
    }

    return knowledgeDocuments.map(doc => {
      return `=== ${doc.original_name} ===\n${doc.extracted_content || doc.content_preview || 'Geen inhoud beschikbaar'}\n`
    }).join('\n')
  }

  /**
   * Create system prompt for knowledge-based content generation
   */
  createSystemPrompt(knowledgeContext) {
    return `Je bent een AI content specialist voor de Story App. Je taak is het creëren van verhalen en presentatie content op basis van beschikbare kennisdocumenten.

BESCHIKBARE KENNISDOCUMENTEN:
${knowledgeContext}

ZOEKSTRATEGIE:
1. Scan alle documentinhoud grondig, inclusief headers, paragrafen en specifieke termen
2. Zoek naar directe matches, maar ook naar gerelateerde concepten en synoniemen
3. Let op context en samenhang tussen verschillende onderdelen
4. Gebruik gedeeltelijke matches als basis voor bredere content
5. Combineer informatie uit meerdere bronnen indien relevant

CONTENT INSTRUCTIES:
- Creëer altijd bruikbare content, ook bij gedeeltelijke matches
- Gebruik een verhaal-vertellende, professionele stijl
- Houd content beknopt maar informatief (2-4 zinnen)
- Focus op praktische waarde en impact
- Schrijf in het Nederlands

BELANGRIJK: Probeer altijd relevante content te creëren op basis van de beschikbare informatie. Zeg alleen "geen informatie gevonden" als er werkelijk geen enkele relatie bestaat met het gevraagde onderwerp.`
  }

  /**
   * Check if OpenAI service is available
   */
  isAvailable() {
    return !!this.apiKey
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      available: this.isAvailable(),
      model: 'gpt-4o-mini',
      configured: !!this.apiKey
    }
  }
}

export const openaiService = new OpenAIService()
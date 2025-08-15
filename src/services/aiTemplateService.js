/**
 * AI Template Service
 * Handles AI-powered template generation and content analysis
 */
import { openaiService } from './openaiService'
import { knowledgeDocumentService } from './knowledgeDocumentService'

/**
 * AI Template Service - Revolutionary Custom Layout Engine
 * No more hardcoded patterns! AI generates completely custom layouts for each slide.
 */

class AITemplateService {
  
  /**
   * Analyze knowledge documents and generate template structure
   */
  async analyzeDocumentsForTemplates(projectId) {
    try {
      // Load all knowledge documents for the project
      const knowledgeDocuments = await knowledgeDocumentService.getByProject(projectId)
      
      if (knowledgeDocuments.length === 0) {
        throw new Error('Geen kennisdocumenten gevonden voor dit project.')
      }

      // Analyze documents with optimized prompt for cost efficiency
      const analysis = await this.performDocumentAnalysis(knowledgeDocuments)
      
      // Generate template structure based on analysis
      const templateStructure = await this.generateTemplateStructure(analysis, knowledgeDocuments)
      
      return {
        analysis,
        templateStructure,
        documentCount: knowledgeDocuments.length
      }
      
    } catch (error) {
      console.error('AI Template Analysis Error:', error)
      throw error
    }
  }

  /**
   * Create intelligent summary of document content
   */
  async createIntelligentSummary(content, documentName) {
    if (!content || content.length <= 4000) {
      return content // Use full content if under limit
    }

    try {
      // Create smart summary using AI
      const summaryPrompt = `Maak een intelligente samenvatting van dit document voor presentatie doeleinden:

DOCUMENT: ${documentName}

INHOUD:
${content.substring(0, 6000)} ${content.length > 6000 ? '...' : ''}

INSTRUCTIES:
- Behoud alle belangrijke feitelijke informatie
- Focus op hoofdpunten, data, conclusies en kernboodschappen  
- Structureer logisch met koppen/secties indien mogelijk
- Maximaal 4000 karakters
- Nederlandse taal
- Geschikt voor presentatie content generatie`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Je bent een expert in het samenvatten van documenten voor presentaties. Behoud alle belangrijke informatie in een gestructureerde, beknopte vorm.'
            },
            {
              role: 'user',
              content: summaryPrompt
            }
          ],
          max_tokens: 1000, // Enough for 4000 chars summary
          temperature: 0.3   // Consistent, factual summaries
        })
      })

      const data = await response.json()
      const summary = data.choices[0].message.content.trim()
      
      console.log(`📄 Intelligent summary created for ${documentName}: ${summary.length} chars`)
      return summary

    } catch (error) {
      console.error('Error creating intelligent summary:', error)
      // Fallback to truncated content
      return content.substring(0, 4000)
    }
  }
  
  /**
   * Perform document analysis with cost-optimized prompting
   */
  async performDocumentAnalysis(knowledgeDocuments) {
    // Process documents with intelligent summarization
    console.log(`🔍 Processing ${knowledgeDocuments.length} documents for analysis`)
    
    const processedDocs = await Promise.all(
      knowledgeDocuments.map(async (doc) => {
        const fullContent = doc.extracted_content || doc.content_preview || ''
        console.log(`📄 Document ${doc.original_name}: ${fullContent.length} chars`)
        
        const content = await this.createIntelligentSummary(fullContent, doc.original_name)
        console.log(`📝 Summarized ${doc.original_name}: ${content.length} chars`)
        
        return `=== ${doc.original_name} ===\n${content}\n`
      })
    )
    
    const knowledgeContext = processedDocs.join('\n')
    console.log(`📚 Total knowledge context: ${knowledgeContext.length} chars`)
    console.log(`📋 Knowledge preview:`, knowledgeContext.substring(0, 500) + '...')

    const analysisPrompt = `Analyseer deze kennisdocumenten voor presentatie structuur:

${knowledgeContext}

BELANGRIJK: Geef ALLEEN een geldige JSON response, geen extra tekst of uitleg.

JSON format:
{
  "mainTopics": ["onderwerp1", "onderwerp2", "onderwerp3"],
  "slideCount": 6,
  "presentationType": "business|educational|marketing", 
  "keyThemes": ["thema1", "thema2"],
  "suggestedFlow": ["intro", "content", "data", "conclusion"]
}

Antwoord ALLEEN met geldige JSON, begin met { en eindig met }.`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Je bent een AI specialist voor presentatie analyse. BELANGRIJK: Antwoord ALTIJD met geldige JSON zonder extra tekst, uitleg of commentaar. Begin je antwoord met { en eindig met }.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          max_tokens: 400, // Cost optimization
          temperature: 0.3  // More consistent results
        })
      })

      const data = await response.json()
      const analysisText = data.choices[0].message.content.trim()
      console.log(`🤖 AI Analysis Response (${analysisText.length} chars):`, analysisText)
      
      // Parse JSON response with robust extraction
      try {
        // First try direct parsing
        return JSON.parse(analysisText)
      } catch (parseError) {
        // Try to extract JSON from AI response that might have extra text
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0])
            console.log('✅ JSON extracted from AI response:', extractedJson)
            return extractedJson
          } catch (secondParseError) {
            console.warn('Failed to parse extracted JSON, trying fallback analysis')
          }
        }
        
        // Look for specific patterns in the AI response to build analysis
        const topics = this.extractTopicsFromText(analysisText)
        if (topics.length > 0) {
          console.log('📄 Extracted topics from AI text:', topics)
          return {
            mainTopics: topics,
            slideCount: Math.min(topics.length + 2, 8), // Add intro/conclusion
            presentationType: this.detectPresentationType(analysisText),
            keyThemes: topics.slice(0, 3), // First 3 as key themes
            suggestedFlow: this.buildFlowFromTopics(topics)
          }
        }
        
        // Fallback structure if all parsing fails
        console.warn('❌ All JSON parsing failed, using generic fallback analysis')
        return {
          mainTopics: ['Introductie', 'Hoofdcontent', 'Resultaten', 'Conclusie'],
          slideCount: 6,
          presentationType: 'business',
          keyThemes: ['Overzicht', 'Data'],
          suggestedFlow: ['intro', 'content', 'bulletList', 'dataShowcase', 'content', 'conclusion']
        }
      }
      
    } catch (error) {
      console.error('Document analysis error:', error)
      throw new Error('Fout bij het analyseren van kennisdocumenten')
    }
  }

  /**
   * Extract topics from AI text when JSON parsing fails
   */
  extractTopicsFromText(text) {
    const topics = []
    
    // Look for patterns like "hoofdonderwerpen:", "topics:", etc.
    const topicPatterns = [
      /hoofdonderwerpen?[:\s]+([^\n\r]+)/gi,
      /onderwerpen?[:\s]+([^\n\r]+)/gi,
      /topics?[:\s]+([^\n\r]+)/gi,
      /thema'?s?[:\s]+([^\n\r]+)/gi
    ]
    
    for (const pattern of topicPatterns) {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        // Split on common separators and clean up
        const extractedTopics = match[1]
          .split(/[,;]/)
          .map(t => t.trim().replace(/["""]/g, ''))
          .filter(t => t.length > 0 && t.length < 50)
        
        topics.push(...extractedTopics)
      }
    }
    
    return [...new Set(topics)].slice(0, 6) // Remove duplicates, max 6
  }

  /**
   * Detect presentation type from AI text
   */
  detectPresentationType(text) {
    const lower = text.toLowerCase()
    if (lower.includes('marketing') || lower.includes('verkoop')) return 'marketing'
    if (lower.includes('onderwijs') || lower.includes('les')) return 'educational'
    return 'business'
  }

  /**
   * Build flow from extracted topics
   */
  buildFlowFromTopics(topics) {
    const flow = ['intro']
    
    // Map topics to flow types
    topics.forEach(topic => {
      const lower = topic.toLowerCase()
      if (lower.includes('cijfer') || lower.includes('data') || lower.includes('statistiek')) {
        flow.push('dataShowcase')
      } else if (lower.includes('overzicht') || lower.includes('lijst')) {
        flow.push('bulletList')
      } else {
        flow.push('content')
      }
    })
    
    flow.push('conclusion')
    return flow
  }
  
  /**
   * Generate template structure based on analysis using AI-powered custom layouts
   */
  async generateTemplateStructure(analysis, knowledgeDocuments) {
    const { slideCount, mainTopics, keyThemes } = analysis
    const templates = []
    
    console.log(`🎨 Generating ${slideCount} custom AI layouts...`)
    
    // Generate custom layouts for each slide
    for (let i = 0; i < Math.min(slideCount, 50); i++) {
      const slideContext = {
        slideNumber: i + 1,
        totalSlides: slideCount,
        topic: mainTopics[i] || `Slide ${i + 1}`,
        themes: keyThemes,
        isIntro: i === 0,
        isConclusion: i === slideCount - 1,
        knowledgeContext: this.getSlideSpecificContext(knowledgeDocuments, mainTopics[i])
      }
      
      // AI generates completely custom layout for this specific slide
      const customLayout = await this.generateCustomLayout(slideContext)
      
      // Create template with AI-generated layout
      const template = {
        id: `ai-generated-${Date.now()}-${i}`,
        name: customLayout.name,
        description: customLayout.description,
        category: 'AI Custom',
        elements: customLayout.elements.map((element, idx) => ({
          ...element,
          id: `element-${i}-${idx}`,
          content: element.type === 'image' ? '' : `[AI Content: ${element.contentHint}]`,
          color: element.color || '#1F2937',
          aiPrompt: element.contentPrompt,
          aiContext: slideContext.topic,
          aiGenerated: true
        })),
        aiGenerated: true,
        customLayout: true, // Mark as AI-generated custom layout
        sourceDocuments: knowledgeDocuments.length,
        layoutMetadata: customLayout.metadata
      }
      
      templates.push(template)
      console.log(`✅ Custom layout ${i + 1}/${slideCount} generated: ${customLayout.name}`)
    }
    
    return templates
  }

  /**
   * Get slide-specific context from knowledge documents
   */
  getSlideSpecificContext(knowledgeDocuments, topic) {
    if (!topic || !knowledgeDocuments.length) return ''
    
    // Find most relevant content for this slide topic
    return knowledgeDocuments.map(doc => {
      const content = doc.extracted_content || doc.content_preview || ''
      // Get most relevant paragraphs based on topic
      const paragraphs = content.split('\n').filter(p => p.trim().length > 50)
      const relevantParts = paragraphs.filter(p => 
        p.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().split(' ').some(word => p.toLowerCase().includes(word))
      ).slice(0, 3) // Top 3 most relevant paragraphs
      
      return relevantParts.length > 0 ? 
        `${doc.original_name}: ${relevantParts.join(' ')}` : 
        `${doc.original_name}: ${content.substring(0, 500)}`
    }).join('\n\n')
  }

  /**
   * Generate completely custom layout using AI
   */
  async generateCustomLayout(slideContext) {
    try {
      const layoutPrompt = `Design een custom presentatie slide layout voor:

SLIDE CONTEXT:
- Nummer: ${slideContext.slideNumber} van ${slideContext.totalSlides}
- Topic: ${slideContext.topic}
- Type: ${slideContext.isIntro ? 'INTRO SLIDE' : slideContext.isConclusion ? 'CONCLUSIE SLIDE' : 'CONTENT SLIDE'}
- Themes: ${slideContext.themes?.join(', ') || 'Algemeen'}

RELEVANTE CONTENT:
${slideContext.knowledgeContext.substring(0, 2000)}

CANVAS: 1200x800 pixels

ONTWERP INSTRUCTIES:
1. Bepaal welke elementen nodig zijn (heading, text, image, datawidget, etc.)
2. Positioneer elementen optimaal (rule of thirds, visual hierarchy, breathing room)
3. Kies juiste font sizes (16-64px) en styling
4. Zorg voor professionele spacing (60px+ margins)
5. Maak passende content prompts per element

BELANGRIJK: Geef ALLEEN een geldige JSON response, geen extra tekst of uitleg.

JSON format:
{
  "name": "Slide naam",
  "description": "Korte beschrijving van layout",
  "elements": [
    {
      "type": "heading|text|image|datawidget",
      "x": 60, "y": 40, "width": 500, "height": 80,
      "fontSize": 48, "fontWeight": "bold", "textAlign": "left",
      "contentHint": "Wat dit element bevat",
      "contentPrompt": "AI prompt voor content generatie"
    }
  ],
  "metadata": {
    "layoutStyle": "modern|classic|minimal",
    "focusArea": "text|visual|data",
    "complexity": "simple|medium|complex"
  }
}

Antwoord ALLEEN met geldige JSON, begin met { en eindig met }.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Je bent een expert UI/UX designer voor presentaties. BELANGRIJK: Antwoord ALTIJD met geldige JSON zonder extra tekst, uitleg of commentaar. Begin je antwoord met { en eindig met }.'
            },
            {
              role: 'user',
              content: layoutPrompt
            }
          ],
          max_tokens: 1500, // Enough for complex layouts
          temperature: 0.4   // Creative but structured
        })
      })

      const data = await response.json()
      const layoutText = data.choices[0].message.content.trim()
      
      try {
        // First try direct parsing
        const customLayout = JSON.parse(layoutText)
        console.log(`🎨 AI generated custom layout: ${customLayout.name}`)
        return customLayout
      } catch (parseError) {
        // Try to extract JSON from AI response
        const jsonMatch = layoutText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const extractedLayout = JSON.parse(jsonMatch[0])
            console.log(`✅ Layout JSON extracted from AI response: ${extractedLayout.name}`)
            return extractedLayout
          } catch (secondParseError) {
            console.warn('Failed to parse extracted layout JSON, using fallback')
          }
        }
        
        console.warn('❌ All layout JSON parsing failed, using fallback')
        return this.createFallbackLayout(slideContext)
      }

    } catch (error) {
      console.error('Error generating custom layout:', error)
      return this.createFallbackLayout(slideContext)
    }
  }

  /**
   * Fallback layout when AI generation fails
   */
  createFallbackLayout(slideContext) {
    const { topic, isIntro, isConclusion } = slideContext
    
    if (isIntro) {
      return {
        name: `${topic} - Intro`,
        description: 'Introductie slide met titel en ondertitel',
        elements: [
          {
            type: 'heading',
            x: 60, y: 200, width: 1080, height: 120,
            fontSize: 56, fontWeight: 'bold', textAlign: 'center',
            contentHint: 'Hoofdtitel',
            contentPrompt: 'Maak een pakkende hoofdtitel voor deze presentatie'
          },
          {
            type: 'text',
            x: 60, y: 340, width: 1080, height: 80,
            fontSize: 24, textAlign: 'center', fontStyle: 'italic',
            contentHint: 'Ondertitel',
            contentPrompt: 'Schrijf een korte, krachtige ondertitel'
          }
        ],
        metadata: { layoutStyle: 'classic', focusArea: 'text', complexity: 'simple' }
      }
    }
    
    return {
      name: `${topic} - Content`,
      description: 'Standaard content slide',
      elements: [
        {
          type: 'heading',
          x: 60, y: 40, width: 1080, height: 80,
          fontSize: 42, fontWeight: 'bold',
          contentHint: 'Sectie titel',
          contentPrompt: 'Maak een beschrijvende titel voor deze sectie'
        },
        {
          type: 'text',
          x: 60, y: 150, width: 1080, height: 400,
          fontSize: 18, lineHeight: 1.6,
          contentHint: 'Hoofdcontent',
          contentPrompt: 'Schrijf informatieve content voor deze sectie'
        }
      ],
      metadata: { layoutStyle: 'minimal', focusArea: 'text', complexity: 'simple' }
    }
  }
  
  /**
   * Generate contextual template names
   */
  generateTemplateName(layoutType, topic, index) {
    const namePatterns = {
      intro: `${topic} - Introductie`,
      content: `${topic} - Inhoud`,
      bulletList: `${topic} - Overzicht`,
      dataShowcase: `${topic} - Cijfers & Data`,
      conclusion: `${topic} - Conclusie`
    }
    
    return namePatterns[layoutType] || `${topic} - Slide ${index + 1}`
  }
  
  /**
   * Advanced content-to-layout mapping - generates content perfectly matched to layout
   */
  async generateElementContent(element, knowledgeDocuments, context, layoutMetadata = {}) {
    if (!element.aiPrompt && !element.contentPrompt) return element.content
    
    try {
      // Create intelligent knowledge mapping for this specific element
      const relevantKnowledge = await this.mapKnowledgeToElement(
        element, 
        knowledgeDocuments, 
        context, 
        layoutMetadata
      )

      // Generate content using advanced contextual prompting
      const advancedPrompt = this.createAdvancedContentPrompt(
        element, 
        relevantKnowledge, 
        context, 
        layoutMetadata
      )

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: this.createAdvancedSystemPrompt(element, layoutMetadata)
            },
            {
              role: 'user',
              content: advancedPrompt
            }
          ],
          max_tokens: this.calculateOptimalTokens(element),
          temperature: this.calculateOptimalTemperature(element)
        })
      })

      const data = await response.json()
      const content = data.choices[0].message.content.trim()
      
      console.log(`✨ Advanced content generated for ${element.type}: ${content.length} chars`)
      return content
      
    } catch (error) {
      console.error('Advanced content generation error:', error)
      return element.content || element.contentHint || 'Content placeholder'
    }
  }

  /**
   * Map knowledge documents to specific element requirements
   */
  async mapKnowledgeToElement(element, knowledgeDocuments, context, layoutMetadata) {
    const { type, contentPrompt, contentHint } = element
    const { focusArea, complexity } = layoutMetadata

    // Determine what kind of content this element needs
    const contentRequirements = this.analyzeElementRequirements(element, layoutMetadata)
    
    // Find most relevant knowledge for this specific element
    const relevantParts = knowledgeDocuments.map(doc => {
      const content = doc.extracted_content || doc.content_preview || ''
      
      // Smart content filtering based on element requirements
      if (contentRequirements.needsData && type === 'datawidget') {
        // Extract numerical data, percentages, metrics
        const dataMatches = content.match(/(\d+%|\d+\.\d+|\$\d+|\d+\s?(miljoen|duizend|procent|euro))/gi) || []
        return { 
          name: doc.original_name, 
          content: dataMatches.slice(0, 5).join(', '),
          context: content.substring(0, 500)
        }
      } else if (contentRequirements.needsSummary && type === 'heading') {
        // Extract key topics and main themes
        const sentences = content.split('.').filter(s => s.trim().length > 20)
        const keyTopics = sentences.slice(0, 3).join('. ')
        return { 
          name: doc.original_name, 
          content: keyTopics,
          context: ''
        }
      } else {
        // Extract content relevant to the specific context/topic
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 100)
        const relevantParagraphs = paragraphs.filter(p => {
          const contextWords = context.toLowerCase().split(' ')
          return contextWords.some(word => word.length > 3 && p.toLowerCase().includes(word))
        }).slice(0, 2)
        
        return {
          name: doc.original_name,
          content: relevantParagraphs.join('\n\n') || paragraphs[0] || content.substring(0, 1000),
          context: context
        }
      }
    }).filter(item => item.content.length > 0)

    return relevantParts
  }

  /**
   * Analyze what kind of content this element needs
   */
  analyzeElementRequirements(element, layoutMetadata) {
    const { type, width, height, fontSize } = element
    const { focusArea, complexity } = layoutMetadata

    return {
      needsData: type === 'datawidget' || focusArea === 'data',
      needsSummary: type === 'heading' || fontSize > 40,
      needsDetail: type === 'text' && height > 200,
      needsConcise: width < 400 || complexity === 'simple',
      needsVisual: focusArea === 'visual',
      isImportant: fontSize > 30 || type === 'heading'
    }
  }

  /**
   * Create advanced content prompt based on element and layout analysis
   */
  createAdvancedContentPrompt(element, relevantKnowledge, context, layoutMetadata) {
    const requirements = this.analyzeElementRequirements(element, layoutMetadata)
    const { type, width, height, fontSize } = element

    let prompt = `ELEMENT CONTEXT:
- Type: ${type}
- Afmetingen: ${width}x${height}px  
- Font Size: ${fontSize}px
- Layout Focus: ${layoutMetadata.focusArea || 'algemeen'}
- Complexiteit: ${layoutMetadata.complexity || 'medium'}

SLIDE CONTEXT: ${context}

RELEVANTE KENNIS:
${relevantKnowledge.map(item => `${item.name}: ${item.content}`).join('\n\n')}

CONTENT OPDRACHT: ${element.contentPrompt || element.aiPrompt || 'Genereer passende content'}

SPECIFIEKE REQUIREMENTS:`

    if (requirements.needsData) {
      prompt += `\n- Focus op cijfers, percentages, metrics en harde data`
    }
    if (requirements.needsSummary) {
      prompt += `\n- Maak een krachtige samenvatting van kernpunten`
    }
    if (requirements.needsDetail) {
      prompt += `\n- Geef uitgebreide, informatieve content met details`
    }
    if (requirements.needsConcise) {
      prompt += `\n- Houd het beknopt en to-the-point`
    }
    if (requirements.isImportant) {
      prompt += `\n- Dit is een belangrijk element - maak het impactvol`
    }

    return prompt
  }

  /**
   * Create advanced system prompt based on element characteristics
   */
  createAdvancedSystemPrompt(element, layoutMetadata) {
    const { type } = element
    const { layoutStyle, focusArea } = layoutMetadata

    let basePrompt = `Je bent een AI content specialist voor de Story App met expertise in ${focusArea} content.`

    if (type === 'heading') {
      basePrompt += ` Je creëert krachtige, pakkende titels die de essentie van de content vastleggen.`
    } else if (type === 'text') {
      basePrompt += ` Je schrijft heldere, informatieve tekst die perfect past bij de layout en het publiek.`
    } else if (type === 'datawidget') {
      basePrompt += ` Je presenteert data en cijfers op een visueel aantrekkelijke en begrijpelijke manier.`
    }

    basePrompt += `\n\nSTIJL: ${layoutStyle || 'professioneel'} presentatiestijl
FOCUS: ${focusArea || 'balanced'} approach
TAAL: Nederlands
DOEL: Maximale impact en begrijpelijkheid voor het publiek`

    return basePrompt
  }

  /**
   * Calculate optimal token limit based on element characteristics
   */
  calculateOptimalTokens(element) {
    const { type, width, height, fontSize } = element

    if (type === 'heading') {
      return fontSize > 50 ? 30 : 60  // Larger headings = shorter
    } else if (type === 'datawidget') {
      return 40  // Data widgets are concise
    } else if (type === 'text') {
      // Calculate based on visual space
      const area = width * height
      if (area < 50000) return 100      // Small text area
      if (area < 200000) return 300     // Medium text area  
      return 600                        // Large text area
    }
    
    return 200  // Default
  }

  /**
   * Calculate optimal temperature based on element type
   */
  calculateOptimalTemperature(element) {
    const { type } = element

    if (type === 'heading') return 0.7    // Creative for titles
    if (type === 'datawidget') return 0.2 // Factual for data
    if (type === 'text') return 0.5       // Balanced for content
    
    return 0.5  // Default
  }
  
  /**
   * Check if AI service is available
   */
  isAvailable() {
    return openaiService.isAvailable()
  }
}

export const aiTemplateService = new AITemplateService()
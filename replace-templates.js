// Node.js script for template replacement
// Usage: node replace-templates.js
// Note: This requires proper environment setup for Supabase

import dotenv from 'dotenv'
dotenv.config()

// For Node.js context, we need to set up the environment differently
process.env.VITE_SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
process.env.VITE_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

// Create a minimal import.meta.env polyfill for Node.js
global.import = global.import || {}
global.import.meta = global.import.meta || {}
global.import.meta.env = process.env

import { replaceAllTemplates } from './src/services/mockData.js'

// Run the template replacement
async function runReplacement() {
  console.log('🚀 Starting template replacement...')
  
  try {
    const result = await replaceAllTemplates()
    
    if (result.success) {
      console.log(`✅ Successfully replaced templates! Created ${result.count} new CUMLAUDE.AI templates.`)
    } else {
      console.error(`❌ Template replacement failed: ${result.error}`)
    }
    
    process.exit(result.success ? 0 : 1)
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

// Only run if this script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runReplacement().catch(console.error)
}
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file contains:\n' +
    'VITE_SUPABASE_URL=your_supabase_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_anon_key'
  )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database table names
export const TABLES = {
  PROJECTS: 'projects',
  PAGES: 'pages', 
  ELEMENTS: 'elements',
  TEMPLATES: 'templates',
  TEMPLATE_ELEMENTS: 'template_elements',
  TEMPLATE_LIBRARIES: 'template_libraries',
  SYSTEM_ASSETS: 'system_assets',
  USER_ASSETS: 'user_assets',
}

// Storage bucket names
export const BUCKETS = {
  SYSTEM_ASSETS: 'system-assets',           // Public - template afbeeldingen
  USER_ASSETS: 'user-assets',               // Private - user uploads tijdens bewerking
  PUBLISHED_PRESENTATIONS: 'published-presentations', // Public - gedeelde presentaties
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, operation = 'database operation') => {
  if (error) {
    console.error(`Supabase ${operation} error:`, error)
    throw new Error(`Failed ${operation}: ${error.message}`)
  }
}

export default supabase
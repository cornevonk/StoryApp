// Simple test script to verify Supabase connection
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env file
dotenv.config()

// Get credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
  console.log('🔗 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      console.error('Error details:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    
    // Test templates table
    console.log('📋 Testing templates table...')
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*')
      .limit(5)
    
    if (templatesError) {
      console.error('❌ Templates query failed:', templatesError)
    } else {
      console.log(`✅ Found ${templates.length} templates`)
    }
    
    return true
  } catch (error) {
    console.error('❌ Test failed:', error)
    return false
  }
}

testSupabaseConnection()
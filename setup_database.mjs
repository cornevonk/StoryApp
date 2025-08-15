import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'

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

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database schema for template libraries...')
    
    // Read the SQL file
    const sql = readFileSync('./setup_template_libraries.sql', 'utf8')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      console.error('❌ Error executing SQL:', error)
      
      // Try alternative approach - execute statements individually
      console.log('🔄 Trying alternative approach...')
      
      // Create template_libraries table
      const { error: createError } = await supabase.rpc('exec_sql', { 
        sql_query: `
          CREATE TABLE IF NOT EXISTS template_libraries (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              description TEXT DEFAULT '',
              icon VARCHAR(10) DEFAULT '📁',
              is_default BOOLEAN DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
      
      if (createError) {
        console.error('❌ Error creating template_libraries table:', createError)
        return
      }
      
      console.log('✅ Created template_libraries table')
      
      // Add template_library_id column to templates
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql_query: `
          DO $$ 
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                            WHERE table_name = 'templates' AND column_name = 'template_library_id') THEN
                  ALTER TABLE templates ADD COLUMN template_library_id UUID REFERENCES template_libraries(id) ON DELETE SET NULL;
              END IF;
          END $$;
        `
      })
      
      if (alterError) {
        console.log('⚠️  Could not add template_library_id column (might already exist):', alterError.message)
      } else {
        console.log('✅ Added template_library_id column to templates table')
      }
      
      // Create index
      const { error: indexError } = await supabase.rpc('exec_sql', {
        sql_query: `CREATE INDEX IF NOT EXISTS idx_templates_template_library_id ON templates(template_library_id);`
      })
      
      if (indexError) {
        console.log('⚠️  Could not create index:', indexError.message)
      } else {
        console.log('✅ Created index on template_library_id')
      }
      
    } else {
      console.log('✅ Database schema setup completed successfully')
    }
    
    // Insert default "Standaard" library using direct insert
    console.log('📁 Creating default "Standaard" library...')
    const { data: existingLibrary } = await supabase
      .from('template_libraries')
      .select('id')
      .eq('name', 'Standaard')
      .single()
    
    if (!existingLibrary) {
      const { data: standardLibrary, error: insertError } = await supabase
        .from('template_libraries')
        .insert([{
          name: 'Standaard',
          description: 'Standaard sjablonen',
          icon: '📁',
          is_default: true
        }])
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Error creating Standaard library:', insertError)
        return
      }
      
      console.log('✅ Created "Standaard" library:', standardLibrary.name)
      
      // Update existing templates to belong to Standaard library
      const { error: updateError } = await supabase
        .from('templates')
        .update({ template_library_id: standardLibrary.id })
        .is('template_library_id', null)
      
      if (updateError) {
        console.log('⚠️  Could not update existing templates:', updateError.message)
      } else {
        console.log('✅ Updated existing templates to belong to Standaard library')
      }
    } else {
      console.log('✅ "Standaard" library already exists')
    }
    
    console.log('🎉 Database setup completed!')
    
  } catch (error) {
    console.error('❌ Fatal error:', error)
  }
}

// Run the setup
setupDatabase()
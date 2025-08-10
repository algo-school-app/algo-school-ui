import { createClient } from '@supabase/supabase-js'
import { configService } from './configService.js'

// Create Supabase client with dynamic configuration
function createSupabaseClient() {
  const config = configService.getConfig()
  const supabaseUrl = config.supabase_url
  const supabaseAnonKey = config.supabase_public_key

  console.log('Creating Supabase client with:', {
    url: supabaseUrl,
    key: supabaseAnonKey.substring(0, 10) + '...'
  })

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Export the Supabase client
// This will be initialized after config is loaded
export let supabase

// Initialize Supabase client (called after config is loaded)
export function initializeSupabase() {
  if (!configService.isConfigLoaded()) {
    throw new Error('Cannot initialize Supabase: Configuration not loaded')
  }
  
  supabase = createSupabaseClient()
  console.log('Supabase client initialized successfully')
  
  return supabase
} 
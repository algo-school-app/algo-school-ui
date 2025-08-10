/**
 * Dynamic Configuration Service
 * Fetches application configuration from VITE_INFO_URL
 * Replaces hardcoded environment variables with dynamic values
 */
class ConfigService {
  constructor() {
    this.config = null
    this.isLoaded = false
  }

  /**
   * Fetch configuration from the info endpoint
   * Throws exception on any failure - no fallbacks
   */
  async fetchConfig() {
    const infoUrl = import.meta.env.VITE_INFO_URL
    
    if (!infoUrl) {
      throw new Error('VITE_INFO_URL environment variable is required')
    }

    console.log('Fetching configuration from:', infoUrl)

    const response = await fetch(infoUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch configuration: ${response.status} ${response.statusText}`)
    }

    const config = await response.json()
    
    // Validate required fields
    if (!config.server_url) {
      throw new Error('Configuration missing required field: server_url')
    }
    
    if (!config.supabase_url) {
      throw new Error('Configuration missing required field: supabase_url')
    }
    
    if (!config.supabase_public_key) {
      throw new Error('Configuration missing required field: supabase_public_key')
    }

    if (!config.public_name) {
      throw new Error('Configuration missing required field: public_name')
    }

    if (!config.legal_name) {
      throw new Error('Configuration missing required field: legal_name')
    }

    this.config = config
    this.isLoaded = true
    
    console.log('Configuration loaded successfully:', {
      public_name: config.public_name,
      legal_name: config.legal_name,
      server_url: config.server_url,
      supabase_url: config.supabase_url
    })

    return config
  }

  /**
   * Get the current configuration
   * Throws if config hasn't been loaded yet
   */
  getConfig() {
    if (!this.isLoaded || !this.config) {
      throw new Error('Configuration not loaded. Call fetchConfig() first.')
    }
    
    return this.config
  }

  /**
   * Get server URL for agent API calls
   */
  getServerUrl() {
    return this.getConfig().server_url
  }

  /**
   * Get Supabase URL
   */
  getSupabaseUrl() {
    return this.getConfig().supabase_url
  }

  /**
   * Get Supabase public key
   */
  getSupabasePublicKey() {
    return this.getConfig().supabase_public_key
  }

  /**
   * Get public name for branding
   */
  getPublicName() {
    return this.getConfig().public_name
  }

  /**
   * Get legal name for branding
   */
  getLegalName() {
    return this.getConfig().legal_name
  }

  /**
   * Check if configuration is loaded
   */
  isConfigLoaded() {
    return this.isLoaded
  }
}

// Export singleton instance
export const configService = new ConfigService()

// Also export the class for testing
export { ConfigService }
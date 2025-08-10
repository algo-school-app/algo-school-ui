import { supabase } from './supabase.js'
import { configService } from './configService.js'

/**
 * Unified service for all agent-related API operations
 * Handles both AI chat and agent management (CRUD) operations
 */
class AgentAPIService {
  constructor() {
    // Initialize with null - will be set lazily when first accessed
    this.baseUrl = null
    this.chatPath = import.meta.env.VITE_CHAT_AGENT_PATH || '/chat'
    this.clientId = 'mcgp-school-2025-07' // This could be made configurable
  }

  /**
   * Lazy initialization of baseUrl from config service
   */
  getBaseUrl() {
    if (!this.baseUrl) {
      this.baseUrl = configService.getServerUrl()
    }
    return this.baseUrl
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured() {
    try {
      return !!(this.getBaseUrl() && this.clientId)
    } catch (error) {
      return false
    }
  }

  /**
   * Get the current auth token from Supabase
   */
  async getAuthToken() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.access_token
    } catch (error) {
      console.error('Error getting auth token:', error)
      return null
    }
  }

  /**
   * Get common headers for API requests
   */
  async getHeaders() {
    const authToken = await this.getAuthToken()
    
    if (!authToken) {
      throw new Error('No authentication token available')
    }

    return {
      'algo-client-id': this.clientId,
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'algo-user-datetime': new Date().toISOString()
    }
  }

  /**
   * Get headers specifically for chat requests with class context
   * Only includes Authorization, algo-class-id, and algo-course-id
   */
  async getChatHeaders(context = {}) {
    const authToken = await this.getAuthToken()
    
    if (!authToken) {
      throw new Error('No authentication token available')
    }

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }

    // Add class context headers if provided
    if (context.classId) {
      headers['algo-class-id'] = context.classId.toString()
    }
    
    if (context.courseId) {
      headers['algo-course-id'] = context.courseId.toString()
    }

    console.log('AgentAPIService: Chat headers:', {
      ...headers,
      'Authorization': 'Bearer ***' // Don't log the actual token
    })

    return headers
  }

  /**
   * Make an API request with proper headers
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const headers = await this.getHeaders()
      const url = `${this.getBaseUrl()}${endpoint}`
      
      console.log(`AgentAPIService: ${options.method || 'GET'} ${url}`)

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      })

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          console.log('AgentAPIService: 401 Unauthorized - User needs to re-authenticate')
          
          // Clear the current session
          await supabase.auth.signOut()
          
          // Create error with status code
          const error = new Error('Authentication expired. Please log in again.')
          error.status = 401
          
          // Redirect to login page
          window.location.href = '/login'
          
          throw error
        }
        
        const errorText = await response.text()
        const error = new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`)
        error.status = response.status
        throw error
      }

      const data = await response.json()
      console.log(`AgentAPIService: Response received:`, data)
      
      return data
    } catch (error) {
      console.error(`AgentAPIService: Request failed:`, error)
      throw error
    }
  }

  // ========================================
  // AI CHAT OPERATIONS
  // ========================================

  /**
   * Send a message to the AI agent for chat
   * @param {string} message - The user's message
   * @param {Array} files - Optional array of files (not implemented yet)
   * @param {Object} context - Optional context with classId and courseId
   */
  async sendMessage(message, files = [], context = {}) {
    try {
      const body = {
        message: message
      }

      // TODO: Add file handling when needed
      if (files && files.length > 0) {
        body.files = files
      }

      console.log('Sending chat message to agent:', { message: message.substring(0, 100) + '...' })

      // Build chat-specific headers
      const chatHeaders = await this.getChatHeaders(context)

      // Make chat request directly without using makeRequest to avoid merging common headers
      const url = `${this.getBaseUrl()}${this.chatPath}`
      console.log(`AgentAPIService: POST ${url}`)

      const response = await fetch(url, {
        method: 'POST',
        headers: chatHeaders,
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        // Handle 401 Unauthorized specifically for chat endpoint
        if (response.status === 401) {
          console.log('AgentAPIService: 401 Unauthorized - User needs to re-authenticate')
          
          // Clear the current session
          await supabase.auth.signOut()
          
          // Create error with status code
          const error = new Error('Authentication expired. Please log in again.')
          error.status = 401
          
          // Redirect to login page
          window.location.href = '/login'
          
          throw error
        }
        
        const errorText = await response.text()
        const error = new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`)
        error.status = response.status
        throw error
      }

      const data = await response.json()
      console.log(`AgentAPIService: Chat response received:`, data)

      console.log('Agent chat response received')
      return data
      
    } catch (error) {
      console.error('Error sending message to agent:', error)
      throw error
    }
  }

  // ========================================
  // AGENT MANAGEMENT OPERATIONS
  // ========================================

  /**
   * Get all agents
   */
  async getAgents() {
    return this.makeRequest('/v1/agents')
  }

  /**
   * Get a specific agent by ID
   */
  async getAgent(id) {
    return this.makeRequest(`/v1/agents/${id}`)
  }

  /**
   * Create a new agent
   */
  async createAgent(agentData) {
    return this.makeRequest('/v1/agents', {
      method: 'POST',
      body: JSON.stringify(agentData)
    })
  }

  /**
   * Update an existing agent
   */
  async updateAgent(id, agentData) {
    return this.makeRequest(`/v1/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData)
    })
  }

  /**
   * Delete an agent
   */
  async deleteAgent(id) {
    return this.makeRequest(`/v1/agents/${id}`, {
      method: 'DELETE'
    })
  }

  // ========================================
  // TOOL MANAGEMENT OPERATIONS
  // ========================================

  /**
   * Get all tools
   */
  async getTools() {
    return this.makeRequest('/v1/tools')
  }

  /**
   * Get a specific tool by ID
   */
  async getTool(id) {
    return this.makeRequest(`/v1/tools/${id}`)
  }

  /**
   * Create a new tool
   */
  async createTool(toolData) {
    return this.makeRequest('/v1/tools', {
      method: 'POST',
      body: JSON.stringify(toolData)
    })
  }

  /**
   * Update an existing tool
   */
  async updateTool(id, toolData) {
    return this.makeRequest(`/v1/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toolData)
    })
  }

  /**
   * Delete a tool
   */
  async deleteTool(id) {
    return this.makeRequest(`/v1/tools/${id}`, {
      method: 'DELETE'
    })
  }

  // ========================================
  // AGENT-TOOL RELATIONSHIP OPERATIONS
  // ========================================

  /**
   * Get all agent-tool relationships
   */
  async getAgentTools() {
    return this.makeRequest('/v1/agent-tools')
  }

  /**
   * Get a specific agent-tool relationship by ID
   */
  async getAgentTool(id) {
    return this.makeRequest(`/v1/agent-tools/${id}`)
  }

  /**
   * Create a new agent-tool relationship
   */
  async createAgentTool(relationshipData) {
    return this.makeRequest('/v1/agent-tools', {
      method: 'POST',
      body: JSON.stringify(relationshipData)
    })
  }

  /**
   * Update an existing agent-tool relationship
   */
  async updateAgentTool(id, relationshipData) {
    return this.makeRequest(`/v1/agent-tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(relationshipData)
    })
  }

  /**
   * Delete an agent-tool relationship
   */
  async deleteAgentTool(id) {
    return this.makeRequest(`/v1/agent-tools/${id}`, {
      method: 'DELETE'
    })
  }
}

// Export a singleton instance
export const agentAPIService = new AgentAPIService()

// Also export the class for testing purposes
export { AgentAPIService }
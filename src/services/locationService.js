import { supabase } from './supabase.js'
import { configService } from './configService.js'

/**
 * Location Service for Physical Locations Management
 * Handles CRUD operations for buildings and rooms
 */
class LocationService {
  constructor() {
    this.baseUrl = null
    this.clientId = null
  }

  /**
   * Lazy initialization of baseUrl from config service
   */
  async initialize() {
    if (!this.baseUrl) {
      const config = configService.getConfig()
      this.baseUrl = config.server_url
      this.clientId = config.algo_client_id || 'mcgp-school-2025-07'
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
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Make an API request with proper headers
   */
  async makeRequest(endpoint, options = {}) {
    if (!this.baseUrl) {
      await this.initialize()
    }

    const headers = await this.getHeaders()
    const url = `${this.baseUrl}${endpoint}`

    console.log(`LocationService: ${options.method || 'GET'} ${url}`)

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.log('LocationService: 401 Unauthorized - redirecting to login')
        await supabase.auth.signOut()
        window.location.href = '/login'
        throw new Error('Authentication expired. Please log in again.')
      }

      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    console.log(`LocationService: Response received:`, data)
    return data
  }

  // ==================== BUILDING OPERATIONS ====================

  /**
   * Get all buildings with optional filters
   */
  async getBuildings(params = {}) {
    const queryParams = new URLSearchParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })

    const queryString = queryParams.toString()
    const endpoint = `/v1/buildings${queryString ? `?${queryString}` : ''}`

    return this.makeRequest(endpoint)
  }

  /**
   * Get a specific building by ID with rooms
   */
  async getBuilding(id) {
    return this.makeRequest(`/v1/buildings/${id}`)
  }

  /**
   * Create a new building
   */
  async createBuilding(buildingData) {
    return this.makeRequest('/v1/buildings', {
      method: 'POST',
      body: JSON.stringify(buildingData)
    })
  }

  /**
   * Update an existing building
   */
  async updateBuilding(id, buildingData) {
    return this.makeRequest(`/v1/buildings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(buildingData)
    })
  }

  /**
   * Delete a building (soft delete)
   */
  async deleteBuilding(id) {
    return this.makeRequest(`/v1/buildings/${id}`, {
      method: 'DELETE'
    })
  }

  // ==================== ROOM OPERATIONS ====================

  /**
   * Get all rooms in a building
   */
  async getRooms(buildingId, params = {}) {
    const queryParams = new URLSearchParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })

    const queryString = queryParams.toString()
    const endpoint = `/v1/buildings/${buildingId}/rooms${queryString ? `?${queryString}` : ''}`

    return this.makeRequest(endpoint)
  }

  /**
   * Create a new room in a building
   */
  async createRoom(buildingId, roomData) {
    return this.makeRequest(`/v1/buildings/${buildingId}/rooms`, {
      method: 'POST',
      body: JSON.stringify(roomData)
    })
  }

  /**
   * Update an existing room
   */
  async updateRoom(buildingId, roomId, roomData) {
    return this.makeRequest(`/v1/buildings/${buildingId}/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(roomData)
    })
  }

  /**
   * Delete a room (soft delete)
   */
  async deleteRoom(buildingId, roomId) {
    return this.makeRequest(`/v1/buildings/${buildingId}/rooms/${roomId}`, {
      method: 'DELETE'
    })
  }

  // ==================== ENUM MANAGEMENT ====================

  /**
   * Cache for enum values to avoid repeated API calls
   */
  static enumCache = null
  static enumCacheTimestamp = null
  static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

  /**
   * Get enum values from API with caching
   */
  async getEnumValues() {
    const now = Date.now()

    // Return cached values if they're still valid
    if (LocationService.enumCache &&
        LocationService.enumCacheTimestamp &&
        (now - LocationService.enumCacheTimestamp) < LocationService.CACHE_DURATION) {
      return LocationService.enumCache
    }

    try {
      const data = await this.makeRequest('/v1/locations/enums')

      // Cache the result
      LocationService.enumCache = data
      LocationService.enumCacheTimestamp = now

      return data
    } catch (error) {
      console.error('Failed to fetch enum values:', error)

      // Re-throw the error if API fails
      throw error
    }
  }

  /**
   * Get building types for dropdowns (API-based)
   */
  async getBuildingTypes() {
    const enums = await this.getEnumValues()
    if (!enums.building_types) {
      throw new Error('Failed to get building types from API')
    }
    return enums.building_types
  }

  /**
   * Get room types for dropdowns (API-based)
   */
  async getRoomTypes() {
    const enums = await this.getEnumValues()
    if (!enums.room_types) {
      throw new Error('Failed to get room types from API')
    }
    return enums.room_types
  }

  /**
   * Get building amenities for multi-select (API-based)
   */
  async getBuildingAmenities() {
    const enums = await this.getEnumValues()
    if (!enums.amenities) {
      throw new Error('Failed to get building amenities from API')
    }
    return enums.amenities
  }

  /**
   * Get room features for multi-select (API-based)
   */
  async getRoomFeatures() {
    const enums = await this.getEnumValues()
    if (!enums.features) {
      throw new Error('Failed to get room features from API')
    }
    return enums.features
  }



  /**
   * Clear enum cache (useful for testing or manual refresh)
   */
  static clearEnumCache() {
    LocationService.enumCache = null
    LocationService.enumCacheTimestamp = null
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Format building type for display
   */
  formatBuildingType(type) {
    if (!type) return ''
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
  }

  /**
   * Format room type for display
   */
  formatRoomType(type) {
    if (!type) return ''
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
  }
}

// Export singleton instance
export const locationService = new LocationService()

// Also export the class for testing
export { LocationService }
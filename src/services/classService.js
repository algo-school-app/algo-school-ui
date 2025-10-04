import { supabase } from './supabase.js'
import { configService } from './configService.js'

/**
 * Class Service for Academic Classes Management
 * Handles CRUD operations for classes, teacher assignments, and student enrollments
 */
class ClassService {
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

    console.log(`ClassService: ${options.method || 'GET'} ${url}`)

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
        console.log('ClassService: 401 Unauthorized - redirecting to login')
        await supabase.auth.signOut()
        window.location.href = '/login'
        throw new Error('Authentication expired. Please log in again.')
      }

      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    console.log(`ClassService: Response received:`, data)
    return data
  }

  // ==================== CLASS OPERATIONS ====================

  /**
   * Get all classes with optional filters and pagination
   */
  async getClasses(params = {}) {
    const queryParams = new URLSearchParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })

    const queryString = queryParams.toString()
    const endpoint = `/v1/classes${queryString ? `?${queryString}` : ''}`

    return this.makeRequest(endpoint)
  }

  /**
   * Get a specific class by ID
   */
  async getClass(id) {
    return this.makeRequest(`/v1/classes/${id}`)
  }

  /**
   * Create a new class
   */
  async createClass(classData) {
    return this.makeRequest('/v1/classes', {
      method: 'POST',
      body: JSON.stringify(classData)
    })
  }

  /**
   * Update an existing class
   */
  async updateClass(id, classData) {
    return this.makeRequest(`/v1/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData)
    })
  }

  /**
   * Delete a class (soft delete)
   */
  async deleteClass(id) {
    return this.makeRequest(`/v1/classes/${id}`, {
      method: 'DELETE'
    })
  }

  // ==================== TEACHER ASSIGNMENT OPERATIONS ====================

  /**
   * Get all teachers assigned to a class
   */
  async getClassTeachers(classId) {
    return this.makeRequest(`/v1/classes/${classId}/teachers`)
  }

  /**
   * Assign a teacher to a class
   */
  async assignTeacher(classId, teacherData) {
    return this.makeRequest(`/v1/classes/${classId}/teachers`, {
      method: 'POST',
      body: JSON.stringify(teacherData)
    })
  }

  /**
   * Remove a teacher from a class
   */
  async removeTeacher(classId, teacherId) {
    return this.makeRequest(`/v1/classes/${classId}/teachers`, {
      method: 'DELETE',
      body: JSON.stringify({ person_id: teacherId })
    })
  }

  // ==================== STUDENT ENROLLMENT OPERATIONS ====================

  /**
   * Get all students enrolled in a class
   */
  async getClassStudents(classId) {
    return this.makeRequest(`/v1/classes/${classId}/students`)
  }

  /**
   * Enroll a student in a class
   */
  async enrollStudent(classId, studentData) {
    return this.makeRequest(`/v1/classes/${classId}/students`, {
      method: 'POST',
      body: JSON.stringify(studentData)
    })
  }

  /**
   * Update student enrollment details
   */
  async updateStudentEnrollment(classId, studentId, enrollmentData) {
    return this.makeRequest(`/v1/classes/${classId}/students`, {
      method: 'PUT',
      body: JSON.stringify({
        person_id: studentId,
        ...enrollmentData
      })
    })
  }

  /**
   * Remove a student from a class
   */
  async unenrollStudent(classId, studentId) {
    return this.makeRequest(`/v1/classes/${classId}/students`, {
      method: 'DELETE',
      body: JSON.stringify({ person_id: studentId })
    })
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get available programs (optionally filtered by academic year)
   */
  async getPrograms(academicYearId = null) {
    const url = academicYearId
      ? `/v1/programs?academic_year_id=${academicYearId}`
      : '/v1/programs'
    return this.makeRequest(url)
  }

  /**
   * Get available courses for class creation
   */
  async getCourses(params = {}) {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key])
    })
    const queryString = queryParams.toString()
    return this.makeRequest(`/v1/courses${queryString ? `?${queryString}` : ''}`)
  }

  /**
   * Get all buildings to find available rooms
   * Note: There's no direct /v1/rooms endpoint, rooms are under buildings
   */
  async getBuildings() {
    return this.makeRequest('/v1/buildings')
  }

  /**
   * Get available rooms for a specific building
   */
  async getRoomsForBuilding(buildingId) {
    return this.makeRequest(`/v1/buildings/${buildingId}/rooms`)
  }

  /**
   * Get available teachers for assignment
   * Uses the people endpoint with eligible-teachers filter
   */
  async getEligibleTeachers() {
    return this.makeRequest('/v1/people/eligible-teachers')
  }

  /**
   * Get all people (can be filtered by role)
   */
  async getPeople(params = {}) {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key])
    })
    const queryString = queryParams.toString()
    return this.makeRequest(`/v1/people${queryString ? `?${queryString}` : ''}`)
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Format class status for display
   */
  formatClassStatus(isActive) {
    return isActive ? 'Active' : 'Inactive'
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(isActive) {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

// Export singleton instance
export const classService = new ClassService()

// Also export the class for testing
export { ClassService }
import { supabase } from './supabase.js'

/**
 * User Service for handling user profile data and authentication
 * 
 * OPTIMIZATION: This service prioritizes using stored data to avoid unnecessary API calls.
 * Data is loaded once during login and reused throughout the application.
 */
export class UserService {
  
  /**
   * Load complete user profile with tenant and permissions
   */
  static async loadUserProfile() {
    try {
      console.log('UserService: Loading complete user profile...')
      
      const { data, error } = await supabase.rpc('algo_get_user_profile')
      
      if (error) {
        console.error('UserService: Error loading user profile:', error)
        throw error
      }
      
      if (data && data.success) {
        console.log('UserService: Profile loaded successfully:', data)
        console.log('UserService: Permissions in response:', data.permissions)
        console.log('UserService: Total permissions in response:', data.total_permissions)
        
        // Store complete profile data
        localStorage.setItem('algo_user_profile', JSON.stringify(data))
        
        // Also update basic user data for backward compatibility
        const basicUserData = {
          id: data.user_profile?.person_id,
          username: data.user_profile?.email?.split('@')[0],
          email: data.user_profile?.email,
          role: data.roles?.[0]?.display_name || 'student',
          name: data.user_profile?.full_name
        }
        localStorage.setItem('algo_user', JSON.stringify(basicUserData))
        
        return data
      } else if (data && data.success === false) {
        // Handle specific error cases from the function
        console.log('UserService: Profile loading failed with error:', data.error)
        return data // Return the error response so LoginComponent can handle it
      } else {
        throw new Error('Invalid profile response structure')
      }
    } catch (error) {
      console.error('UserService: Failed to load user profile:', error)
      throw error
    }
  }
  
  /**
   * Get stored user profile data
   */
  static getStoredProfile() {
    try {
      const savedProfile = localStorage.getItem('algo_user_profile')
      if (savedProfile) {
        return JSON.parse(savedProfile)
      }
    } catch (e) {
      console.warn('UserService: Failed to parse stored profile data:', e)
    }
    return null
  }
  
  /**
   * Get basic user data (for backward compatibility)
   */
  static getStoredUser() {
    try {
      const savedUser = localStorage.getItem('algo_user')
      if (savedUser) {
        return JSON.parse(savedUser)
      }
    } catch (e) {
      console.warn('UserService: Failed to parse stored user data:', e)
    }
    return null
  }
  
  /**
   * Clear all user data from storage
   */
  static clearUserData() {
    localStorage.removeItem('algo_user')
    localStorage.removeItem('algo_user_profile')
    localStorage.removeItem('algo_session_time')
    localStorage.removeItem('algo_token')
  }
  
  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    const user = this.getStoredUser()
    const token = localStorage.getItem('algo_token')
    return !!(user && token)
  }
  
  /**
   * Get user ID from stored data (no API call)
   */
  static getUserId() {
    const storedProfile = this.getStoredProfile()
    const storedUser = this.getStoredUser()
    
    if (storedProfile?.user_profile?.person_id) {
      return storedProfile.user_profile.person_id
    } else if (storedUser?.id) {
      return storedUser.id
    }
    return null
  }
  
  /**
   * Get session information
   */
  static getSessionInfo() {
    return {
      sessionTime: localStorage.getItem('algo_session_time'),
      token: localStorage.getItem('algo_token'),
      user: this.getStoredUser(),
      profile: this.getStoredProfile(),
      userId: this.getUserId()
    }
  }
}

export default UserService
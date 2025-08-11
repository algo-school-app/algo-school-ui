<template>
  <div class="min-h-screen flex items-center justify-center educational-login-bg p-4 relative overflow-hidden">
    <!-- Floating Educational Elements -->
    <div class="floating-elements">
      <div v-for="(item, index) in floatingItems" :key="index" 
           class="floating-item absolute text-4xl opacity-60"
           :style="item.style">
        {{ item.emoji }}
      </div>
    </div>
    
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 educational-pattern opacity-10"></div>
    
    <!-- Main Login Card -->
    <div class="w-full max-w-md relative z-10">
      <div class="login-card bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-blue-200 dark:border-blue-700 p-8 transform hover:scale-105 transition-all duration-500">
        <!-- Animated Logo and Brand -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 logo-bounce shadow-xl">
            <HandDrawnIcon name="graduation" size="xl" class="text-white transform rotate-12" />
          </div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animated-text">
            {{ publicName || 'Loading...' }}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">
            🌟 Ready to learn something amazing today? 🌟
          </p>
          <div class="mt-3 flex justify-center gap-2 text-2xl welcome-emojis">
            <span class="animate-bounce" style="animation-delay: 0.1s">📚</span>
            <span class="animate-bounce" style="animation-delay: 0.2s">✨</span>
            <span class="animate-bounce" style="animation-delay: 0.3s">🎓</span>
            <span class="animate-bounce" style="animation-delay: 0.4s">💫</span>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Username -->
          <div class="form-group">
            <label for="username" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              👤 What's your learning name?
            </label>
            <div class="relative magical-input-container">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 z-10">
                <HandDrawnIcon name="user" size="sm" />
              </span>
              <input
                id="username"
                v-model="username"
                @focus="onUsernameFocus"
                @blur="onUsernameBlur"
                @input="onUsernameInput"
                type="text"
                class="magical-input w-full pl-12 pr-4 py-4 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-gray-900 dark:text-white placeholder-purple-400 dark:placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200 transition-all duration-300 text-base font-medium"
                placeholder="Type your magical username..."
                required
                autocomplete="username"
              >
              <div v-if="usernameTyping" class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                ✨
              </div>
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              🔐 Your secret learning key?
            </label>
            <div class="relative magical-input-container">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 z-10">
                <HandDrawnIcon name="shield" size="sm" />
              </span>
              <input
                id="password"
                v-model="password"
                @focus="onPasswordFocus"
                @blur="onPasswordBlur"
                @input="onPasswordInput"
                type="password"
                class="magical-input w-full pl-12 pr-4 py-4 border-2 border-green-200 dark:border-green-700 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-gray-900 dark:text-white placeholder-green-400 dark:placeholder-green-400 focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-200 transition-all duration-300 text-base font-medium"
                placeholder="Enter your secret password..."
                required
                autocomplete="current-password"
              >
              <div v-if="passwordTyping" class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                🛡️
              </div>
            </div>
          </div>

          <!-- Magical Submit Button -->
          <button
            type="submit"
            class="magical-button w-full px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
            :disabled="isLoading || loginSuccess"
            @mouseover="onButtonHover"
          >
            <span v-if="loginSuccess" class="flex items-center gap-2">
              🎊 Welcome Back, Learning Champion! 🏆
            </span>
            <span v-else-if="isLoading" class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              🚀 Launching your learning adventure...
            </span>
            <span v-else class="flex items-center gap-2">
              ✨ Start My Learning Journey! 🎓
            </span>
          </button>

          <!-- OAuth Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t-2 border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                ✨ Or continue with ✨
              </span>
            </div>
          </div>

          <!-- Google OAuth Button -->
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full px-6 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md hover:shadow-lg transform hover:scale-105 text-lg"
            :disabled="isLoading || loginSuccess"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with MCGP</span>
          </button>

          <!-- Friendly Error Message -->
          <Transition
            enter="transition-all duration-300 ease-in-out"
            enter-from="opacity-0 -translate-y-2 scale-95"
            enter-to="opacity-100 translate-y-0 scale-100"
            leave="transition-all duration-200 ease-in-out"
            leave-from="opacity-100 translate-y-0 scale-100"
            leave-to="opacity-0 -translate-y-2 scale-95"
          >
            <div v-if="error" class="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl flex items-center gap-3 shadow-lg">
              <span class="text-2xl">😔</span>
              <div>
                <p class="text-sm font-bold text-red-700 dark:text-red-300">Oops! Something went wrong</p>
                <p class="text-xs text-red-600 dark:text-red-400">{{ error }}</p>
              </div>
            </div>
          </Transition>
        </form>

        <!-- Magical Footer -->
        <div class="mt-8 pt-6 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700 text-center">
          <div class="flex justify-center gap-3 text-xl mb-3">
            <span class="animate-pulse">🌟</span>
            <span class="animate-pulse" style="animation-delay: 0.2s">🎓</span>
            <span class="animate-pulse" style="animation-delay: 0.4s">📚</span>
            <span class="animate-pulse" style="animation-delay: 0.6s">✨</span>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">
            💫 {{ publicName || 'Loading...' }} - Where Learning Becomes an Adventure! 💫
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {{ legalName || 'Loading...' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Success Confetti Explosion -->
    <ConfettiExplosion ref="confettiRef" intensity="high" :duration="5000" @complete="onConfettiComplete" />

    <!-- Tenant Access Dialog -->
    <div v-if="showTenantAccessDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md my-4 sm:my-0" @click.stop>
        <div class="p-4 sm:p-6">
          <!-- Header -->
          <div class="flex items-center justify-center mb-4 sm:mb-6">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <i class="fas fa-exclamation-triangle text-orange-600 dark:text-orange-400 text-xl sm:text-2xl"></i>
            </div>
          </div>
          
          <!-- Content -->
          <div class="text-center mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">Access Required</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              Your account has been authenticated, but you don't have access to any school programs yet. 
              Please contact the school administration to request access to the system.
            </p>
          </div>
          
          <!-- Additional Info -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div class="flex items-start gap-2 sm:gap-3">
              <i class="fas fa-info-circle text-blue-600 dark:text-blue-400 text-sm mt-0.5"></i>
              <div class="text-sm text-blue-800 dark:text-blue-200">
                <p class="font-medium mb-1">What to do next:</p>
                <ul class="text-xs sm:text-sm space-y-1 text-blue-700 dark:text-blue-300">
                  <li>• Contact the school office during business hours</li>
                  <li>• Or click "Inform Admin" to notify administration</li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="closeTenantAccessDialog"
              class="order-2 sm:order-1 flex-1 px-4 py-3 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base font-medium touch-manipulation"
            >
              Close
            </button>
            <button 
              @click="informAdmin"
              class="order-1 sm:order-2 flex-1 px-4 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium flex items-center justify-center gap-2 touch-manipulation"
            >
              <i class="fas fa-paper-plane text-xs"></i>
              Inform Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Transition } from 'vue'
import { useRouter } from 'vue-router'
import HandDrawnIcon from './HandDrawnIcon.vue'
import ConfettiExplosion from './ConfettiExplosion.vue'
import { supabase } from '../services/supabase.js'
import { UserService } from '../services/userService.js'
import { configService } from '../services/configService.js'

const $router = useRouter()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
const showTenantAccessDialog = ref(false)
const tenantAccessError = ref('')
const loginSuccess = ref(false)

// Dynamic branding from config
const publicName = ref('')
const legalName = ref('')

// Interactive animation states
const usernameTyping = ref(false)
const passwordTyping = ref(false)
const floatingItems = ref([])
let floatingInterval = null

// Confetti reference
const confettiRef = ref(null)

// Educational floating elements
const educationalEmojis = ['📚', '✏️', '🎓', '📝', '🔍', '💡', '🌟', '✨', '📖', '🖊️', '📐', '🎯', '🏆', '🎪', '🎨', '🧮', '🔬', '🌍', '🚀', '💫']

// Interactive form functions
const onUsernameFocus = () => {
  usernameTyping.value = true
}

const onUsernameBlur = () => {
  setTimeout(() => {
    usernameTyping.value = false
  }, 1000)
}

const onUsernameInput = () => {
  // Add sparkle effect when typing
  if (username.value.length > 0) {
    usernameTyping.value = true
  }
}

const onPasswordFocus = () => {
  passwordTyping.value = true
}

const onPasswordBlur = () => {
  setTimeout(() => {
    passwordTyping.value = false
  }, 1000)
}

const onPasswordInput = () => {
  // Add shield effect when typing
  if (password.value.length > 0) {
    passwordTyping.value = true
  }
}

const onButtonHover = () => {
  // Add some sparkles when hovering the button
  generateRandomFloatingItem('✨', 'hover-sparkle')
}

// Floating animation functions
const generateFloatingItem = (emoji, animationClass = 'float-across') => {
  return {
    emoji,
    style: {
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDuration: (Math.random() * 10 + 10) + 's',
      animationDelay: Math.random() * 5 + 's',
      transform: `rotate(${Math.random() * 360}deg)`,
      fontSize: (Math.random() * 20 + 20) + 'px'
    },
    class: animationClass
  }
}

const generateRandomFloatingItem = (emoji = null, animationClass = 'float-across') => {
  const selectedEmoji = emoji || educationalEmojis[Math.floor(Math.random() * educationalEmojis.length)]
  const newItem = generateFloatingItem(selectedEmoji, animationClass)
  floatingItems.value.push(newItem)
  
  // Remove after animation completes
  setTimeout(() => {
    const index = floatingItems.value.findIndex(item => item === newItem)
    if (index > -1) {
      floatingItems.value.splice(index, 1)
    }
  }, 15000)
}

const startFloatingAnimation = () => {
  // Generate initial floating items
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      generateRandomFloatingItem()
    }, i * 1000)
  }
  
  // Continue generating items periodically
  floatingInterval = setInterval(() => {
    generateRandomFloatingItem()
  }, 3000)
}

const stopFloatingAnimation = () => {
  if (floatingInterval) {
    clearInterval(floatingInterval)
    floatingInterval = null
  }
}

// Confetti completion handler
const onConfettiComplete = () => {
  console.log('🎊 Confetti celebration completed! User is ready for the dashboard!')
}

const handleGoogleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    console.log('Initiating Google OAuth login...')
    
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`
      }
    })
    
    if (oauthError) {
      throw oauthError
    }
    
    console.log('Google OAuth initiated successfully', data)
    
  } catch (err) {
    console.error('Google OAuth error:', err)
    error.value = err.message || 'Failed to sign in with Google. Please try again.'
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }
  isLoading.value = true
  error.value = ''
  try {
    // Step 1: Authenticate with Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: username.value.includes('@') ? username.value : `${username.value}@mcgp.school`,
      password: password.value
    })
    if (authError) {
      throw authError
    }
    if (!data || !data.user) {
      throw new Error('Invalid authentication response from Supabase')
    }

    // Step 2: Get complete user profile from database
    try {
      const profileData = await UserService.loadUserProfile()
      console.log('LoginComponent: Profile data loaded and stored successfully')
      
      // Check if user has tenant access - multiple scenarios
      if (hasTenantAccessIssue(profileData)) {
        console.warn('LoginComponent: User has no tenant access')
        tenantAccessError.value = 'User has no access to any tenants'
        showTenantAccessDialog.value = true
        return // Stop the login process
      }
      
    } catch (profileErr) {
      console.warn('LoginComponent: Profile loading failed:', profileErr)
      
      // Check if the error is related to tenant access
      if (profileErr.message && (
        profileErr.message.includes('User has no access to any tenants') ||
        profileErr.message.includes('User has no tenant access') ||
        profileErr.message.includes('Context initialization failed')
      )) {
        console.warn('LoginComponent: User has no tenant access (from exception):', profileErr.message)
        tenantAccessError.value = profileErr.message
        showTenantAccessDialog.value = true
        return // Stop the login process
      }
      
      // For other errors, continue with basic user data from authentication
      const basicUserData = {
        id: data.user.id,
        username: username.value,
        email: data.user.email,
        role: 'student',
        name: data.user.user_metadata?.full_name || username.value.charAt(0).toUpperCase() + username.value.slice(1)
      }
      localStorage.setItem('algo_user', JSON.stringify(basicUserData))
    }

    // Step 3: Store session information
    localStorage.setItem('algo_session_time', new Date().toISOString())
    localStorage.setItem('algo_token', 'authenticated')
    
    // Step 4: Trigger celebration confetti explosion! 🎊
    loginSuccess.value = true // Change button text to celebration mode
    
    if (confettiRef.value) {
      confettiRef.value.explode()
    }
    
    // Step 5: Redirect to dashboard after confetti celebration
    setTimeout(async () => {
      // Restore theme before navigation
      restoreOriginalTheme()
      await $router.push('/dashboard')
    }, 2500) // Give time for confetti to be enjoyed!
  } catch (err) {
    error.value = err.message || 'Authentication failed. Please try again.'
    loginSuccess.value = false // Reset success state on error
  } finally {
    isLoading.value = false
  }
}

// Helper function to detect tenant access issues
const hasTenantAccessIssue = (profileData) => {
  if (!profileData) {
    return false
  }
  
  // Case 1: Explicit error response with success: false
  if (profileData.success === false) {
    const errorMessage = profileData.error
    // Check for various tenant access error messages
    if (errorMessage && (
      errorMessage === 'User has no access to any tenants' ||
      errorMessage.includes('User has no tenant access') ||
      errorMessage.includes('Context initialization failed')
    )) {
      console.log('LoginComponent: Detected tenant access issue - explicit error response:', errorMessage)
      return true
    }
  }
  
  // Case 2: Success is true but available_tenants is null or empty
  if (profileData.success === true) {
    const availableTenants = profileData.available_tenants
    if (!availableTenants || (Array.isArray(availableTenants) && availableTenants.length === 0)) {
      console.log('LoginComponent: Detected tenant access issue - empty available_tenants')
      return true
    }
  }
  
  return false
}

// Handle tenant access dialog
const closeTenantAccessDialog = () => {
  showTenantAccessDialog.value = false
  tenantAccessError.value = ''
  // Clear any stored session data since user doesn't have access
  localStorage.removeItem('algo_session_time')
  localStorage.removeItem('algo_token')
  localStorage.removeItem('algo_user')
  localStorage.removeItem('algo_user_profile')
}

const informAdmin = () => {
  // TODO: Implement email notification to admin
  console.log('LoginComponent: Informing admin about user access request')
  
  // Show success toast message
  if (window.toast && window.toast.success) {
    window.toast.success(
      'Request Submitted', 
      'School administration has been notified. You will be contacted soon.',
      8000 // Show for 8 seconds
    )
  } else {
    // Fallback if toast is not available
    console.warn('Toast component not available, using fallback')
    alert('School administration has been notified about your access request. You will be contacted soon.')
  }
  
  // Close the dialog
  closeTenantAccessDialog()
}

// Store original theme state to restore later
const originalThemeState = ref(null)

// Lifecycle hooks
onMounted(async () => {
  console.log('LoginComponent mounted, checking for OAuth callback...')
  console.log('Current URL:', window.location.href)
  console.log('Hash:', window.location.hash)
  
  // Force day theme on login page - store original state first
  originalThemeState.value = document.documentElement.classList.contains('dark')
  document.documentElement.classList.remove('dark')
  console.log('LoginComponent: Forced day theme for login page')
  
  // Check for OAuth errors first
  const urlParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  
  if (urlParams.get('error') || hashParams.get('error')) {
    const errorCode = urlParams.get('error_code') || hashParams.get('error_code') || ''
    const errorDescription = urlParams.get('error_description') || hashParams.get('error_description') || ''
    
    console.log('OAuth error detected:', { errorCode, errorDescription })
    
    // Clear the URL parameters
    window.history.replaceState(null, '', window.location.pathname)
    
    // Set appropriate error message
    if (errorCode === 'signup_disabled' || errorDescription.includes('Signups not allowed')) {
      error.value = 'Your SSO account is not authorized to access this system. Please contact your administrator to request access.'
    } else if (errorCode === 'access_denied') {
      error.value = 'Access denied. You are not authorized to login with this SSO account.'
    } else {
      error.value = errorDescription.replace(/\+/g, ' ') || 'Authentication failed. Please try again.'
    }
    
    return // Don't process further
  }
  
  // Check if this is a successful OAuth callback
  if (window.location.hash && window.location.hash.includes('access_token')) {
    console.log('OAuth callback detected, processing...')
    isLoading.value = true
    
    try {
      // Wait a moment for Supabase to process the hash
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      console.log('Session check result:', { session, sessionError })
      
      if (sessionError) {
        throw sessionError
      }
      
      if (session && session.user) {
        console.log('Session established, user ID:', session.user.id)
        
        // Use UserService to load profile (same as regular login)
        try {
          const profileData = await UserService.loadUserProfile()
          console.log('OAuth: Profile data loaded and stored successfully')
          
          // Check if user has tenant access - multiple scenarios
          if (hasTenantAccessIssue(profileData)) {
            console.warn('OAuth: User has no tenant access')
            tenantAccessError.value = 'User has no access to any tenants'
            showTenantAccessDialog.value = true
            isLoading.value = false
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname)
            return // Stop the login process
          }
          
        } catch (profileErr) {
          console.error('OAuth: Profile loading failed:', profileErr)
          
          // Check if the error is related to tenant access
          if (profileErr.message && (
            profileErr.message.includes('User has no access to any tenants') ||
            profileErr.message.includes('User has no tenant access') ||
            profileErr.message.includes('Context initialization failed')
          )) {
            console.warn('OAuth: User has no tenant access (from exception):', profileErr.message)
            tenantAccessError.value = profileErr.message
            showTenantAccessDialog.value = true
            isLoading.value = false
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname)
            return // Stop the login process
          }
          
          // For other errors, throw to be caught by outer try-catch
          throw profileErr
        }
        
        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname)
        
        // Store session information (same as regular login)
        localStorage.setItem('algo_session_time', new Date().toISOString())
        localStorage.setItem('algo_token', 'authenticated')
        
        // Trigger celebration confetti explosion! 🎊
        loginSuccess.value = true
        
        if (confettiRef.value) {
          confettiRef.value.explode()
        }
        
        // Navigate to dashboard after confetti celebration
        console.log('Redirecting to dashboard...')
        setTimeout(() => {
          // Restore theme before navigation
          restoreOriginalTheme()
          $router.push('/dashboard').catch(err => {
            console.error('OAuth navigation error:', err)
            // Fallback to root if dashboard fails
            $router.push('/')
          })
        }, 2500) // Give time for confetti to be enjoyed!
        
      } else {
        console.log('No session found after OAuth callback')
        throw new Error('Failed to establish session. Please try logging in again.')
      }
      
    } catch (err) {
      console.error('OAuth processing error:', err)
      error.value = err.message || 'Failed to complete login. Please try again.'
      isLoading.value = false
      
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname)
      
      // Don't sign out here - let user see the error
    }
  } else {
    console.log('No OAuth callback detected, showing normal login form')
  }
  
  // Load dynamic branding from config
  try {
    const config = configService.getConfig()
    publicName.value = config.public_name
    legalName.value = config.legal_name
  } catch (error) {
    console.error('Failed to load branding config:', error)
    // Don't throw - let component render with empty values
  }
  
  startFloatingAnimation()
})

// Function to restore original theme state
const restoreOriginalTheme = () => {
  if (originalThemeState.value !== null) {
    if (originalThemeState.value) {
      document.documentElement.classList.add('dark')
      console.log('LoginComponent: Restored dark theme')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('LoginComponent: Maintained light theme')
    }
    originalThemeState.value = null
  }
}

onUnmounted(() => {
  stopFloatingAnimation()
  // Restore the original theme when component is destroyed
  restoreOriginalTheme()
})
</script>

<style scoped>
/* Educational Login Background */
.educational-login-bg {
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%, 
    #f093fb 50%, 
    #f5576c 75%, 
    #4facfe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Educational Pattern Background */
.educational-pattern {
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 3px, transparent 3px),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 3px, transparent 3px),
    radial-gradient(circle at 40% 40%, rgba(120, 255, 198, 0.3) 3px, transparent 3px);
  background-size: 80px 80px, 120px 120px, 100px 100px;
  animation: patternFloat 20s ease-in-out infinite;
}

@keyframes patternFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

/* Floating Items */
.floating-item {
  pointer-events: none;
  z-index: 1;
  animation: floatAcross 15s linear infinite;
}

@keyframes floatAcross {
  0% {
    transform: translateX(-100px) translateY(100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateX(calc(100vw + 100px)) translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Login Card */
.login-card {
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Logo Animation */
.logo-bounce {
  animation: logoBounce 2s ease-in-out infinite;
}

@keyframes logoBounce {
  0%, 100% {
    transform: translateY(0) rotate(12deg) scale(1);
  }
  50% {
    transform: translateY(-10px) rotate(12deg) scale(1.05);
  }
}

/* Animated Text */
.animated-text {
  animation: textGlow 3s ease-in-out infinite;
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(79, 70, 229, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(79, 70, 229, 0.6), 0 0 30px rgba(147, 51, 234, 0.4);
  }
}

/* Welcome Emojis */
.welcome-emojis span {
  display: inline-block;
  animation: bounce 2s infinite;
}

/* Magical Form Inputs */
.magical-input {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.magical-input:focus {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 20px rgba(147, 51, 234, 0.3);
}

.magical-input-container {
  position: relative;
}

.magical-input-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.75rem;
  background: linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.1), transparent);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.magical-input:focus + .magical-input-container::before,
.magical-input-container:hover::before {
  opacity: 1;
}

/* Magical Button */
.magical-button {
  position: relative;
  overflow: hidden;
  background-size: 200% 200%;
  animation: buttonGradient 3s ease infinite;
}

@keyframes buttonGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.magical-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.magical-button:hover::before {
  left: 100%;
}

/* Form Group Animation */
.form-group {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add staggered animation delays */
.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.magical-button { animation-delay: 0.3s; }

/* Hover Sparkle Effect */
.hover-sparkle {
  animation: sparkle 1s ease-out forwards;
}

@keyframes sparkle {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .educational-login-bg {
    padding: 1rem;
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  .floating-item {
    font-size: 1.5rem !important;
  }
}

/* Dark mode adjustments */
.dark .login-card {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dark .educational-pattern {
  opacity: 0.05;
}
</style>
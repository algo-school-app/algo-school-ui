<template>
  <div class="max-w-4xl mx-auto p-3 sm:p-6 pb-12 mb-8 animated-gradient-bg floating-pattern-bg content-area-animated">
    <div class="card-gradient-bg card-appear rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Application Settings</h2>
      
      <div class="space-y-6">
        <!-- Appearance Section -->
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Appearance</h3>
          <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <label class="text-gray-700 dark:text-gray-300 font-medium">Theme</label>
            <button 
              @click="toggleTheme" 
              class="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <i :class="currentTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon'"></i>
              {{ currentTheme === 'light' ? 'Light' : 'Dark' }}
            </button>
          </div>
        </div>

        <!-- Notifications Section -->
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Notifications</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex flex-col">
                <label class="text-gray-700 dark:text-gray-300 font-medium">Email Notifications</label>
                <span class="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="notifications.email" 
                  class="sr-only peer"
                  @change="saveNotificationSettings"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex flex-col">
                <label class="text-gray-700 dark:text-gray-300 font-medium">Push Notifications</label>
                <span class="text-sm text-gray-500 dark:text-gray-400">Receive browser push notifications</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="notifications.push" 
                  class="sr-only peer"
                  @change="saveNotificationSettings"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex flex-col">
                <label class="text-gray-700 dark:text-gray-300 font-medium">System Notifications</label>
                <span class="text-sm text-gray-500 dark:text-gray-400">Important system updates and alerts</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="notifications.system" 
                  class="sr-only peer"
                  @change="saveNotificationSettings"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Language & Region Section -->
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Language & Region</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label class="text-gray-700 dark:text-gray-300 font-medium">Language</label>
              <select 
                v-model="language" 
                @change="saveLanguageSettings"
                class="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label class="text-gray-700 dark:text-gray-300 font-medium">Time Zone</label>
              <select 
                v-model="timezone" 
                @change="saveLanguageSettings"
                class="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Privacy & Security Section -->
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Privacy & Security</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex flex-col">
                <label class="text-gray-700 dark:text-gray-300 font-medium">Two-Factor Authentication</label>
                <span class="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</span>
              </div>
              <button 
                @click="setup2FA" 
                class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                {{ twoFactorEnabled ? 'Manage' : 'Enable' }}
              </button>
            </div>
            
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex flex-col">
                <label class="text-gray-700 dark:text-gray-300 font-medium">Session Timeout</label>
                <span class="text-sm text-gray-500 dark:text-gray-400">Automatically log out after inactivity</span>
              </div>
              <select 
                v-model="sessionTimeout" 
                @change="saveSecuritySettings"
                class="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="480">8 hours</option>
              </select>
            </div>
          </div>
        </div>


        <!-- Data & Storage Section -->
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Data & Storage</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex flex-col">
                <label class="text-gray-700 dark:text-gray-300 font-medium">Clear Cache</label>
                <span class="text-sm text-gray-500 dark:text-gray-400">Clear application cache and temporary data</span>
              </div>
              <button 
                @click="clearCache" 
                class="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                Clear Cache
              </button>
            </div>
            
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex flex-col">
                <label class="text-gray-700 dark:text-gray-300 font-medium">Export Data</label>
                <span class="text-sm text-gray-500 dark:text-gray-400">Download your personal data</span>
              </div>
              <button 
                @click="exportData" 
                class="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Theme management
const currentTheme = ref('light')

// Notification preferences
const notifications = ref({
  email: true,
  push: true,
  system: true
})

// Language & Region settings
const language = ref('en')
const timezone = ref('America/New_York')

// Security settings
const twoFactorEnabled = ref(false)
const sessionTimeout = ref('60')


onMounted(() => {
  loadSettings()
  detectCurrentTheme()
})

const detectCurrentTheme = () => {
  // Detect current theme from document
  if (document.documentElement.classList.contains('dark')) {
    currentTheme.value = 'dark'
  } else {
    currentTheme.value = 'light'
  }
}

const loadSettings = () => {
  // Load settings from localStorage
  const savedNotifications = localStorage.getItem('algo_notifications')
  if (savedNotifications) {
    notifications.value = JSON.parse(savedNotifications)
  }
  
  const savedLanguage = localStorage.getItem('algo_language')
  if (savedLanguage) {
    language.value = savedLanguage
  }
  
  const savedTimezone = localStorage.getItem('algo_timezone')
  if (savedTimezone) {
    timezone.value = savedTimezone
  }
  
  const savedSessionTimeout = localStorage.getItem('algo_session_timeout')
  if (savedSessionTimeout) {
    sessionTimeout.value = savedSessionTimeout
  }
  
  const saved2FA = localStorage.getItem('algo_2fa_enabled')
  if (saved2FA) {
    twoFactorEnabled.value = JSON.parse(saved2FA)
  }
}

const toggleTheme = () => {
  // Toggle between light and dark themes
  if (currentTheme.value === 'light') {
    currentTheme.value = 'dark'
    document.documentElement.classList.add('dark')
    localStorage.setItem('algo_theme', 'dark')
  } else {
    currentTheme.value = 'light'
    document.documentElement.classList.remove('dark')
    localStorage.setItem('algo_theme', 'light')
  }
  
  showToast('Theme updated successfully!', 'success')
}

const saveNotificationSettings = () => {
  localStorage.setItem('algo_notifications', JSON.stringify(notifications.value))
  showToast('Notification preferences updated!', 'success')
}

const saveLanguageSettings = () => {
  localStorage.setItem('algo_language', language.value)
  localStorage.setItem('algo_timezone', timezone.value)
  showToast('Language and region settings updated!', 'success')
}

const saveSecuritySettings = () => {
  localStorage.setItem('algo_session_timeout', sessionTimeout.value)
  showToast('Security settings updated!', 'success')
}

const setup2FA = () => {
  // Placeholder for 2FA setup
  if (twoFactorEnabled.value) {
    showToast('Two-factor authentication management coming soon!', 'info')
  } else {
    showToast('Two-factor authentication setup coming soon!', 'info')
  }
}

const clearCache = () => {
  // Clear application cache
  try {
    // Clear specific application data but preserve user settings
    const keysToKeep = ['algo_theme', 'algo_notifications', 'algo_language', 'algo_timezone', 'algo_session_timeout', 'algo_2fa_enabled', 'algo_user', 'algo_user_profile', 'algo_token']
    const allKeys = Object.keys(localStorage)
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key)
      }
    })
    
    showToast('Cache cleared successfully!', 'success')
  } catch (error) {
    showToast('Failed to clear cache', 'error')
  }
}

const exportData = () => {
  // Export user data
  try {
    const userData = {
      profile: JSON.parse(localStorage.getItem('algo_user_profile') || '{}'),
      settings: {
        theme: currentTheme.value,
        notifications: notifications.value,
        language: language.value,
        timezone: timezone.value,
        sessionTimeout: sessionTimeout.value
      },
      exportedAt: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `mcgp-data-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showToast('Data export started!', 'success')
  } catch (error) {
    showToast('Failed to export data', 'error')
  }
}


const showToast = (message, type = 'info') => {
  if (window.showToast) {
    window.showToast(type, 'Settings', message)
  } else {
    alert(message)
  }
}
</script>
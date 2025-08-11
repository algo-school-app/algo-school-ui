<template>
  <div class="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col min-h-screen">
    <!-- Top Navigation Bar -->
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-14 md:h-16 flex-shrink-0 z-20">
      <div class="px-2 sm:px-4 lg:px-8 h-full">
        <div class="flex justify-between items-center h-full gap-2">
          <!-- Left side - Mobile menu button + Title -->
          <div class="flex items-center min-w-0 flex-1">
            <button 
              @click="toggleSidebar" 
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 touch-manipulation mr-2"
            >
              <HandDrawnIcon name="menu" size="sm" />
            </button>
            <h1 class="text-sm sm:text-base md:text-xl font-semibold text-gray-900 dark:text-white truncate">MCGP School Dashboard</h1>
          </div>

          <!-- Right side - Actions -->
          <div class="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
            <!-- Seasonal Theme Selector - Hidden on mobile -->
            <div class="hidden sm:block">
              <SeasonalThemeSelector :show-controls="true" />
            </div>
            
            <!-- Tenant/Campus Selector -->
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center text-xs sm:text-sm rounded-full bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 touch-manipulation">
                <HandDrawnIcon name="graduation" size="xs" class="text-gray-600 dark:text-gray-300 mr-1 sm:mr-2" />
                <span class="text-gray-700 dark:text-gray-200 hidden sm:inline max-w-24 lg:max-w-none truncate">{{ currentTenant }}</span>
                <span class="text-gray-700 dark:text-gray-200 sm:hidden max-w-16 truncate">{{ currentTenant.split(' ')[0] }}</span>
                <i class="fas fa-chevron-down text-gray-400 ml-1 sm:ml-2 text-xs"></i>
              </MenuButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div class="py-1">
                    <MenuItem v-for="tenant in availableTenants" :key="tenant.id" v-slot="{ active }">
                      <button 
                        @click="switchTenant(tenant.id)" 
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300', 
                          'group flex items-center px-4 py-2 text-sm w-full',
                          tenant.is_current ? 'bg-blue-50 dark:bg-blue-900' : ''
                        ]"
                      >
                        <HandDrawnIcon name="calendar" size="sm" class="mr-3 text-gray-400" />
                        {{ tenant.display_name }}
                        <i v-if="tenant.is_current" class="fas fa-check ml-auto text-blue-500"></i>
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>

            <!-- Academic Year Selector - Hidden on mobile -->
            <Menu as="div" class="relative hidden sm:block">
              <MenuButton class="flex items-center text-sm rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 touch-manipulation">
                <HandDrawnIcon name="book" size="sm" class="text-gray-600 dark:text-gray-300 mr-2" />
                <span class="text-gray-700 dark:text-gray-200 max-w-32 lg:max-w-none truncate">{{ currentAcademicYear }}</span>
                <i class="fas fa-chevron-down text-gray-400 ml-2"></i>
              </MenuButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 w-64 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div class="py-1">
                    <MenuItem v-for="academicYear in availableAcademicYears" :key="academicYear.academic_year_id" v-slot="{ active }">
                      <button 
                        @click="switchAcademicYear(academicYear.academic_year_id)" 
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300', 
                          'group flex items-center px-4 py-2 text-sm w-full',
                          academicYear.is_current ? 'bg-green-50 dark:bg-green-900' : ''
                        ]"
                      >
                        <HandDrawnIcon name="calendar" size="sm" class="mr-3 text-gray-400" />
                        <div class="flex flex-col items-start">
                          <span class="font-medium">{{ academicYear.academic_year_display_name }}</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">{{ academicYear.start_date }} - {{ academicYear.end_date }}</span>
                        </div>
                        <i v-if="academicYear.is_current" class="fas fa-check ml-auto text-green-500"></i>
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>

            <!-- Theme Toggle -->
            <button 
              @click="toggleTheme" 
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 touch-manipulation"
            >
              <HandDrawnIcon :name="theme === 'light' ? 'moon' : 'sun'" size="sm" />
            </button>

            <!-- Sign Out Button -->
            <button 
              @click="logout" 
              class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium touch-manipulation"
            >
              <i class="fas fa-sign-out-alt text-xs sm:text-sm"></i>
              <span class="hidden lg:block">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <div class="transition-all duration-300"
           :class="{ 
             'w-64': !sidebarCollapsed && !isMobile,
             'w-16': sidebarCollapsed && !isMobile,
             'w-0 overflow-hidden': isMobile
           }">
        <SidebarComponent 
          :is-collapsed="sidebarCollapsed"
          :is-mobile-open="sidebarMobileOpen"
          :is-mobile="isMobile"
          :current-user="currentUser"
          :selected-menu="selectedMenu"
          @toggle-sidebar="toggleSidebar">
        </SidebarComponent>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 w-full overflow-auto animated-gradient-bg">
        <MainContent 
          :selected-menu="selectedMenu"
          :sidebar-collapsed="sidebarCollapsed">
        </MainContent>
      </div>
    </div>
    
    <!-- Mobile Overlay -->
    <div v-if="sidebarMobileOpen" 
         @click="closeMobileSidebar" 
         class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
         style="top: 0; left: 0; width: 100vw; height: 100vh;"></div>
    
    <!-- Toast Notifications -->
    <ToastComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import MainContent from '../components/MainContent.vue'
import ToastComponent from '../components/ToastComponent.vue'
import SeasonalThemeSelector from '../components/SeasonalThemeSelector.vue'
import HandDrawnIcon from '../components/HandDrawnIcon.vue'
import { UserService } from '../services/userService.js'
import { supabase } from '../services/supabase.js'

const router = useRouter()
const route = useRoute()

const currentUser = ref(null)
const sidebarCollapsed = ref(false)
const sidebarMobileOpen = ref(false)
const selectedMenu = ref('AI')
const theme = ref('light')
const isMobile = ref(false)
const currentTenant = ref('Saturday School')
const availableTenants = ref([])
const currentAcademicYear = ref('2024-2025 Academic Year')
const availableAcademicYears = ref([])
const userProfile = ref(null)

// Map URL parameters to menu names
const menuMap = {
  'ai': 'AI',
  'academic-setup': 'AcademicSetup',
  'academic-years': 'AcademicYears',
  'enrollment-periods': 'EnrollmentPeriods',
  'users': 'Users',
  'students': 'Students',
  'parents': 'Parents',
  'staff': 'Staff',
  'programs': 'AllPrograms',
  'academic-year': 'AcademicYear',
  'program-courses': 'ProgramCourses',
  'courses': 'AllCourses',
  'course-categories': 'CourseCategories',
  'course-enrollments': 'CourseEnrollments',
  'profile': 'Profile',
  'settings': 'Settings',
  'auth': 'RolePermissions',
  'ai-settings': 'AISettings'
}

// Watch for route changes
watch(() => route.params.menu, (newMenu) => {
  if (newMenu) {
    // Handle both single menu items and nested paths like my-class/courseId
    const menuPath = Array.isArray(newMenu) ? newMenu.join('/') : newMenu
    selectedMenu.value = menuMap[menuPath] || menuPath
  }
})

// Check authentication on mount
onMounted(async () => {
  const savedUser = localStorage.getItem('algo_user')
  if (!savedUser) {
    // User not authenticated, redirect to login
    router.push('/login')
    return
  }
  
  currentUser.value = JSON.parse(savedUser)
  
  // Load theme preference
  const savedTheme = localStorage.getItem('algo_theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
    theme.value = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    theme.value = 'light'
  }
  
  // Load user profile and available tenants
  await loadUserProfile()
  
  // Set initial menu based on route
  if (route.params.menu) {
    // Handle both single menu items and nested paths like my-class/courseId
    const menuPath = Array.isArray(route.params.menu) ? route.params.menu.join('/') : route.params.menu
    selectedMenu.value = menuMap[menuPath] || menuPath
  }
  
  // Check initial screen size
  checkScreenSize()
  
  // Add resize listener
  window.addEventListener('resize', checkScreenSize)
})

// Check screen size and update mobile state
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) {
    sidebarCollapsed.value = false
  }
}

const toggleSidebar = () => {
  if (isMobile.value) {
    sidebarMobileOpen.value = !sidebarMobileOpen.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

const closeMobileSidebar = () => {
  sidebarMobileOpen.value = false
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('algo_theme', theme.value)
}

// Load user profile and tenant data
const loadUserProfile = async () => {
  try {
    const profileData = UserService.getStoredProfile()
    if (profileData && profileData.available_tenants && profileData.available_academic_years) {
      // Set available tenants
      availableTenants.value = profileData.available_tenants
      
      // Set current tenant display name
      const currentTenantData = profileData.available_tenants.find(t => t.is_current)
      if (currentTenantData) {
        currentTenant.value = currentTenantData.display_name
      }
      
      // Set available academic years
      availableAcademicYears.value = profileData.available_academic_years
      
      // Set current academic year display name
      const currentAcademicYearData = profileData.available_academic_years.find(ay => ay.is_current)
      if (currentAcademicYearData) {
        currentAcademicYear.value = currentAcademicYearData.academic_year_display_name
      }
    } else {
      // If no stored profile, try to load from API
      const freshProfileData = await UserService.loadUserProfile()
      if (freshProfileData && freshProfileData.available_tenants && freshProfileData.available_academic_years) {
        availableTenants.value = freshProfileData.available_tenants
        const currentTenantData = freshProfileData.available_tenants.find(t => t.is_current)
        if (currentTenantData) {
          currentTenant.value = currentTenantData.display_name
        }
        
        availableAcademicYears.value = freshProfileData.available_academic_years
        const currentAcademicYearData = freshProfileData.available_academic_years.find(ay => ay.is_current)
        if (currentAcademicYearData) {
          currentAcademicYear.value = currentAcademicYearData.academic_year_display_name
        }
      }
    }
  } catch (error) {
    console.error('Failed to load user profile:', error)
    if (window.toast) {
      window.toast.error('Error', 'Failed to load user profile')
    }
  }
}

// Tenant switching
const switchTenant = async (tenantId) => {
  const selectedTenant = availableTenants.value.find(t => t.id === tenantId)
  if (!selectedTenant) {
    if (window.toast) {
      window.toast.error('Error', 'Selected tenant not found')
    }
    return
  }

  try {
    // Show loading state
    if (window.toast) {
      window.toast.info('Switching Tenant', `Switching to ${selectedTenant.display_name}...`)
    }

    // 1. Call algo_set_tenant_context to set new tenant in database
    const { data: contextData, error: contextError } = await supabase.rpc('algo_set_tenant_context', {
      p_tenant_id: tenantId
    })

    if (contextError) {
      throw new Error(`Failed to set tenant context: ${contextError.message}`)
    }

    // 2. Call algo_get_user_profile to get fresh data and store in localStorage
    const freshProfileData = await UserService.loadUserProfile()
    if (!freshProfileData || !freshProfileData.success) {
      throw new Error('Failed to load fresh user profile data')
    }

    // 3. Update local state
    currentTenant.value = selectedTenant.display_name
    localStorage.setItem('algo_current_tenant', tenantId)
    
    // Update the is_current flag in the local data
    availableTenants.value.forEach(tenant => {
      tenant.is_current = tenant.id === tenantId
    })
    
    // Show success notification
    if (window.toast) {
      window.toast.success('Tenant Switched', `Successfully switched to ${selectedTenant.display_name}`)
    }

    // 4. Redirect to home page and refresh
    setTimeout(() => {
      window.location.href = '/dashboard/ai'
    }, 1000)

  } catch (error) {
    console.error('Failed to switch tenant:', error)
    if (window.toast) {
      window.toast.error('Switch Failed', error.message || 'Failed to switch tenant')
    }
  }
}

// Academic year switching
const switchAcademicYear = (academicYearId) => {
  const selectedAcademicYear = availableAcademicYears.value.find(ay => ay.academic_year_id === academicYearId)
  if (selectedAcademicYear) {
    currentAcademicYear.value = selectedAcademicYear.academic_year_display_name
    localStorage.setItem('algo_current_academic_year', academicYearId)
    
    // Update the is_current flag in the local data
    availableAcademicYears.value.forEach(academicYear => {
      academicYear.is_current = academicYear.academic_year_id === academicYearId
    })
    
    // Show toast notification
    if (window.toast) {
      window.toast.success('Academic Year Switched', `Switched to ${selectedAcademicYear.academic_year_display_name}`)
    }
  }
}

// Navigation methods

const logout = async () => {
  try {
    // Sign out from Supabase first
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out from Supabase:', error)
    }
  } catch (error) {
    console.error('Error during logout:', error)
  }
  
  // Clear all authentication-related localStorage items
  localStorage.removeItem('algo_user')
  localStorage.removeItem('algo_user_profile')
  localStorage.removeItem('algo_token')
  localStorage.removeItem('algo_session_time')
  localStorage.removeItem('algo_current_tenant')
  localStorage.removeItem('algo_current_academic_year')
  localStorage.removeItem('algo_chat_session')
  
  // Redirect to login
  router.push('/login')
}
</script>
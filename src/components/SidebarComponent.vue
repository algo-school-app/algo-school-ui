<template>
  <div class="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col"
       :class="{ 
         'fixed top-0 left-0 w-64 h-screen z-50 transform transition-transform duration-300': props.isMobile && props.isMobileOpen,
         'fixed top-0 -left-64 w-64 h-screen z-50 transform transition-transform duration-300': props.isMobile && !props.isMobileOpen
       }">
    
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div v-if="!isCollapsed || props.isMobile" class="flex items-center">
        <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
          <HandDrawnIcon name="graduation" size="sm" class="text-white" />
        </div>
        <span class="ml-3 font-semibold text-gray-900 dark:text-white">MCGP School</span>
      </div>
      <button v-if="!props.isMobile" @click="$emit('toggle-sidebar')" 
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105">
        <HandDrawnIcon :name="isCollapsed ? 'arrow-right' : 'arrow-left'" 
                       size="xs" 
                       class="text-gray-500 dark:text-gray-400" />
      </button>
      <!-- Mobile close button -->
      <button v-if="props.isMobile && props.isMobileOpen" @click="$emit('toggle-sidebar')" 
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105">
        <HandDrawnIcon name="arrow-left" size="sm" class="text-gray-500 dark:text-gray-400" />
      </button>
    </div>

    <!-- Main Navigation -->
    <div class="flex-1 overflow-y-auto px-2 py-4 overscroll-contain">
      <div v-for="item in mainMenuItems" :key="item.id" class="mb-1 relative">
        <button @click="selectMenu(item.id)"
                class="w-full flex items-center px-3 py-3 sm:py-2 text-sm font-medium rounded-lg transition-all duration-200 touch-manipulation"
                :class="[
                  selectedMenu === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                  props.isMobile ? 'text-base' : 'hover:scale-105 hover:-translate-y-0.5'
                ]">
          <HandDrawnIcon :name="item.icon" size="lg" class="flex-shrink-0" />
          <span v-if="!isCollapsed || props.isMobile" class="ml-3 flex-1 text-left">{{ item.label }}</span>
          <HandDrawnIcon v-if="item.submenu && !isCollapsed && !props.isMobile" 
                         :name="expandedMenus.includes(item.id) ? 'arrow-down' : 'arrow-right'" 
                         size="xs" 
                         class="text-gray-500 dark:text-gray-400" />
          <HandDrawnIcon v-if="item.submenu && isCollapsed && !props.isMobile" 
                         :name="expandedMenus.includes(item.id) ? 'arrow-left' : 'arrow-right'" 
                         size="xs" 
                         class="text-gray-500 dark:text-gray-400 ml-auto" />
          <HandDrawnIcon v-if="item.submenu && props.isMobile" 
                         :name="expandedMenus.includes(item.id) ? 'arrow-down' : 'arrow-right'" 
                         size="xs" 
                         class="text-gray-500 dark:text-gray-400" />
        </button>

        
        <!-- Submenu items - shown inline for all states -->
        <div v-if="item.submenu && expandedMenus.includes(item.id)" 
             class="mt-1 space-y-1"
             :class="{ 
               'ml-4': !isCollapsed || props.isMobile,
               'ml-0': isCollapsed && !props.isMobile 
             }">
          <button v-for="subItem in item.submenu" 
                  :key="subItem.id"
                  @click="selectMenu(subItem.id)"
                  class="w-full flex items-center px-3 py-3 sm:py-2 text-sm font-medium rounded-lg transition-all duration-200 touch-manipulation"
                  :class="[
                    selectedMenu === subItem.id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
                    { 'justify-center': isCollapsed && !props.isMobile },
                    props.isMobile ? 'text-base' : 'hover:scale-105 hover:-translate-y-0.5'
                  ]">
            <HandDrawnIcon :name="subItem.icon" size="sm" class="flex-shrink-0" />
            <span v-if="!isCollapsed || props.isMobile" class="ml-3 truncate">{{ subItem.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="border-t border-gray-200 dark:border-gray-700">
      <div class="px-2 py-2">
        <div v-for="item in bottomMenuItems" :key="item.id">
          <button @click="selectMenu(item.id)"
                  class="w-full flex items-center px-3 py-3 sm:py-2 text-sm font-medium rounded-lg mb-1 transition-all duration-200 touch-manipulation"
                  :class="[
                    selectedMenu === item.id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                    props.isMobile ? 'text-base' : 'hover:scale-105 hover:-translate-y-0.5'
                  ]">
            <HandDrawnIcon :name="item.icon" size="md" class="flex-shrink-0" />
            <span v-if="!isCollapsed || props.isMobile" class="ml-3">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import HandDrawnIcon from './HandDrawnIcon.vue'
import { UserService } from '../services/userService.js'

const props = defineProps({
  isCollapsed: Boolean,
  isMobileOpen: Boolean,
  isMobile: Boolean,
  selectedMenu: String
})

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()
// Use the isMobile prop from parent instead of computing it here

const expandedMenus = ref([])

// Handle click outside to close popover
const handleClickOutside = (event) => {
  if (props.isCollapsed && !props.props.isMobile) {
    const sidebar = event.target.closest('.bg-white.dark\\:bg-gray-900')
    if (!sidebar) {
      expandedMenus.value = []
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Get user classes from profile for dynamic My Classes menu
const getUserClasses = () => {
  try {
    const profile = UserService.getStoredProfile()
    const classList = []
    
    if (profile && profile.courses && Array.isArray(profile.courses)) {
      profile.courses.forEach(course => {
        if (course.classes && Array.isArray(course.classes)) {
          course.classes.forEach(classItem => {
            classList.push({
              id: `Class_${classItem.id}`,
              label: course.display_name,
              icon: 'chalkboard-teacher',
              classId: classItem.id,
              courseId: course.id,
              courseName: course.name,
              className: classItem.classroom?.name || 'Class'
            })
          })
        }
      })
    }
    
    return classList
  } catch (error) {
    console.error('Error getting user classes:', error)
  }
  return []
}

const mainMenuItems = computed(() => {
  const userClasses = getUserClasses()
  
  const items = []
  
  // Only add AI Assistant if user has agents_* permissions
  if (hasAgentsPermission()) {
    items.push({ id: 'AI', label: 'AI Assistant', icon: 'robot' })
  }
  
  items.push(
    { 
      id: 'AcademicSetup', 
      label: 'Academic Setup', 
      icon: 'cogs',
      submenu: [
        { id: 'AcademicYears', label: 'Academic Years', icon: 'calendar' },
        { id: 'AllPrograms', label: 'Programs', icon: 'programs' },
        { id: 'Courses', label: 'Courses', icon: 'book' },
        { id: 'Enrollments', label: 'Enrollments', icon: 'graduation' },
        { id: 'TeacherAssignments', label: 'Classes', icon: 'user' }
      ]
    },
    { 
      id: 'Users', 
      label: 'Users', 
      icon: 'group-users',
      submenu: [
        { id: 'Students', label: 'Students', icon: 'students' },
        { id: 'Parents', label: 'Parents', icon: 'parents' },
        { id: 'Staff', label: 'Staff', icon: 'staff' }
      ]
    }
  )
  
  // Only add My Classes if user has classes
  if (userClasses.length > 0) {
    items.push({
      id: 'MyClasses', 
      label: 'My Classes', 
      icon: 'classroom',
      submenu: userClasses
    })
  }
  
  return items
})

// Check if user has super_admin permission
const hasSupeAdminPermission = () => {
  try {
    const profile = UserService.getStoredProfile()
    if (profile && profile.permissions && Array.isArray(profile.permissions)) {
      return profile.permissions.some(permission => 
        permission.name === 'super_admin' && permission.is_active
      )
    }
  } catch (error) {
    console.error('Error checking super admin permission:', error)
  }
  return false
}

// Check if user has any agents_* permissions
const hasAgentsPermission = () => {
  try {
    const profile = UserService.getStoredProfile()
    if (profile && profile.permissions && Array.isArray(profile.permissions)) {
      return profile.permissions.some(permission => 
        permission.name.startsWith('agents_') && permission.is_active
      )
    }
  } catch (error) {
    console.error('Error checking agents permission:', error)
  }
  return false
}

const bottomMenuItems = computed(() => {
  const items = [
    { id: 'Profile', label: 'Profile', icon: 'user' }
  ]
  
  // Only add Security if user has super_admin permission
  if (hasSupeAdminPermission()) {
    items.push({ id: 'RolePermissions', label: 'Security', icon: 'shield' })
  }
  
  // Add AI Settings if user has super_admin permission
  if (hasSupeAdminPermission()) {
    items.push({ id: 'AISettings', label: 'AI Settings', icon: 'robot' })
  }
  
  items.push({ id: 'Settings', label: 'Settings', icon: 'settings' })
  return items
})

const selectMenu = (menuId) => {
  const menuItem = mainMenuItems.value.find(item => item.id === menuId)
  
  if (menuItem && menuItem.submenu) {
    if (expandedMenus.value.includes(menuId)) {
      expandedMenus.value = expandedMenus.value.filter(id => id !== menuId)
    } else {
      expandedMenus.value.push(menuId)
    }
    return
  }
  
  // Auto-close mobile menu when navigating to a page
  if (props.isMobile && props.isMobileOpen) {
    emit('toggle-sidebar')
  }
  
  // Auto-expand parent menu if this is a submenu item
  for (const item of mainMenuItems.value) {
    if (item.submenu) {
      const submenuItem = item.submenu.find(sub => sub.id === menuId)
      if (submenuItem && !expandedMenus.value.includes(item.id)) {
        expandedMenus.value.push(item.id)
      }
    }
  }
  
  // Handle dynamic class routes
  if (menuId.startsWith('Class_')) {
    const classId = menuId.replace('Class_', '')
    const routePath = `my-class/${classId}`
    router.push(`/dashboard/${routePath}`)
    return
  }
  
  const menuMap = {
    'AI': 'ai',
    'AcademicYears': 'academic-years',
    'AllPrograms': 'programs',
    'Courses': 'courses',
    'TeacherAssignments': 'classes',
    'Enrollments': 'enrollments',
    'Students': 'students',
    'Parents': 'parents',
    'Staff': 'staff',
    'RolePermissions': 'auth',
    'Profile': 'profile',
    'AISettings': 'ai-settings',
    'Settings': 'settings'
  }
  
  const urlMenu = menuMap[menuId] || menuId.toLowerCase()
  router.push(`/dashboard/${urlMenu}`)
}

watch(() => props.selectedMenu, (newSelectedMenu) => {
  if (newSelectedMenu) {
    for (const item of mainMenuItems.value) {
      if (item.submenu) {
        const submenuItem = item.submenu.find(sub => sub.id === newSelectedMenu)
        if (submenuItem && !expandedMenus.value.includes(item.id)) {
          expandedMenus.value.push(item.id)
        }
      }
    }
  }
}, { immediate: true })
</script>
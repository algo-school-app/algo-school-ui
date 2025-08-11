<template>
  <div class="programs-container w-full animated-gradient-bg floating-pattern-bg content-area-animated">
    <!-- Header -->
    <div class="flex-shrink-0 card-gradient-bg card-appear border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-2 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <i class="fas fa-graduation-cap text-blue-500 text-lg sm:text-xl"></i>
          <div>
            <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Academic Programs</h2>
            <p v-if="tenantInfo.name" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {{ tenantInfo.name }} • {{ tenantInfo.totalPrograms }} program{{ tenantInfo.totalPrograms !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <div class="relative flex-1 sm:flex-none">
            <i class="fas fa-search absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm"></i>
            <input 
              v-model="searchQuery" 
              @input="filterPrograms"
              type="text" 
              placeholder="Search programs..." 
              class="w-full sm:w-auto pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <!-- Add Program Button - Only show if user has permission -->
          <button v-if="canAddPrograms()" @click="showAddProgramModal = true" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap">
            <i class="fas fa-plus text-xs sm:text-sm"></i>
            <span class="hidden sm:inline">Add Program</span>
            <span class="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="programs-content p-3 sm:p-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300">Loading programs...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center h-full">
        <div class="text-center max-w-md mx-auto">
          <i class="fas fa-exclamation-triangle text-6xl text-red-300 dark:text-red-600 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Programs</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
          <button @click="loadPrograms" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 mx-auto">
            <i class="fas fa-redo"></i>
            Try Again
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredPrograms.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center max-w-md mx-auto">
          <i class="fas fa-graduation-cap text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Programs Found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ searchQuery ? 'No programs match your search criteria.' : 'No programs have been added yet.' }}</p>
          <!-- Add First Program Button - Only show if user has permission and no search query -->
          <button v-if="!searchQuery && canAddPrograms()" @click="showAddProgramModal = true" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 mx-auto">
            <i class="fas fa-plus"></i>
            Add First Program
          </button>
        </div>
      </div>
      
      <!-- Programs Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        <div 
          v-for="(program, index) in paginatedPrograms" 
          :key="program.id"
          class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow card-appear-staggered"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="p-4 sm:p-6">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <i class="fas fa-graduation-cap text-blue-500 text-lg sm:text-xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{{ program.display_name }}</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">{{ program.name }}</p>
                </div>
              </div>
              <span :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                program.is_active ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              ]">
                {{ program.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            
            <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{{ program.description }}</p>
            
            <div class="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
              <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <i class="fas fa-clock text-blue-500"></i>
                <span>{{ program.max_duration_value }} {{ program.max_duration_unit }}</span>
              </div>
              <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <i class="fas fa-calendar text-blue-500"></i>
                <span>Created: {{ formatDate(program.created_at) }}</span>
              </div>
              <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <i class="fas fa-check-circle text-green-500"></i>
                <span>{{ program.is_active ? 'Active' : 'Inactive' }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-end gap-1 sm:gap-2">
              <!-- Edit Button - Only show if user has permission -->
              <button v-if="canEditPrograms()" @click.stop="editProgram(program)" class="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Edit">
                <HandDrawnIcon name="edit" size="sm" />
              </button>
              
              <!-- Delete Button - Only show if user has permission -->
              <button v-if="canDeletePrograms()" @click.stop="deleteProgram(program)" class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Delete">
                <HandDrawnIcon name="trash" size="sm" />
              </button>
              
              <!-- View Button removed completely as requested -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Program Modal -->
    <div v-if="showAddProgramModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-2xl" @click.stop>
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ editingProgram ? 'Edit Program' : 'Add New Program' }}</h3>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <form @submit.prevent="saveProgram" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Program Name</label>
                <input v-model="programForm.name" type="text" required class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Program Code</label>
                <input v-model="programForm.code" type="text" required class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea v-model="programForm.description" rows="3" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                <input v-model="programForm.duration" type="text" placeholder="e.g., 1 Year, 6 Months" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select v-model="programForm.status" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4">
              <button type="button" @click="closeModal" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">Cancel</button>
              <button type="submit" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
                {{ editingProgram ? 'Update Program' : 'Add Program' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      ref="confirmDialog"
      :title="'Delete Program'"
      :message="pendingDeleteProgram ? `Are you sure you want to delete '${pendingDeleteProgram.display_name}'? This action cannot be undone.` : ''"
      confirm-text="Delete"
      confirm-icon="fas fa-trash"
      @confirm="confirmDeleteProgram"
      @cancel="pendingDeleteProgram = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase.js'
import { useToast } from '../utils/useToast.js'
import ConfirmationDialog from './ConfirmationDialog.vue'
import HandDrawnIcon from './HandDrawnIcon.vue'
import { UserService } from '../services/userService.js'

// Reactive data
const programs = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filteredPrograms = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(12)
const showAddProgramModal = ref(false)
const editingProgram = ref(null)
const programForm = ref({
  name: '',
  code: '',
  description: '',
  duration: '',
  status: 'active'
})

// Toast and dialog refs
const toast = useToast()
const confirmDialog = ref(null)
const pendingDeleteProgram = ref(null)

// Tenant context info
const tenantInfo = ref({
  name: '',
  id: null,
  totalPrograms: 0
})

// Load programs from Supabase
const loadPrograms = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('ProgramsComponent: Loading programs from Supabase...')
    
    // Call the algo_get_programs function
    const { data, error: supabaseError } = await supabase.rpc('algo_get_programs')
    
    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`)
    }
    
    if (data && data.success) {
      console.log('ProgramsComponent: Successfully loaded programs:', data)
      
      // Update programs array with response data
      programs.value = data.programs || []
      
      // Update tenant info
      tenantInfo.value = {
        name: data.tenant_name || '',
        id: data.tenant_id || null,
        totalPrograms: data.total_programs || 0
      }
      
      // Initialize filtered programs
      filteredPrograms.value = [...programs.value]
      
      console.log(`ProgramsComponent: Loaded ${programs.value.length} programs for tenant: ${tenantInfo.value.name}`)
      
    } else {
      // Handle error response
      const errorMsg = data?.error || 'Unknown error occurred'
      console.error('ProgramsComponent: Error response from server:', errorMsg)
      error.value = errorMsg
      programs.value = []
      filteredPrograms.value = []
    }
    
  } catch (err) {
    console.error('ProgramsComponent: Error loading programs:', err)
    error.value = err.message || 'Failed to load programs'
    programs.value = []
    filteredPrograms.value = []
  } finally {
    loading.value = false
  }
}

// Computed properties
const totalPages = computed(() => Math.ceil(filteredPrograms.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredPrograms.value.length))

const paginatedPrograms = computed(() => {
  return filteredPrograms.value.slice(startIndex.value, endIndex.value)
})

// Methods
const filterPrograms = () => {
  if (!searchQuery.value.trim()) {
    filteredPrograms.value = [...programs.value]
  } else {
    const query = searchQuery.value.toLowerCase()
    filteredPrograms.value = programs.value.filter(program => 
      program.name.toLowerCase().includes(query) ||
      program.display_name.toLowerCase().includes(query) ||
      (program.description && program.description.toLowerCase().includes(query))
    )
  }
  currentPage.value = 1
}

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

// Refresh programs
const refreshPrograms = async () => {
  console.log('ProgramsComponent: Refreshing programs...')
  await loadPrograms()
}

const viewProgram = (program) => {
  console.log('Viewing program:', program)
  // TODO: Implement view functionality
  toast.info('Coming Soon', `Viewing ${program.display_name} details will be implemented soon`)
}

const editProgram = (program) => {
  // TODO: Implement edit functionality with Supabase
  console.log('Edit program requested:', program.display_name)
  // For now, just show a message
  toast.info('Coming Soon', 'Edit functionality will be implemented soon')
}

const deleteProgram = (program) => {
  pendingDeleteProgram.value = program
  confirmDialog.value.open()
}

const confirmDeleteProgram = () => {
  if (pendingDeleteProgram.value) {
    // TODO: Implement delete functionality with Supabase
    console.log('Delete program confirmed:', pendingDeleteProgram.value.display_name)
    toast.info('Coming Soon', 'Delete functionality will be implemented soon')
    pendingDeleteProgram.value = null
  }
}

const saveProgram = () => {
  // TODO: Implement save functionality with Supabase
  console.log('Save program requested:', programForm.value)
  toast.info('Coming Soon', 'Add/Edit program functionality will be implemented soon')
  closeModal()
}

const closeModal = () => {
  showAddProgramModal.value = false
  editingProgram.value = null
  programForm.value = {
    name: '',
    code: '',
    description: '',
    duration: '',
    status: 'active'
  }
}

// Permission checking functions
const hasSuperAdminPermission = () => {
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

const hasPermission = (permissionName) => {
  try {
    const profile = UserService.getStoredProfile()
    if (profile && profile.permissions && Array.isArray(profile.permissions)) {
      // Check if user has super_admin permission (grants all permissions)
      if (hasSuperAdminPermission()) {
        return true
      }
      // Check for specific permission
      return profile.permissions.some(permission => 
        permission.name === permissionName && permission.is_active
      )
    }
  } catch (error) {
    console.error(`Error checking ${permissionName} permission:`, error)
  }
  return false
}

// Specific permission checkers for programs
const canAddPrograms = () => hasPermission('programs_add')
const canEditPrograms = () => hasPermission('programs_edit') 
const canDeletePrograms = () => hasPermission('programs_delete')

// Lifecycle
onMounted(() => {
  console.log('ProgramsComponent mounted')
  loadPrograms()
})

// Expose refresh function for parent components
defineExpose({
  refreshPrograms
})
</script>
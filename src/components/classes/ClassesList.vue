<template>
  <div class="classes-list h-full flex flex-col">
    <!-- Header -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage academic classes and assignments</p>
        </div>
        <button
          @click="showClassModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          v-if="hasCreatePermission"
        >
          <i class="fas fa-plus mr-2"></i>
          Add Class
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="flex-shrink-0 px-4 sm:px-6 py-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i class="fas fa-chalkboard-teacher text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Classes</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalClasses }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <i class="fas fa-user-graduate text-green-600 dark:text-green-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Classes</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.activeClasses }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <i class="fas fa-users text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalStudents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <i class="fas fa-user-tie text-orange-600 dark:text-orange-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalTeachers }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex-shrink-0 px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search classes, courses, or teachers..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        <select
          v-model="filterCourse"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Courses</option>
          <option
            v-for="course in availableCourses"
            :key="course.id"
            :value="course.id"
          >
            {{ course.name }}
          </option>
        </select>
        <select
          v-model="filterTeacher"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Teachers</option>
          <option
            v-for="teacher in availableTeachers"
            :key="teacher.id"
            :value="teacher.id"
          >
            {{ teacher.full_name }}
          </option>
        </select>
        <label class="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <input
            type="checkbox"
            v-model="showActiveOnly"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          >
          <span class="text-sm">Active Only</span>
        </label>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading classes...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-red-500 text-5xl mb-4">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Classes</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="loadClasses"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-redo mr-2"></i>
          Retry
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="classes.length === 0" class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-gray-300 dark:text-gray-700 text-6xl mb-4">
          <i class="fas fa-chalkboard-teacher"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Classes Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ searchQuery ? 'No classes match your search criteria.' : 'Get started by adding your first class.' }}
        </p>
        <button
          v-if="hasCreatePermission && !searchQuery"
          @click="showClassModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Add First Class
        </button>
      </div>
    </div>

    <!-- Classes Table -->
    <div v-else class="flex-1 overflow-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900 sticky top-0">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Class Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Course
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Teachers
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Students
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Room
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="classItem in paginatedClasses" :key="classItem.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ classItem.name }}</div>
                <div v-if="classItem.description" class="text-sm text-gray-500 dark:text-gray-400">{{ classItem.description }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ classItem.course?.name || 'N/A' }}</div>
              <div v-if="classItem.course?.code" class="text-sm text-gray-500 dark:text-gray-400">{{ classItem.course.code }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">
                {{ classItem.teacher_count || 0 }} assigned
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">
                {{ classItem.student_count || 0 }} enrolled
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">
                {{ classItem.room?.name || 'Not assigned' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="classService.getStatusBadgeClass(classItem.is_active)">
                {{ classService.formatClassStatus(classItem.is_active) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-2">
                <button
                  @click="viewClass(classItem)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="hasUpdatePermission"
                  @click="editClass(classItem)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  v-if="hasDeletePermission"
                  @click="confirmDeleteClass(classItem)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex-shrink-0 px-4 sm:px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} classes
        </div>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="currentPage = page"
            class="px-3 py-1 border rounded-lg"
            :class="currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            {{ page }}
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Class Modal -->
    <ClassFormModal
      v-if="showClassModal"
      :class-data="selectedClass"
      @close="closeClassModal"
      @saved="onClassSaved"
    />

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      v-if="showDeleteConfirm"
      ref="deleteConfirmDialog"
      title="Delete Class"
      :message="`Are you sure you want to delete '${classToDelete?.name}'? This action cannot be undone.`"
      confirmText="Delete"
      confirmIcon="fas fa-trash"
      @confirm="deleteClass"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { classService } from '@/services/classService.js'
import { useToast } from '@/utils/useToast.js'
import { UserService } from '@/services/userService.js'
import ClassFormModal from './ClassFormModal.vue'
import ConfirmationDialog from '../ConfirmationDialog.vue'

const toast = useToast()

// State
const classes = ref([])
const availableCourses = ref([])
const availableTeachers = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const filterCourse = ref('')
const filterTeacher = ref('')
const showActiveOnly = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

// Modal state
const showClassModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedClass = ref(null)
const classToDelete = ref(null)
const deleteConfirmDialog = ref(null)

// Stats
const stats = reactive({
  totalClasses: 0,
  activeClasses: 0,
  totalStudents: 0,
  totalTeachers: 0
})

// Permission checking using existing pattern
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

// Specific permission checkers for classes
const hasCreatePermission = computed(() => hasPermission('classes_create'))
const hasUpdatePermission = computed(() => hasPermission('classes_update'))
const hasDeletePermission = computed(() => hasPermission('classes_delete'))

// Computed
const filteredClasses = computed(() => {
  let result = [...classes.value]

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(search) ||
      (c.course?.name && c.course.name.toLowerCase().includes(search)) ||
      (c.description && c.description.toLowerCase().includes(search))
    )
  }

  if (filterCourse.value) {
    result = result.filter(c => c.course_id === filterCourse.value)
  }

  if (filterTeacher.value) {
    result = result.filter(c =>
      c.teachers && c.teachers.some(t => t.id === filterTeacher.value)
    )
  }

  if (showActiveOnly.value) {
    result = result.filter(c => c.is_active)
  }

  totalItems.value = result.length
  return result
})

const paginatedClasses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredClasses.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const loadClasses = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await classService.getClasses({
      status: showActiveOnly.value ? 'active' : 'all',
      course_id: filterCourse.value,
      teacher_id: filterTeacher.value,
      search: searchQuery.value
    })

    classes.value = response.data || []

    // Calculate stats
    stats.totalClasses = classes.value.length
    stats.activeClasses = classes.value.filter(c => c.is_active).length
    stats.totalStudents = classes.value.reduce((sum, c) => sum + (c.student_count || 0), 0)
    stats.totalTeachers = classes.value.reduce((sum, c) => sum + (c.teacher_count || 0), 0)

  } catch (err) {
    error.value = err.message
    toast.error('Failed to load classes')
  } finally {
    loading.value = false
  }
}

const loadFilterOptions = async () => {
  try {
    // Load courses for filter dropdown
    const coursesResponse = await classService.getCourses()
    availableCourses.value = coursesResponse.data || []

    // Load teachers for filter dropdown
    const teachersResponse = await classService.getEligibleTeachers()
    availableTeachers.value = teachersResponse.data || []
  } catch (err) {
    console.error('Failed to load filter options:', err)
  }
}

const viewClass = (classItem) => {
  // Navigate to class details (existing ClassComponent)
  const event = new CustomEvent('menu-select', {
    detail: `my-class/${classItem.id}`
  })
  window.dispatchEvent(event)
}

const editClass = (classItem) => {
  selectedClass.value = classItem
  showClassModal.value = true
}

const closeClassModal = () => {
  showClassModal.value = false
  selectedClass.value = null
}

const onClassSaved = () => {
  closeClassModal()
  loadClasses()
  toast.success('Class saved successfully')
}

const confirmDeleteClass = (classItem) => {
  classToDelete.value = classItem
  showDeleteConfirm.value = true
  // Open the dialog using the ref
  setTimeout(() => {
    if (deleteConfirmDialog.value) {
      deleteConfirmDialog.value.open()
    }
  }, 100)
}

const deleteClass = async () => {
  try {
    await classService.deleteClass(classToDelete.value.id)
    showDeleteConfirm.value = false
    classToDelete.value = null
    loadClasses()
    toast.success('Class deleted successfully')
  } catch (err) {
    toast.error(err.message || 'Failed to delete class')
  }
}

// Watchers
let searchTimeout
watch([searchQuery, filterCourse, filterTeacher, showActiveOnly], () => {
  currentPage.value = 1

  // Debounce search queries
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadClasses()
  }, 300)
})

// Lifecycle
onMounted(() => {
  loadClasses()
  loadFilterOptions()
})
</script>
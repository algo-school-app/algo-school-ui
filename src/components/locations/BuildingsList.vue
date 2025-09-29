<template>
  <div class="buildings-list h-full flex flex-col">
    <!-- Header -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Physical Locations</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage buildings and rooms</p>
        </div>
        <button
          @click="showBuildingModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          v-if="hasCreatePermission"
        >
          <i class="fas fa-plus mr-2"></i>
          Add Building
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="flex-shrink-0 px-4 sm:px-6 py-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i class="fas fa-building text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Buildings</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalBuildings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <i class="fas fa-door-open text-green-600 dark:text-green-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rooms</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalRooms }}</p>
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
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Capacity</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalCapacity }}</p>
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
              placeholder="Search buildings..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        <select
          v-model="filterType"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="academic">Academic</option>
          <option value="administrative">Administrative</option>
          <option value="sports">Sports</option>
          <option value="library">Library</option>
          <option value="residential">Residential</option>
          <option value="mixed">Mixed</option>
          <option value="other">Other</option>
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
        <p class="text-gray-600 dark:text-gray-400">Loading buildings...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-red-500 text-5xl mb-4">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Buildings</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="loadBuildings"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-redo mr-2"></i>
          Retry
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="buildings.length === 0" class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-gray-300 dark:text-gray-700 text-6xl mb-4">
          <i class="fas fa-building"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Buildings Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ searchQuery ? 'No buildings match your search criteria.' : 'Get started by adding your first building.' }}
        </p>
        <button
          v-if="hasCreatePermission && !searchQuery"
          @click="showBuildingModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Add First Building
        </button>
      </div>
    </div>

    <!-- Buildings Table -->
    <div v-else class="flex-1 overflow-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900 sticky top-0">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Floors
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Rooms
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Capacity
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
          <tr v-for="building in paginatedBuildings" :key="building.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ building.name }}</div>
                <div v-if="building.address" class="text-sm text-gray-500 dark:text-gray-400">{{ building.address }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getBuildingTypeClass(building.building_type)">
                {{ formatBuildingType(building.building_type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ building.total_floors }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ building.room_count || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ building.total_capacity || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="building.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'">
                {{ building.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-2">
                <button
                  @click="viewBuilding(building)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="hasUpdatePermission"
                  @click="editBuilding(building)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  v-if="hasDeletePermission"
                  @click="confirmDeleteBuilding(building)"
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
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} buildings
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

    <!-- Building Modal -->
    <BuildingModal
      v-if="showBuildingModal"
      :building="selectedBuilding"
      @close="closeBuildingModal"
      @saved="onBuildingSaved"
    />

    <!-- Building Details Modal -->
    <BuildingDetails
      v-if="showDetailsModal"
      :building="selectedBuilding"
      @close="showDetailsModal = false"
      @edit="editBuilding"
    />

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      v-if="showDeleteConfirm"
      ref="deleteConfirmDialog"
      title="Delete Building"
      :message="`Are you sure you want to delete '${buildingToDelete?.name}'? This action cannot be undone.`"
      confirmText="Delete"
      confirmIcon="fas fa-trash"
      @confirm="deleteBuilding"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { locationService } from '@/services/locationService.js'
import { useToast } from '@/utils/useToast.js'
import { UserService } from '@/services/userService.js'
import BuildingModal from './BuildingModal.vue'
import BuildingDetails from './BuildingDetails.vue'
import ConfirmationDialog from '../ConfirmationDialog.vue'

const toast = useToast()

// State
const buildings = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const filterType = ref('')
const showActiveOnly = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

// Modal state
const showBuildingModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedBuilding = ref(null)
const buildingToDelete = ref(null)
const deleteConfirmDialog = ref(null)

// Stats
const stats = reactive({
  totalBuildings: 0,
  totalRooms: 0,
  totalCapacity: 0
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

// Specific permission checkers for locations
const hasCreatePermission = computed(() => hasPermission('locations_create'))
const hasUpdatePermission = computed(() => hasPermission('locations_update'))
const hasDeletePermission = computed(() => hasPermission('locations_delete'))

// Computed
const filteredBuildings = computed(() => {
  let result = [...buildings.value]

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(b =>
      b.name.toLowerCase().includes(search) ||
      (b.address && b.address.toLowerCase().includes(search))
    )
  }

  if (filterType.value) {
    result = result.filter(b => b.building_type === filterType.value)
  }

  if (showActiveOnly.value) {
    result = result.filter(b => b.is_active)
  }

  totalItems.value = result.length
  return result
})

const paginatedBuildings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBuildings.value.slice(start, end)
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
const loadBuildings = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await locationService.getBuildings({
      status: showActiveOnly.value ? 'active' : 'all',
      building_type: filterType.value,
      search: searchQuery.value
    })

    buildings.value = response.data || []

    // Calculate stats
    stats.totalBuildings = buildings.value.filter(b => b.is_active).length
    stats.totalRooms = buildings.value.reduce((sum, b) => sum + (b.room_count || 0), 0)
    stats.totalCapacity = buildings.value.reduce((sum, b) => sum + (b.total_capacity || 0), 0)

  } catch (err) {
    error.value = err.message
    toast.error('Failed to load buildings')
  } finally {
    loading.value = false
  }
}

const viewBuilding = (building) => {
  selectedBuilding.value = building
  showDetailsModal.value = true
}

const editBuilding = (building) => {
  selectedBuilding.value = building
  showDetailsModal.value = false
  showBuildingModal.value = true
}

const closeBuildingModal = () => {
  showBuildingModal.value = false
  selectedBuilding.value = null
}

const onBuildingSaved = () => {
  closeBuildingModal()
  loadBuildings()
  toast.success('Building saved successfully')
}

const confirmDeleteBuilding = (building) => {
  buildingToDelete.value = building
  showDeleteConfirm.value = true
  // Open the dialog using the ref
  setTimeout(() => {
    if (deleteConfirmDialog.value) {
      deleteConfirmDialog.value.open()
    }
  }, 100)
}

const deleteBuilding = async () => {
  try {
    await locationService.deleteBuilding(buildingToDelete.value.id)
    showDeleteConfirm.value = false
    buildingToDelete.value = null
    loadBuildings()
    toast.success('Building deleted successfully')
  } catch (err) {
    toast.error(err.message || 'Failed to delete building')
  }
}

const getBuildingTypeClass = (type) => {
  const classes = {
    academic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    administrative: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    library: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    residential: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    mixed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
  return classes[type] || classes.other
}

const formatBuildingType = (type) => {
  return locationService.formatBuildingType(type)
}

// Watchers
let searchTimeout
watch([searchQuery, filterType, showActiveOnly], () => {
  currentPage.value = 1

  // Debounce search queries
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadBuildings()
  }, 300)
})

// Lifecycle
onMounted(() => {
  loadBuildings()
})
</script>
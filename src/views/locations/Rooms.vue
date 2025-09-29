<template>
  <div class="rooms-view h-full flex flex-col">
    <!-- Header -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Rooms</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage rooms across your buildings</p>
        </div>
        <button
          @click="showRoomModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          v-if="hasCreatePermission && selectedBuildingId"
        >
          <i class="fas fa-plus mr-2"></i>
          Add Room
        </button>
      </div>
    </div>

    <!-- Building Selector -->
    <div class="flex-shrink-0 px-4 sm:px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <i class="fas fa-building text-blue-600 dark:text-blue-400"></i>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Building:</label>
        </div>
        <select
          v-model="selectedBuildingId"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 max-w-md"
          @change="onBuildingChange"
        >
          <option value="">Select a building...</option>
          <option
            v-for="building in buildings"
            :key="building.id"
            :value="building.id"
          >
            {{ building.name }} ({{ building.room_count || 0 }} rooms)
          </option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="selectedBuildingId" class="flex-shrink-0 px-4 sm:px-6 py-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div class="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i class="fas fa-users text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Capacity</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalCapacity }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <i class="fas fa-layer-group text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Floors</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalFloors }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <i class="fas fa-check-circle text-orange-600 dark:text-orange-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Available</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.availableRooms }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="selectedBuildingId" class="flex-shrink-0 px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search rooms..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        <select
          v-model="filterFloor"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Floors</option>
          <option
            v-for="floor in availableFloors"
            :key="floor"
            :value="floor"
          >
            Floor {{ floor }}
          </option>
        </select>
        <select
          v-model="filterType"
          :disabled="loadingRoomTypes"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <option value="">{{ loadingRoomTypes ? 'Loading types...' : 'All Types' }}</option>
          <option
            v-for="type in roomTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>
        <label class="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <input
            type="checkbox"
            v-model="showActiveOnly"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded"
          >
          <span class="text-sm">Active Only</span>
        </label>
      </div>
    </div>

    <!-- No Building Selected -->
    <div v-if="!selectedBuildingId" class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-gray-300 dark:text-gray-700 text-6xl mb-4">
          <i class="fas fa-building"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Building</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Choose a building from the dropdown above to view and manage its rooms.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading rooms...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-red-500 text-5xl mb-4">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Rooms</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="loadRooms"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <i class="fas fa-redo mr-2"></i>
          Retry
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="rooms.length === 0" class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-gray-300 dark:text-gray-700 text-6xl mb-4">
          <i class="fas fa-door-open"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Rooms Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ searchQuery ? 'No rooms match your search criteria.' : 'This building has no rooms yet. Add the first room to get started.' }}
        </p>
        <button
          v-if="hasCreatePermission && !searchQuery"
          @click="showRoomModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Add First Room
        </button>
      </div>
    </div>

    <!-- Rooms Table -->
    <div v-else class="flex-1 overflow-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900 sticky top-0">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Room Number/Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Floor
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Capacity
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Area
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Features
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="room in paginatedRooms" :key="room.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ room.room_name ? `${room.room_number} / ${room.room_name}` : room.room_number }}
              </div>
            </td>
            <td class="px-6 py-4 max-w-xs">
              <div class="text-sm text-gray-900 dark:text-white" :title="room.description">
                {{ room.description ? (room.description.length > 50 ? room.description.substring(0, 50) + '...' : room.description) : '-' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getRoomTypeClass(room.room_type)">
                {{ formatRoomType(room.room_type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ room.floor_number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ room.capacity || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ room.area_sqft ? `${room.area_sqft} sq ft` : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="room.features && room.features.length > 0" class="flex flex-wrap gap-1">
                <span
                  v-for="feature in formatFeatures(room.features).slice(0, 2)"
                  :key="feature"
                  class="inline-flex px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                >
                  {{ feature }}
                </span>
                <span
                  v-if="formatFeatures(room.features).length > 2"
                  class="inline-flex px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                  :title="formatFeatures(room.features).slice(2).join(', ')"
                >
                  +{{ formatFeatures(room.features).length - 2 }}
                </span>
              </div>
              <span v-else class="text-sm text-gray-500 dark:text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-2">
                <button
                  @click="viewRoom(room)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="hasUpdatePermission"
                  @click="editRoom(room)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  v-if="hasDeletePermission"
                  @click="confirmDeleteRoom(room)"
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
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} rooms
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
            :class="currentPage === page ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'"
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

    <!-- Room Modal -->
    <RoomModal
      v-if="showRoomModal && selectedBuilding"
      :building="selectedBuilding"
      :room="selectedRoom"
      @close="closeRoomModal"
      @saved="onRoomSaved"
    />

    <!-- Room Details Modal -->
    <RoomDetailsModal
      v-if="showRoomDetailsModal"
      :room="selectedRoom"
      :building="selectedBuilding"
      @close="showRoomDetailsModal = false"
      @edit="editRoom"
    />

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      v-if="showDeleteConfirm"
      ref="deleteConfirmDialog"
      title="Delete Room"
      :message="`Are you sure you want to delete room '${roomToDelete?.room_name || roomToDelete?.room_number}'? This action cannot be undone.`"
      confirmText="Delete"
      confirmIcon="fas fa-trash"
      @confirm="deleteRoom"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { locationService } from '@/services/locationService.js'
import { useToast } from '@/utils/useToast.js'
import { UserService } from '@/services/userService.js'
import RoomModal from '@/components/locations/RoomModal.vue'
import RoomDetailsModal from '@/components/locations/RoomDetailsModal.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

const toast = useToast()

// State
const buildings = ref([])
const rooms = ref([])
const selectedBuildingId = ref('')
const selectedBuilding = ref(null)
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const filterFloor = ref('')
const filterType = ref('')
const showActiveOnly = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

// Modal state
const showRoomModal = ref(false)
const showRoomDetailsModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedRoom = ref(null)
const roomToDelete = ref(null)
const deleteConfirmDialog = ref(null)

// Room types from service
const roomTypes = ref([])
const loadingRoomTypes = ref(false)

// Stats
const stats = reactive({
  totalRooms: 0,
  totalCapacity: 0,
  totalFloors: 0,
  availableRooms: 0
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
const availableFloors = computed(() => {
  const floors = [...new Set(rooms.value.map(room => room.floor_number))].sort((a, b) => a - b)
  return floors
})

const filteredRooms = computed(() => {
  let result = [...rooms.value]

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(r =>
      (r.room_name && r.room_name.toLowerCase().includes(search)) ||
      r.room_number.toLowerCase().includes(search) ||
      (r.description && r.description.toLowerCase().includes(search))
    )
  }

  if (filterFloor.value) {
    result = result.filter(r => r.floor_number === parseInt(filterFloor.value))
  }

  if (filterType.value) {
    result = result.filter(r => r.room_type === filterType.value)
  }

  // Active filtering is now done at API level, no need for client-side filtering

  totalItems.value = result.length
  return result.sort((a, b) => {
    if (a.floor_number !== b.floor_number) {
      return a.floor_number - b.floor_number
    }
    return a.room_number.localeCompare(b.room_number)
  })
})

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRooms.value.slice(start, end)
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
  try {
    const response = await locationService.getBuildings({ status: 'active' })
    buildings.value = response.data || []

    // Check if there's a building ID in session storage (from building details navigation)
    const storedBuildingId = sessionStorage.getItem('selectedBuildingId')
    if (storedBuildingId) {
      // Convert to number if building IDs are numbers, keep as string if they're strings
      const buildingIdToUse = buildings.value.find(b => String(b.id) === storedBuildingId)?.id
      if (buildingIdToUse) {
        selectedBuildingId.value = buildingIdToUse
        sessionStorage.removeItem('selectedBuildingId')
      } else if (buildings.value.length > 0) {
        // Auto-select first building if stored ID not found
        selectedBuildingId.value = buildings.value[0].id
      }
    } else if (buildings.value.length > 0 && !selectedBuildingId.value) {
      // Auto-select first building if none selected
      selectedBuildingId.value = buildings.value[0].id
    }
  } catch (err) {
    toast.error('Failed to load buildings')
  }
}

const loadRooms = async () => {
  if (!selectedBuildingId.value) {
    rooms.value = []
    return
  }

  loading.value = true
  error.value = null

  try {
    // Pass status filter to API
    const params = {
      status: showActiveOnly.value ? 'active' : 'all'
    }
    const response = await locationService.getRooms(selectedBuildingId.value, params)
    rooms.value = response.data || []

    // Calculate stats
    stats.totalRooms = rooms.value.length
    stats.totalCapacity = rooms.value.reduce((sum, r) => sum + (r.capacity || 0), 0)
    stats.totalFloors = new Set(rooms.value.map(r => r.floor_number)).size
    stats.availableRooms = rooms.value.filter(r => r.is_active !== false).length

  } catch (err) {
    error.value = err.message
    toast.error('Failed to load rooms')
  } finally {
    loading.value = false
  }
}

const onBuildingChange = () => {
  selectedBuilding.value = buildings.value.find(b => b.id === selectedBuildingId.value)
  currentPage.value = 1
  loadRooms()
}

const viewRoom = (room) => {
  selectedRoom.value = room
  showRoomDetailsModal.value = true
}

const editRoom = (room) => {
  selectedRoom.value = room
  showRoomDetailsModal.value = false
  showRoomModal.value = true
}

const closeRoomModal = () => {
  showRoomModal.value = false
  selectedRoom.value = null
}

const onRoomSaved = () => {
  closeRoomModal()
  loadRooms()
  toast.success('Room saved successfully')
}

const confirmDeleteRoom = (room) => {
  roomToDelete.value = room
  showDeleteConfirm.value = true
  // Open the dialog using the ref
  setTimeout(() => {
    if (deleteConfirmDialog.value) {
      deleteConfirmDialog.value.open()
    }
  }, 100)
}

const deleteRoom = async () => {
  try {
    await locationService.deleteRoom(selectedBuildingId.value, roomToDelete.value.id)
    showDeleteConfirm.value = false
    roomToDelete.value = null
    loadRooms()
    toast.success('Room deleted successfully')
  } catch (err) {
    toast.error(err.message || 'Failed to delete room')
  }
}

const getRoomTypeClass = (type) => {
  const classes = {
    classroom: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    laboratory: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    auditorium: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    conference_room: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    office: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    library: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cafeteria: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    gymnasium: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    storage: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    restroom: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
  return classes[type] || classes.other
}

const getRoomStatusClass = (status) => {
  const classes = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    occupied: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status] || classes.available
}

const formatRoomType = (type) => {
  return locationService.formatRoomType(type)
}

const formatRoomStatus = (status) => {
  if (!status) return 'Available'
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}

const formatFeatures = (features) => {
  if (!features) return []
  if (Array.isArray(features)) {
    return features
  }
  if (typeof features === 'string') {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(features)
      return Array.isArray(parsed) ? parsed : [features]
    } catch {
      // If not JSON, treat as comma-separated string
      return features.split(',').map(f => f.trim()).filter(Boolean)
    }
  }
  return []
}

// Watchers
let searchTimeout
watch([searchQuery, filterFloor, filterType], () => {
  currentPage.value = 1

  // Debounce search queries
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // No need to reload from API, filtering is done client-side for these filters
  }, 300)
})

// Watch showActiveOnly separately to reload from API
watch(showActiveOnly, () => {
  currentPage.value = 1
  loadRooms()
})

watch(selectedBuildingId, () => {
  onBuildingChange()
})

// Load room types from API
const loadRoomTypes = async () => {
  loadingRoomTypes.value = true
  try {
    roomTypes.value = await locationService.getRoomTypes()
  } catch (error) {
    console.error('Failed to load room types:', error)
    // Use fallback values
    roomTypes.value = locationService.getFallbackRoomTypes()
  } finally {
    loadingRoomTypes.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadRoomTypes(),
    loadBuildings()
  ])
})
</script>
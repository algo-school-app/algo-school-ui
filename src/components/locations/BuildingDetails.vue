<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i class="fas fa-building text-blue-600 dark:text-blue-400"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ building?.name || 'Building Details' }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatBuildingType(building?.building_type) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="handleEdit"
              class="px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
              title="Edit Building"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-80px)]">
        <!-- Loading State -->
        <div v-if="loadingDetails" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Loading building details...</p>
        </div>

        <!-- Building Information -->
        <div v-else class="p-6 space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Building Name
                </label>
                <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  {{ buildingDetails?.name || 'N/A' }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getBuildingTypeClass(buildingDetails?.building_type)">
                  {{ formatBuildingType(buildingDetails?.building_type) }}
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Floors
                </label>
                <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  {{ buildingDetails?.total_floors || 'N/A' }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="buildingDetails?.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'">
                  {{ buildingDetails?.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div v-if="buildingDetails?.address">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  {{ buildingDetails.address }}
                </p>
              </div>

              <div v-if="buildingDetails?.description">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  {{ buildingDetails.description }}
                </p>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ buildingDetails?.room_count || 0 }}</p>
                  <p class="text-sm text-blue-700 dark:text-blue-300">Rooms</p>
                </div>
                <div class="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ buildingDetails?.total_capacity || 0 }}</p>
                  <p class="text-sm text-green-700 dark:text-green-300">Total Capacity</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <div v-if="(buildingDetails?.amenities && buildingDetails.amenities.length > 0) || (props.building?.amenities && props.building.amenities.length > 0)">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="amenity in (buildingDetails?.amenities || props.building?.amenities || [])"
                :key="amenity"
                class="inline-flex px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {{ formatAmenityLabel(amenity) }}
              </span>
            </div>
          </div>

          <!-- Navigation to Rooms -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-door-open text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">Room Management</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Manage rooms for this building in the dedicated rooms section
                  </p>
                </div>
              </div>
              <button
                @click="navigateToRooms"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <i class="fas fa-arrow-right mr-2"></i>
                View Rooms
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
import { useRouter } from 'vue-router'
import { locationService } from '@/services/locationService.js'
import { useToast } from '@/utils/useToast.js'

const router = useRouter()
const toast = useToast()

// Props
const props = defineProps({
  building: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'edit'])

// State
const buildingDetails = ref(null)
const loadingDetails = ref(false)
const amenityLabels = ref({})

// Methods
const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  handleClose()
}

const handleEdit = () => {
  emit('edit', buildingDetails.value || props.building)
}

const navigateToRooms = () => {
  // Store the selected building ID in session storage for the rooms view (as string)
  sessionStorage.setItem('selectedBuildingId', String(props.building.id))
  // Navigate to rooms view
  router.push('/dashboard/rooms')
  // Close the modal
  handleClose()
}

const loadBuildingDetails = async () => {
  loadingDetails.value = true

  try {
    const response = await locationService.getBuilding(props.building.id)
    buildingDetails.value = response
  } catch (err) {
    toast.error('Failed to load building details')
    buildingDetails.value = props.building
  } finally {
    loadingDetails.value = false
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

const formatAmenityLabel = (amenityValue) => {
  // Check if we have a cached label for this value
  return amenityLabels.value[amenityValue] || amenityValue
}

const loadAmenityLabels = async () => {
  try {
    const amenities = await locationService.getBuildingAmenities()
    // Create a lookup map from value to label
    amenityLabels.value = amenities.reduce((acc, amenity) => {
      acc[amenity.value] = amenity.label
      return acc
    }, {})
  } catch (error) {
    console.warn('Failed to load amenity labels:', error)
    // Will use raw values as fallback
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadBuildingDetails(),
    loadAmenityLabels()
  ])
})
</script>
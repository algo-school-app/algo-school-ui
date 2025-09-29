<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <i class="fas fa-door-open text-green-600 dark:text-green-400"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ room?.room_name || `Room ${room?.room_number}` || 'Room Details' }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ building?.name }} - Floor {{ room?.floor_number }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="handleEdit"
              class="px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
              title="Edit Room"
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
      <div class="overflow-y-auto max-h-[calc(80vh-80px)] p-6 space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Name
              </label>
              <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                {{ room?.room_name || 'N/A' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Number
              </label>
              <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                {{ room?.room_number || 'N/A' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Floor Number
              </label>
              <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                {{ room?.floor_number || 'N/A' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Type
              </label>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getRoomTypeClass(room?.room_type)">
                {{ formatRoomType(room?.room_type) }}
              </span>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacity
              </label>
              <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                {{ room?.capacity || 'N/A' }} people
              </p>
            </div>

            <div v-if="room?.area_sqft">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Area
              </label>
              <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                {{ room.area_sqft }} sq ft
              </p>
            </div>

            <div v-if="room?.status">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getRoomStatusClass(room?.status)">
                {{ formatRoomStatus(room?.status) }}
              </span>
            </div>

            <div v-if="room?.accessibility_features && room.accessibility_features.length > 0">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Accessibility
              </label>
              <div class="bg-green-50 dark:bg-green-900 px-3 py-2 rounded-lg">
                <i class="fas fa-wheelchair text-green-600 dark:text-green-400 mr-2"></i>
                <span class="text-green-800 dark:text-green-200 text-sm">Accessible</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="room?.description">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
            {{ room.description }}
          </p>
        </div>

        <!-- Features -->
        <div v-if="room?.features && room.features.length > 0">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Features
          </label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="feature in room.features"
              :key="feature"
              class="inline-flex px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              {{ formatFeatureLabel(feature) }}
            </span>
          </div>
        </div>

        <!-- Equipment -->
        <div v-if="room?.equipment && room.equipment.length > 0">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Equipment
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="item in room.equipment"
              :key="item"
              class="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg flex items-center"
            >
              <i class="fas fa-tools text-gray-600 dark:text-gray-400 mr-2"></i>
              <span class="text-gray-900 dark:text-white text-sm">{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- Accessibility Features -->
        <div v-if="room?.accessibility_features && room.accessibility_features.length > 0">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Accessibility Features
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="feature in room.accessibility_features"
              :key="feature"
              class="bg-green-50 dark:bg-green-900 px-3 py-2 rounded-lg flex items-center"
            >
              <i class="fas fa-universal-access text-green-600 dark:text-green-400 mr-2"></i>
              <span class="text-green-800 dark:text-green-200 text-sm">{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div v-if="room?.created_at" class="text-sm">
            <span class="text-gray-600 dark:text-gray-400">Created:</span>
            <span class="text-gray-900 dark:text-white ml-2">
              {{ new Date(room.created_at).toLocaleDateString() }}
            </span>
          </div>
          <div v-if="room?.updated_at" class="text-sm">
            <span class="text-gray-600 dark:text-gray-400">Last Updated:</span>
            <span class="text-gray-900 dark:text-white ml-2">
              {{ new Date(room.updated_at).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { locationService } from '@/services/locationService.js'

// Props
const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  building: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'edit'])

// State
const featureLabels = ref({})

// Methods
const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  handleClose()
}

const handleEdit = () => {
  emit('edit', props.room)
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

const formatFeatureLabel = (featureValue) => {
  // Check if we have a cached label for this value
  return featureLabels.value[featureValue] || featureValue
}

const loadFeatureLabels = async () => {
  try {
    const features = await locationService.getRoomFeatures()
    // Create a lookup map from value to label
    featureLabels.value = features.reduce((acc, feature) => {
      acc[feature.value] = feature.label
      return acc
    }, {})
  } catch (error) {
    console.warn('Failed to load feature labels:', error)
    // Will use raw values as fallback
  }
}

// Lifecycle
onMounted(async () => {
  await loadFeatureLabels()
})
</script>
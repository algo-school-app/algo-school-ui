<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Room' : 'Add New Room' }}
          </h2>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Building: {{ building?.name }}
        </p>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Floor and Room Number -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Floor Number *
              </label>
              <select
                v-model.number="form.floor_number"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select floor</option>
                <option
                  v-for="floor in availableFloors"
                  :key="floor"
                  :value="floor"
                >
                  Floor {{ floor }}
                </option>
              </select>
              <p v-if="errors.floor_number" class="text-red-500 text-sm mt-1">{{ errors.floor_number }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room Number *
              </label>
              <input
                v-model="form.room_number"
                type="text"
                required
                maxlength="20"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 101, A-101"
              >
              <p v-if="errors.room_number" class="text-red-500 text-sm mt-1">{{ errors.room_number }}</p>
            </div>
          </div>

          <!-- Room Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Name
            </label>
            <input
              v-model="form.room_name"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Computer Lab, Conference Room A"
            >
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              maxlength="500"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Brief description of the room, its purpose, or special characteristics..."
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optional. Maximum 500 characters.
            </p>
          </div>

          <!-- Room Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type *
            </label>
            <select
              v-model="form.room_type"
              required
              :disabled="loadingTypes"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">{{ loadingTypes ? 'Loading types...' : 'Select room type' }}</option>
              <option
                v-for="type in roomTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
            <p v-if="errors.room_type" class="text-red-500 text-sm mt-1">{{ errors.room_type }}</p>
          </div>

          <!-- Capacity and Area -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacity *
              </label>
              <input
                v-model.number="form.capacity"
                type="number"
                min="1"
                max="1000"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Number of people"
              >
              <p v-if="errors.capacity" class="text-red-500 text-sm mt-1">{{ errors.capacity }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Area (sq ft)
              </label>
              <input
                v-model.number="form.area_sqft"
                type="number"
                min="1"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Square feet"
              >
            </div>
          </div>

          <!-- Features -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Features
            </label>
            <div class="space-y-4">
              <!-- Available Features Multi-Select -->
              <div v-if="!loadingFeatures">
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Select from available features:
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <label
                    v-for="feature in availableFeatures"
                    :key="feature.value"
                    class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      :value="feature.value"
                      v-model="form.features"
                      class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ feature.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loadingFeatures" class="text-center py-4">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading features...</p>
              </div>

              <!-- Selected Features Display -->
              <div v-if="form.features && form.features.length > 0">
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Selected features:
                </label>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(feature, index) in form.features"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                  >
                    {{ getFeatureLabel(feature) }}
                    <button
                      type="button"
                      @click="removeFeature(index)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      <i class="fas fa-times text-xs"></i>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>


          <!-- Status -->
          <div>
            <label class="flex items-center gap-2">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              >
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active
              </span>
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Inactive rooms will be hidden from most views
            </p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            :disabled="saving || !isValid"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <i v-if="saving" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ saving ? 'Saving...' : (isEditing ? 'Update Room' : 'Create Room') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { locationService } from '@/services/locationService.js'
import { useToast } from '@/utils/useToast.js'

const toast = useToast()

// Props
const props = defineProps({
  building: {
    type: Object,
    required: true
  },
  room: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'saved'])

// State
const saving = ref(false)
const roomTypes = ref([])
const availableFeatures = ref([])
const loadingTypes = ref(false)
const loadingFeatures = ref(false)

// Form data
const form = reactive({
  floor_number: '',
  room_number: '',
  room_name: '',
  description: '',
  room_type: '',
  capacity: '',
  area_sqft: '',
  features: [],
  is_active: true
})

// Validation errors
const errors = reactive({
  floor_number: '',
  room_number: '',
  room_type: '',
  capacity: ''
})

// Computed
const isEditing = computed(() => !!props.room)

const availableFloors = computed(() => {
  const floors = []
  for (let i = 0; i <= props.building.total_floors; i++) {
    floors.push(i)
  }
  return floors
})

const isValid = computed(() => {
  return form.floor_number !== '' &&
         form.room_number.trim() &&
         form.room_type &&
         form.capacity >= 1
})

// Methods
const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  handleClose()
}

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Validate floor number
  if (form.floor_number === '' || form.floor_number < 0 || form.floor_number > props.building.total_floors) {
    errors.floor_number = `Floor number must be between 0 and ${props.building.total_floors}`
    isValid = false
  }

  // Validate room number
  if (!form.room_number || !form.room_number.trim()) {
    errors.room_number = 'Room number is required'
    isValid = false
  }

  // Validate room type
  if (!form.room_type) {
    errors.room_type = 'Room type is required'
    isValid = false
  }

  // Validate capacity
  if (!form.capacity || form.capacity < 1) {
    errors.capacity = 'Capacity must be at least 1'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true

  try {
    const roomData = {
      floor_number: form.floor_number,
      room_number: form.room_number.trim(),
      room_name: form.room_name?.trim() || null,
      description: form.description?.trim() || null,
      room_type: form.room_type,
      capacity: form.capacity,
      area_sqft: form.area_sqft || null,
      features: form.features || [],
      is_active: form.is_active
    }

    // Debug: Log what we're sending
    console.log('Sending room data:', roomData)

    if (isEditing.value) {
      await locationService.updateRoom(props.building.id, props.room.id, roomData)
    } else {
      await locationService.createRoom(props.building.id, roomData)
    }

    emit('saved')
  } catch (err) {
    toast.error(err.message || 'Failed to save room')
  } finally {
    saving.value = false
  }
}

const removeFeature = (index) => {
  form.features.splice(index, 1)
}


const loadRoomTypes = async () => {
  loadingTypes.value = true
  try {
    roomTypes.value = await locationService.getRoomTypes()
  } catch (error) {
    console.error('Failed to load room types:', error)
    toast.error('Failed to load room types. Please refresh the page.')
  } finally {
    loadingTypes.value = false
  }
}

const loadRoomFeatures = async () => {
  loadingFeatures.value = true
  try {
    availableFeatures.value = await locationService.getRoomFeatures()
  } catch (error) {
    console.error('Failed to load room features:', error)
    toast.error('Failed to load room features. Please refresh the page.')
  } finally {
    loadingFeatures.value = false
  }
}

const getFeatureLabel = (value) => {
  const feature = availableFeatures.value.find(f => f.value === value)
  return feature ? feature.label : value
}

const populateForm = () => {
  if (props.room) {
    form.floor_number = props.room.floor_number
    form.room_number = props.room.room_number || ''
    form.room_name = props.room.room_name || ''
    form.description = props.room.description || ''
    form.room_type = props.room.room_type || ''
    form.capacity = props.room.capacity || ''
    form.area_sqft = props.room.area_sqft || ''
    form.features = [...(props.room.features || [])]
    form.is_active = props.room.is_active !== false
  }
}

// Watchers
watch(() => props.room, populateForm, { immediate: true })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadRoomTypes(),
    loadRoomFeatures()
  ])
  populateForm()
})
</script>
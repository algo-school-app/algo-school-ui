<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Building' : 'Add New Building' }}
          </h2>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Building Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Building Name *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter building name"
            >
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Building Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Building Type *
            </label>
            <select
              v-model="form.building_type"
              required
              :disabled="loadingTypes"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">{{ loadingTypes ? 'Loading types...' : 'Select building type' }}</option>
              <option
                v-for="type in buildingTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
            <p v-if="errors.building_type" class="text-red-500 text-sm mt-1">{{ errors.building_type }}</p>
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
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter building description"
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ form.description?.length || 0 }}/500 characters
            </p>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <input
              v-model="form.address"
              type="text"
              maxlength="255"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter building address"
            >
          </div>

          <!-- Total Floors -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Floors *
            </label>
            <input
              v-model.number="form.total_floors"
              type="number"
              min="1"
              max="100"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of floors"
            >
            <p v-if="errors.total_floors" class="text-red-500 text-sm mt-1">{{ errors.total_floors }}</p>
          </div>

          <!-- Amenities -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div class="space-y-4">
              <!-- Available Amenities Multi-Select -->
              <div v-if="!loadingAmenities">
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Select from available amenities:
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <label
                    v-for="amenity in availableAmenities"
                    :key="amenity.value"
                    class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      :value="amenity.value"
                      v-model="form.amenities"
                      class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ amenity.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loadingAmenities" class="text-center py-4">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading amenities...</p>
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
              Inactive buildings will be hidden from most views
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
            {{ saving ? 'Saving...' : (isEditing ? 'Update Building' : 'Create Building') }}
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
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'saved'])

// State
const saving = ref(false)
const buildingTypes = ref([])
const availableAmenities = ref([])
const loadingTypes = ref(false)
const loadingAmenities = ref(false)

// Form data
const form = reactive({
  name: '',
  building_type: '',
  description: '',
  address: '',
  total_floors: 1,
  amenities: [],
  is_active: true
})

// Validation errors
const errors = reactive({
  name: '',
  building_type: '',
  total_floors: ''
})

// Computed
const isEditing = computed(() => !!props.building)

const isValid = computed(() => {
  return form.name.trim().length >= 2 &&
         form.building_type &&
         form.total_floors >= 1 &&
         form.total_floors <= 100
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

  // Validate name
  if (!form.name || form.name.trim().length < 2) {
    errors.name = 'Building name must be at least 2 characters'
    isValid = false
  }

  // Validate building type
  if (!form.building_type) {
    errors.building_type = 'Building type is required'
    isValid = false
  }

  // Validate total floors
  if (!form.total_floors || form.total_floors < 1 || form.total_floors > 100) {
    errors.total_floors = 'Total floors must be between 1 and 100'
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
    const buildingData = {
      name: form.name.trim(),
      building_type: form.building_type,
      description: form.description?.trim() || null,
      address: form.address?.trim() || null,
      total_floors: form.total_floors,
      amenities: form.amenities || [],
      is_active: form.is_active
    }

    if (isEditing.value) {
      await locationService.updateBuilding(props.building.id, buildingData)
    } else {
      await locationService.createBuilding(buildingData)
    }

    emit('saved')
  } catch (err) {
    toast.error(err.message || 'Failed to save building')
  } finally {
    saving.value = false
  }
}

const loadBuildingTypes = async () => {
  loadingTypes.value = true
  try {
    buildingTypes.value = await locationService.getBuildingTypes()
  } catch (error) {
    console.error('Failed to load building types:', error)
    toast.error('Failed to load building types. Please refresh the page.')
  } finally {
    loadingTypes.value = false
  }
}

const loadBuildingAmenities = async () => {
  loadingAmenities.value = true
  try {
    availableAmenities.value = await locationService.getBuildingAmenities()
  } catch (error) {
    console.error('Failed to load building amenities:', error)
    toast.error('Failed to load building amenities. Please refresh the page.')
  } finally {
    loadingAmenities.value = false
  }
}

const populateForm = () => {
  if (props.building) {
    form.name = props.building.name || ''
    form.building_type = props.building.building_type || ''
    form.description = props.building.description || ''
    form.address = props.building.address || ''
    form.total_floors = props.building.total_floors || 1
    // Ensure amenities is always an array
    form.amenities = Array.isArray(props.building.amenities) ? [...props.building.amenities] : []
    form.is_active = props.building.is_active !== false
  } else {
    // Reset form for new building
    form.name = ''
    form.building_type = ''
    form.description = ''
    form.address = ''
    form.total_floors = 1
    form.amenities = []
    form.is_active = true
  }
}

// Watchers
watch(() => props.building, populateForm, { immediate: true })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadBuildingTypes(),
    loadBuildingAmenities()
  ])
  populateForm()
})
</script>
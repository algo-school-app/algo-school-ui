<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Class' : 'Add New Class' }}
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
          <!-- Class Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class Name *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter class name"
            >
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Course Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course *
            </label>
            <select
              v-model="form.course_id"
              required
              :disabled="loadingCourses"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">{{ loadingCourses ? 'Loading courses...' : 'Select course' }}</option>
              <option
                v-for="course in availableCourses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.name }} ({{ course.code }})
              </option>
            </select>
            <p v-if="errors.course_id" class="text-red-500 text-sm mt-1">{{ errors.course_id }}</p>
          </div>

          <!-- Room Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room
            </label>
            <select
              v-model="form.room_id"
              :disabled="loadingRooms"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">{{ loadingRooms ? 'Loading rooms...' : 'Select room (optional)' }}</option>
              <option
                v-for="room in availableRooms"
                :key="room.id"
                :value="room.id"
              >
                {{ room.name }} ({{ room.building_name }})
              </option>
            </select>
            <p v-if="errors.room_id" class="text-red-500 text-sm mt-1">{{ errors.room_id }}</p>
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
              placeholder="Enter class description"
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ form.description?.length || 0 }}/500 characters
            </p>
          </div>

          <!-- Schedule Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                v-model="form.start_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <!-- End Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                v-model="form.end_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Schedule Days -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Schedule Days
            </label>
            <div class="grid grid-cols-7 gap-2">
              <label v-for="day in daysOfWeek" :key="day.value" class="flex items-center">
                <input
                  type="checkbox"
                  :value="day.value"
                  v-model="form.schedule_days"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ day.label }}</span>
              </label>
            </div>
          </div>

          <!-- Time -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                v-model="form.start_time"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <!-- End Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                v-model="form.end_time"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Maximum Students -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Students
            </label>
            <input
              v-model.number="form.max_students"
              type="number"
              min="1"
              max="200"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter maximum number of students"
            >
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave empty for unlimited
            </p>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input
              v-model="form.is_active"
              type="checkbox"
              id="is_active"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            >
            <label for="is_active" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
            <p class="ml-2 text-xs text-gray-500 dark:text-gray-400">
              Inactive classes are hidden from students
            </p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="saving"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
          {{ saving ? 'Saving...' : (isEditing ? 'Update Class' : 'Create Class') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { classService } from '@/services/classService.js'
import { useToast } from '@/utils/useToast.js'

const toast = useToast()

const props = defineProps({
  classData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

// State
const saving = ref(false)
const loadingCourses = ref(false)
const loadingRooms = ref(false)
const availableCourses = ref([])
const availableRooms = ref([])

// Form data
const form = reactive({
  name: '',
  course_id: '',
  room_id: '',
  description: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  schedule_days: [],
  max_students: null,
  is_active: true
})

// Form errors
const errors = reactive({
  name: '',
  course_id: '',
  room_id: ''
})

// Days of week options
const daysOfWeek = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' }
]

// Computed
const isEditing = computed(() => props.classData && props.classData.id)

// Methods
const initializeForm = () => {
  if (props.classData) {
    // Editing existing class
    Object.assign(form, {
      name: props.classData.name || '',
      course_id: props.classData.course_id || '',
      room_id: props.classData.room_id || '',
      description: props.classData.description || '',
      start_date: props.classData.start_date || '',
      end_date: props.classData.end_date || '',
      start_time: props.classData.start_time || '',
      end_time: props.classData.end_time || '',
      schedule_days: props.classData.schedule_days || [],
      max_students: props.classData.max_students || null,
      is_active: props.classData.is_active !== undefined ? props.classData.is_active : true
    })
  } else {
    // Creating new class - form is already initialized with defaults
    form.is_active = true
  }
}

const loadCourses = async () => {
  loadingCourses.value = true
  try {
    const response = await classService.getCourses()
    availableCourses.value = response.data || []
  } catch (error) {
    console.error('Failed to load courses:', error)
    toast.error('Failed to load courses')
  } finally {
    loadingCourses.value = false
  }
}

const loadRooms = async () => {
  loadingRooms.value = true
  try {
    const response = await classService.getRooms()
    availableRooms.value = response.data || []
  } catch (error) {
    console.error('Failed to load rooms:', error)
    toast.error('Failed to load rooms')
  } finally {
    loadingRooms.value = false
  }
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Validate required fields
  if (!form.name.trim()) {
    errors.name = 'Class name is required'
    isValid = false
  }

  if (!form.course_id) {
    errors.course_id = 'Course selection is required'
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
    const classData = { ...form }

    // Clean up empty values
    if (!classData.room_id) delete classData.room_id
    if (!classData.description) delete classData.description
    if (!classData.start_date) delete classData.start_date
    if (!classData.end_date) delete classData.end_date
    if (!classData.start_time) delete classData.start_time
    if (!classData.end_time) delete classData.end_time
    if (!classData.max_students) delete classData.max_students
    if (!classData.schedule_days || classData.schedule_days.length === 0) delete classData.schedule_days

    if (isEditing.value) {
      await classService.updateClass(props.classData.id, classData)
    } else {
      await classService.createClass(classData)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving class:', error)
    toast.error(error.message || 'Failed to save class')
  } finally {
    saving.value = false
  }
}

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

// Lifecycle
onMounted(() => {
  initializeForm()
  loadCourses()
  loadRooms()
})

// Watch for changes in classData prop
watch(() => props.classData, () => {
  initializeForm()
})
</script>
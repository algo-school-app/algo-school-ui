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
              placeholder="e.g., Math 101 - Section A"
            >
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Academic Year Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Academic Year *
            </label>
            <select
              v-model="form.academic_year_id"
              required
              @change="onAcademicYearChange"
              :disabled="loadingAcademicYears"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">{{ loadingAcademicYears ? 'Loading...' : 'Select academic year' }}</option>
              <option
                v-for="year in availableAcademicYears"
                :key="year.academic_year_id || year.id"
                :value="year.academic_year_id || year.id"
              >
                {{ year.academic_year_name || year.display_name || year.name || 'Unknown Year' }}
              </option>
            </select>
            <p v-if="errors.academic_year_id" class="text-red-500 text-sm mt-1">{{ errors.academic_year_id }}</p>
          </div>

          <!-- Program Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Program *
            </label>
            <select
              v-model="form.program_id"
              required
              @change="onProgramChange"
              :disabled="!form.academic_year_id || loadingPrograms"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">{{ loadingPrograms ? 'Loading...' : 'Select program' }}</option>
              <option
                v-for="program in availablePrograms"
                :key="program.id"
                :value="program.id"
              >
                {{ program.display_name || program.name }}
              </option>
            </select>
            <p v-if="errors.program_id" class="text-red-500 text-sm mt-1">{{ errors.program_id }}</p>
          </div>

          <!-- Course Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course *
            </label>
            <select
              v-model="form.course_id"
              required
              :disabled="!form.program_id || loadingCourses"
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

          <!-- Building & Room Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Building Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Building *
              </label>
              <select
                v-model="selectedBuildingId"
                required
                @change="onBuildingChange"
                :disabled="loadingBuildings"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">{{ loadingBuildings ? 'Loading...' : 'Select building' }}</option>
                <option
                  v-for="building in availableBuildings"
                  :key="building.id"
                  :value="building.id"
                >
                  {{ building.name }}
                </option>
              </select>
            </div>

            <!-- Room Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room *
              </label>
              <select
                v-model="form.room_id"
                required
                :disabled="!selectedBuildingId || loadingRooms"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">{{ loadingRooms ? 'Loading...' : 'Select room' }}</option>
                <option
                  v-for="room in availableRooms"
                  :key="room.id"
                  :value="room.id"
                >
                  {{ room.room_number }} - {{ room.room_name || room.room_type }} (Capacity: {{ room.capacity }})
                </option>
              </select>
              <p v-if="errors.room_id" class="text-red-500 text-sm mt-1">{{ errors.room_id }}</p>
            </div>
          </div>

          <!-- Teacher Assignment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Teacher *
            </label>
            <select
              v-model="form.primary_teacher_id"
              required
              :disabled="loadingTeachers"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">{{ loadingTeachers ? 'Loading...' : 'Select primary teacher' }}</option>
              <option
                v-for="teacher in availableTeachers"
                :key="teacher.id"
                :value="teacher.id"
              >
                {{ teacher.first_name }} {{ teacher.last_name }} ({{ teacher.role }})
              </option>
            </select>
            <p v-if="errors.primary_teacher_id" class="text-red-500 text-sm mt-1">{{ errors.primary_teacher_id }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Additional teachers can be added after creating the class
            </p>
          </div>

          <!-- Initial Student Enrollment (Optional) -->
          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initial Student Enrollment (Optional)
            </label>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto_enroll"
                  v-model="form.auto_enroll_from_course"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                >
                <label for="auto_enroll" class="text-sm text-gray-700 dark:text-gray-300">
                  Automatically enroll all students from the course
                </label>
              </div>

              <div v-if="!form.auto_enroll_from_course" class="mt-3">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Select specific students to enroll ({{ selectedStudents.length }} selected)
                </p>
                <div class="border border-gray-300 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
                  <div v-if="loadingStudents" class="p-3 text-center text-gray-500">
                    Loading students...
                  </div>
                  <div v-else-if="availableStudents.length === 0" class="p-3 text-center text-gray-500">
                    No students enrolled in this course yet
                  </div>
                  <label
                    v-else
                    v-for="student in availableStudents"
                    :key="student.id"
                    class="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="student.id"
                      v-model="selectedStudents"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ student.first_name }} {{ student.last_name }} ({{ student.student_id || 'No ID' }})
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Students can be enrolled or removed after creating the class
            </p>
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
import { supabase } from '@/services/supabase.js'
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
const loadingAcademicYears = ref(false)
const loadingPrograms = ref(false)
const loadingCourses = ref(false)
const loadingBuildings = ref(false)
const loadingRooms = ref(false)
const loadingTeachers = ref(false)
const loadingStudents = ref(false)

// Available options
const availableAcademicYears = ref([])
const availablePrograms = ref([])
const availableCourses = ref([])
const availableBuildings = ref([])
const availableRooms = ref([])
const availableTeachers = ref([])
const availableStudents = ref([])

// Selected values for cascading dropdowns
const selectedBuildingId = ref('')
const selectedStudents = ref([])

// Form data
const form = reactive({
  name: '',
  academic_year_id: '',
  program_id: '',
  course_id: '',
  room_id: '',
  primary_teacher_id: '',
  auto_enroll_from_course: false,
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
  academic_year_id: '',
  program_id: '',
  course_id: '',
  room_id: '',
  primary_teacher_id: ''
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

// Load academic years from user profile
const loadAcademicYears = () => {
  try {
    const userProfile = JSON.parse(localStorage.getItem('algo_user_profile') || '{}')
    availableAcademicYears.value = userProfile.available_academic_years || []

    // Auto-select the current academic year if available
    if (userProfile.selected_academic_year_id && !form.academic_year_id) {
      form.academic_year_id = userProfile.selected_academic_year_id
      // Load programs for the selected academic year
      loadPrograms()
    }
  } catch (error) {
    console.error('Failed to load academic years from profile:', error)
    availableAcademicYears.value = []
  }
}

const loadPrograms = async () => {
  if (!form.academic_year_id) {
    availablePrograms.value = []
    return
  }

  loadingPrograms.value = true
  try {
    // Use classService's getPrograms method
    const response = await classService.getPrograms(form.academic_year_id)
    availablePrograms.value = response.data || []

    console.log('Loaded programs for academic year', form.academic_year_id, ':', availablePrograms.value)
  } catch (error) {
    console.error('Failed to load programs:', error)
    toast.error('Failed to load programs')
    availablePrograms.value = []
  } finally {
    loadingPrograms.value = false
  }
}

const loadCourses = async () => {
  if (!form.program_id) {
    availableCourses.value = []
    return
  }

  loadingCourses.value = true
  try {
    // Filter courses by program_id
    const response = await classService.getCourses({ program_id: form.program_id })
    availableCourses.value = response.data || []
  } catch (error) {
    console.error('Failed to load courses:', error)
    toast.error('Failed to load courses')
  } finally {
    loadingCourses.value = false
  }
}

const loadBuildings = async () => {
  loadingBuildings.value = true
  try {
    const response = await classService.getBuildings()
    availableBuildings.value = response.data || []
  } catch (error) {
    console.error('Failed to load buildings:', error)
    toast.error('Failed to load buildings')
  } finally {
    loadingBuildings.value = false
  }
}

const loadRooms = async (buildingId) => {
  if (!buildingId) {
    availableRooms.value = []
    return
  }

  loadingRooms.value = true
  try {
    const response = await classService.getRoomsForBuilding(buildingId)
    availableRooms.value = response.data || []
  } catch (error) {
    console.error('Failed to load rooms:', error)
    toast.error('Failed to load rooms')
  } finally {
    loadingRooms.value = false
  }
}

const loadTeachers = async () => {
  loadingTeachers.value = true
  try {
    const response = await classService.getEligibleTeachers()
    availableTeachers.value = response.data || []
  } catch (error) {
    console.error('Failed to load teachers:', error)
    toast.error('Failed to load teachers')
  } finally {
    loadingTeachers.value = false
  }
}

const loadStudents = async () => {
  if (!form.course_id) {
    availableStudents.value = []
    return
  }

  loadingStudents.value = true
  try {
    // TODO: Load students enrolled in the selected course
    // This would need a new endpoint or query
    availableStudents.value = []
  } catch (error) {
    console.error('Failed to load students:', error)
    toast.error('Failed to load students')
  } finally {
    loadingStudents.value = false
  }
}

// Event handlers for cascading dropdowns
const onAcademicYearChange = () => {
  // Reset dependent fields
  form.program_id = ''
  form.course_id = ''
  availablePrograms.value = []
  availableCourses.value = []

  // Load programs for selected academic year
  loadPrograms()
}

const onProgramChange = () => {
  // Reset dependent field
  form.course_id = ''
  availableCourses.value = []

  // Load courses for selected program
  loadCourses()
}

const onBuildingChange = () => {
  // Reset room selection
  form.room_id = ''
  availableRooms.value = []

  // Load rooms for selected building
  if (selectedBuildingId.value) {
    loadRooms(selectedBuildingId.value)
  }
}

// Watch for course selection to load students
watch(() => form.course_id, (newCourseId) => {
  if (newCourseId && !isEditing.value) {
    loadStudents()
  }
})

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

  if (!form.academic_year_id) {
    errors.academic_year_id = 'Academic year is required'
    isValid = false
  }

  if (!form.program_id) {
    errors.program_id = 'Program is required'
    isValid = false
  }

  if (!form.course_id) {
    errors.course_id = 'Course selection is required'
    isValid = false
  }

  if (!form.room_id) {
    errors.room_id = 'Room selection is required'
    isValid = false
  }

  if (!form.primary_teacher_id) {
    errors.primary_teacher_id = 'Primary teacher is required'
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

    // Remove UI-only fields
    delete classData.auto_enroll_from_course
    delete classData.primary_teacher_id // Will be handled separately

    // Clean up empty values
    if (!classData.description) delete classData.description
    if (!classData.start_date) delete classData.start_date
    if (!classData.end_date) delete classData.end_date
    if (!classData.start_time) delete classData.start_time
    if (!classData.end_time) delete classData.end_time
    if (!classData.max_students) delete classData.max_students
    if (!classData.schedule_days || classData.schedule_days.length === 0) delete classData.schedule_days

    let createdClass
    if (isEditing.value) {
      await classService.updateClass(props.classData.id, classData)
    } else {
      // Create the class
      const response = await classService.createClass(classData)
      createdClass = response.data || response

      // Assign primary teacher if creating new class
      if (form.primary_teacher_id && createdClass.id) {
        try {
          await classService.assignTeacher(createdClass.id, {
            person_id: form.primary_teacher_id,
            is_primary: true
          })
        } catch (error) {
          console.error('Failed to assign teacher:', error)
          toast.warning('Class created but failed to assign teacher')
        }
      }

      // Enroll students if any selected
      if (!isEditing.value && createdClass.id) {
        if (form.auto_enroll_from_course) {
          // TODO: Implement auto-enrollment from course
          toast.info('Auto-enrollment will be available in a future update')
        } else if (selectedStudents.value.length > 0) {
          // Enroll selected students
          for (const studentId of selectedStudents.value) {
            try {
              await classService.enrollStudent(createdClass.id, {
                person_id: studentId
              })
            } catch (error) {
              console.error(`Failed to enroll student ${studentId}:`, error)
            }
          }
          toast.success(`Enrolled ${selectedStudents.value.length} student(s)`)
        }
      }
    }

    emit('saved')
    toast.success(isEditing.value ? 'Class updated successfully' : 'Class created successfully')
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
  loadAcademicYears() // This will cascade load programs if an academic year is auto-selected
  loadBuildings()
  loadTeachers()
})

// Watch for changes in classData prop
watch(() => props.classData, () => {
  initializeForm()
})
</script>
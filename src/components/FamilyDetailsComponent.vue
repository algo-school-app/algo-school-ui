<template>
  <div class="family-details-container w-full h-full animated-gradient-bg floating-pattern-bg content-area-animated">
    <!-- Header -->
    <div class="card-gradient-bg border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="goBack" class="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Go Back">
            <HandDrawnIcon name="arrow-left" size="sm" />
          </button>
          <div>
            <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ studentName }} Family</h1>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Student & Parent Information</p>
          </div>
        </div>
        <button @click="editFamily" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
          <HandDrawnIcon name="edit" size="sm" class="text-white" />
          <span class="hidden sm:inline">Edit Family</span>
          <span class="sm:hidden">Edit</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading family information...</p>
      </div>
    </div>

    <!-- Family Content -->
    <div v-else-if="student" class="p-4 space-y-6">
      <!-- Student Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i class="fas fa-user-graduate text-blue-600 dark:text-blue-400 text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ student.name }}</h2>
              <p class="text-gray-600 dark:text-gray-400">Student ID: {{ student.student_id }}</p>
            </div>
          </div>
          <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full" :class="getGradeClass(student.grade)">
            {{ student.grade }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="student.date_of_birth" class="flex items-center gap-2">
            <i class="fas fa-birthday-cake text-gray-400"></i>
            <span class="text-gray-600 dark:text-gray-400">Date of Birth:</span>
            <span class="text-gray-900 dark:text-white">{{ formatDate(student.date_of_birth) }}</span>
          </div>
          <div v-if="student.email" class="flex items-center gap-2">
            <i class="fas fa-envelope text-gray-400"></i>
            <span class="text-gray-600 dark:text-gray-400">Email:</span>
            <span class="text-gray-900 dark:text-white">{{ student.email }}</span>
          </div>
          <div v-if="student.phone" class="flex items-center gap-2">
            <i class="fas fa-phone text-gray-400"></i>
            <span class="text-gray-600 dark:text-gray-400">Phone:</span>
            <span class="text-gray-900 dark:text-white">{{ student.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Parents Section -->
      <div v-if="parents && parents.length > 0">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <i class="fas fa-users text-gray-500"></i>
          Parents & Guardians ({{ parents.length }})
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="parent in parents" :key="parent.id || parent.name" 
               class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-green-600 dark:text-green-400 text-lg"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ parent.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 capitalize">{{ parent.relationship_type || 'Parent' }}</p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <span v-if="parent.is_primary_contact" class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  Primary Contact
                </span>
                <span v-if="parent.is_emergency_contact" class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                  Emergency Contact
                </span>
              </div>
            </div>
            
            <div class="space-y-2 text-sm">
              <div v-if="parent.email" class="flex items-center gap-2">
                <i class="fas fa-envelope text-gray-400 w-4"></i>
                <span class="text-gray-900 dark:text-white">{{ parent.email }}</span>
              </div>
              <div v-if="parent.phone_number" class="flex items-center gap-2">
                <i class="fas fa-phone text-gray-400 w-4"></i>
                <span class="text-gray-900 dark:text-white">{{ parent.phone_number }}</span>
              </div>
              <div v-if="parent.address && (parent.address.street || parent.address.city)" class="flex items-start gap-2">
                <i class="fas fa-map-marker-alt text-gray-400 w-4 mt-0.5"></i>
                <div class="text-gray-900 dark:text-white">
                  <div v-if="parent.address.street">{{ parent.address.street }}</div>
                  <div v-if="parent.address.city">
                    {{ parent.address.city }}{{ parent.address.state ? ', ' + parent.address.state : '' }}{{ parent.address.zip_code ? ' ' + parent.address.zip_code : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Parents State -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <i class="fas fa-users text-gray-400 text-3xl mb-4"></i>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Parent Information</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">No parent or guardian information has been added for this student.</p>
        <button @click="addParent" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
          Add Parent
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Student Not Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">The requested student could not be found.</p>
        <button @click="goBack" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../services/supabase.js'
import { useToast } from '../utils/useToast.js'
import HandDrawnIcon from './HandDrawnIcon.vue'

const router = useRouter()
const route = useRoute()

const student = ref(null)
const parents = ref([])
const loading = ref(true)

const studentName = computed(() => student.value?.name || 'Student')

const loadFamilyData = async () => {
  try {
    loading.value = true
    const studentId = route.params.id
    
    console.log('Loading family data for student ID:', studentId)
    
    // Use the new algo_get_family function
    const { data: familyData, error: familyError } = await supabase
      .rpc('algo_get_family', { student_id_param: parseInt(studentId) })
    
    if (familyError) {
      console.error('Error calling algo_get_family:', familyError)
      throw familyError
    }
    
    console.log('Family data response:', familyData)
    
    // Check if the function returned an error
    if (!familyData.success) {
      console.error('Function returned error:', familyData.error)
      if (familyData.error_code === 'PERMISSION_DENIED') {
        throw new Error('You do not have permission to view this family information')
      } else if (familyData.error_code === 'STUDENT_NOT_FOUND') {
        throw new Error('Student not found')
      } else {
        throw new Error(familyData.error || 'Unknown error occurred')
      }
    }
    
    // Transform student data from the new function response
    const studentData = familyData.student
    student.value = {
      id: studentData.id,
      student_id: studentData.student_id,
      name: studentData.full_name,
      grade: studentData.current_grade || 'N/A',
      email: studentData.email,
      phone: studentData.phone_number,
      date_of_birth: studentData.date_of_birth,
      gender: studentData.gender,
      address: studentData.address,
      _original: studentData
    }
    
    // Parents data is already in the correct format
    parents.value = familyData.parents || []
    
    console.log('Family data loaded successfully:')
    console.log('Student:', student.value)
    console.log('Parents:', parents.value)
    console.log('Family summary:', familyData.family_summary)
    
  } catch (error) {
    console.error('Error loading family data:', error)
    student.value = null
    parents.value = []
    
    // Show user-friendly error message
    const toast = useToast()
    if (error.message.includes('permission')) {
      toast.error('Access Denied', 'You do not have permission to view this family information.')
    } else if (error.message.includes('not found')) {
      toast.error('Not Found', 'Student not found.')
    } else {
      toast.error('Error', 'Error loading family information. Please try again.')
    }
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const getGradeClass = (grade) => {
  if (!grade) return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  const gradeLower = grade.toLowerCase()
  if (gradeLower.includes('kindergarten') || gradeLower === 'k') return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
  if (gradeLower.includes('1')) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
  if (gradeLower.includes('2')) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  if (gradeLower.includes('3')) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  if (gradeLower.includes('4')) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  if (gradeLower.includes('5')) return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
  if (gradeLower.includes('6')) return 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'
  if (gradeLower.includes('7')) return 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200'
  if (gradeLower.includes('8')) return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
  return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const goBack = () => {
  router.push('/dashboard/students')
}

const editFamily = () => {
  // TODO: Implement family editing functionality
  console.log('Edit family functionality to be implemented')
}

const addParent = () => {
  // TODO: Implement add parent functionality
  console.log('Add parent functionality to be implemented')
}

onMounted(() => {
  loadFamilyData()
})
</script>
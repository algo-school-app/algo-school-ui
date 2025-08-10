<template>
  <div class="h-full flex flex-col">
    <!-- Class Header -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <i class="fas fa-chalkboard-teacher text-blue-600 dark:text-blue-400 text-lg"></i>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ classData?.course_name || 'Loading Class...' }}</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ classData?.program_name }} • {{ classData?.program_type }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            Active
          </span>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <nav class="px-4 sm:px-6">
        <div class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <div class="flex items-center gap-2">
              <i :class="tab.icon" class="text-sm"></i>
              {{ tab.label }}
            </div>
          </button>
        </div>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-auto">
      <!-- General Tab -->
      <div v-if="activeTab === 'general'" class="p-4 sm:p-6">
        <div class="max-w-4xl mx-auto space-y-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400">Loading class information...</p>
            </div>
          </div>

          <!-- Content -->
          <div v-else class="space-y-6">
            <!-- Program Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i class="fas fa-graduation-cap text-blue-500"></i>
                Program Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Name</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ classData?.program_name || 'N/A' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Type</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ classData?.program_type || 'N/A' }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ classData?.program_description || 'No description available' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Course Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i class="fas fa-book text-green-500"></i>
                Course Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Name</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ classData?.course_name || 'N/A' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ classData?.course_code || 'N/A' }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Description</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ classData?.course_description || 'No description available' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Classroom Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i class="fas fa-door-open text-purple-500"></i>
                Classroom Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Classroom</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ classData?.classroom_name || 'N/A' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Classes</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ teachers.length }} classes
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School/Tenant</label>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ classData?.program_type || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Teachers Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i class="fas fa-users text-orange-500"></i>
                Teachers ({{ teachers.length }})
              </h3>
              
              <!-- Teachers Table -->
              <div v-if="teachers.length > 0" class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="teacher in teachers" :key="teacher.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-4 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-orange-600 dark:text-orange-400"></i>
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher.full_name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {{ teacher.email || 'N/A' }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {{ teacher.role || 'Teacher' }}
                        </span>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {{ teacher.phone || 'N/A' }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- No Teachers State -->
              <div v-else class="text-center py-8">
                <i class="fas fa-user-slash text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">No teachers assigned to this class</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contents Tab -->
      <div v-else-if="activeTab === 'contents'" class="h-full">
        <ContentDocuments 
          :class-id="extractClassId()" 
          :course-name="classData?.course_name"
        />
      </div>

      <!-- Assignments Tab -->
      <div v-else-if="activeTab === 'assignments'" class="p-4 sm:p-6">
        <div class="max-w-4xl mx-auto">
          <div class="text-center py-16">
            <i class="fas fa-tasks text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Assignments</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Class assignments and homework will be managed here</p>
            <div class="inline-flex px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </div>

      <!-- Quizes Tab -->
      <div v-else-if="activeTab === 'quizes'" class="p-4 sm:p-6">
        <div class="max-w-4xl mx-auto">
          <div class="text-center py-16">
            <i class="fas fa-question-circle text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quizes</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Class quizes and assessments will be available here</p>
            <div class="inline-flex px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </div>

      <!-- Grades Tab -->
      <div v-else-if="activeTab === 'grades'" class="p-4 sm:p-6">
        <div class="max-w-4xl mx-auto">
          <div class="text-center py-16">
            <i class="fas fa-chart-line text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Grades</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Student grades and progress tracking will be shown here</p>
            <div class="inline-flex px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { UserService } from '../services/userService.js'
import ContentDocuments from './ContentDocuments.vue'

const props = defineProps({
  selectedMenu: String
})

// State
const loading = ref(true)
const activeTab = ref('general')
const classData = ref(null)
const teachers = ref([])

// Tab configuration
const tabs = [
  { id: 'general', label: 'General', icon: 'fas fa-info-circle' },
  { id: 'contents', label: 'Contents', icon: 'fas fa-file-alt' },
  { id: 'assignments', label: 'Assignments', icon: 'fas fa-tasks' },
  { id: 'quizes', label: 'Quizes', icon: 'fas fa-question-circle' },
  { id: 'grades', label: 'Grades', icon: 'fas fa-chart-line' }
]

// Methods
const extractClassId = () => {
  const classIdStr = props.selectedMenu ? props.selectedMenu.split('/')[1] : null
  return classIdStr ? parseInt(classIdStr) : null
}

const loadClassData = () => {
  try {
    loading.value = true
    // Extract classId from selectedMenu (format: 'my-class/classId')
    const classIdStr = props.selectedMenu ? props.selectedMenu.split('/')[1] : null
    if (!classIdStr) {
      console.error('No classId found in selectedMenu:', props.selectedMenu)
      return
    }
    const classId = parseInt(classIdStr)
    
    // Get user profile data
    const profile = UserService.getStoredProfile()
    if (!profile || !profile.courses) {
      console.error('No profile or courses data found')
      return
    }
    
    // Find the specific class across all courses
    let foundClass = null
    let parentCourse = null
    
    for (const course of profile.courses) {
      if (course.classes && Array.isArray(course.classes)) {
        const classItem = course.classes.find(c => c.id === classId)
        if (classItem) {
          foundClass = classItem
          parentCourse = course
          break
        }
      }
    }
    
    if (!foundClass || !parentCourse) {
      console.error(`Class with ID ${classId} not found`)
      return
    }
    
    // Extract class and course information
    classData.value = {
      course_name: parentCourse.display_name,
      course_code: parentCourse.name,
      course_description: parentCourse.description,
      program_name: parentCourse.program_display_name,
      program_type: profile.current_tenant?.display_name || 'N/A',
      program_description: profile.current_tenant?.description || 'No description available',
      classroom_name: foundClass.classroom?.name || 'N/A',
      classroom_capacity: 'N/A', // Not available in current data structure
      classroom_location: 'N/A', // Not available in current data structure
      classroom_building: 'N/A'  // Not available in current data structure
    }
    
    // Extract teacher for this specific class
    const teachersList = []
    if (foundClass.teacher) {
      teachersList.push({
        id: foundClass.teacher.id,
        full_name: foundClass.teacher.full_name,
        email: foundClass.teacher.email,
        role: 'Teacher',
        phone: 'N/A' // Not available in current data structure
      })
    }
    
    teachers.value = teachersList
    
  } catch (error) {
    console.error('Error loading class data:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadClassData()
})

// Watch for changes in selectedMenu to reload data
watch(() => props.selectedMenu, (newMenu, oldMenu) => {
  if (newMenu !== oldMenu && newMenu) {
    loadClassData()
  }
})
</script>
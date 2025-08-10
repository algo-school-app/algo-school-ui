<template>
  <div class="students-container w-full"
       style="position: relative;">
    <!-- Header -->
    <div class="flex-shrink-0 px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Student Management</h2>
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Search -->
          <div class="relative flex-1 sm:flex-none">
            <input 
              v-model="searchQuery" 
              @input="filterStudents"
              type="text" 
              placeholder="Search students..." 
              class="w-full sm:w-48 lg:w-64 pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <i class="fas fa-search absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
          <!-- Add Student Button -->
          <button 
            @click="showAddStudentModal = true"
            class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            <i class="fas fa-plus text-xs sm:text-sm"></i>
            <span class="hidden sm:inline">Add Student</span>
            <span class="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="students-content flex flex-col h-full">
      <!-- Loading State -->
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Loading students...</p>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredStudents.length === 0" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <i class="fas fa-users text-6xl mb-4 text-gray-400"></i>
          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">No Students Found</h3>
          <p class="mb-6 text-gray-600 dark:text-gray-400">
            {{ searchQuery ? 'No students match your search criteria.' : 'No students have been added yet.' }}
          </p>
          <button 
            v-if="!searchQuery" 
            @click="showAddStudentModal = true"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
          >
            <i class="fas fa-plus"></i>
            Add First Student
          </button>
        </div>
      </div>
      
      <!-- Students Table -->
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <!-- Mobile Card Layout (hidden on md+ screens) -->
        <div class="md:hidden flex-1 overflow-auto px-3 sm:px-6">
          <div class="space-y-4">
            <div v-for="student in paginatedStudents" :key="student.id" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 card-appear hover:shadow-md transition-all duration-200">
              <!-- Student Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <i class="fas fa-user-graduate text-blue-600 dark:text-blue-400 text-lg"></i>
                  </div>
                  <div class="ml-3">
                    <div class="text-base font-medium text-gray-900 dark:text-white">{{ student.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">ID: {{ student.student_id }}</div>
                  </div>
                </div>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getGradeClass(student.grade)">
                  {{ student.grade }}
                </span>
              </div>
              
              <!-- Student Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm">
                  <i class="fas fa-user-friends text-gray-400 w-5 mr-2"></i>
                  <span class="text-gray-600 dark:text-gray-400 font-medium w-20">Parent:</span>
                  <span class="text-gray-900 dark:text-white">{{ student.parent_name }}</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-envelope text-gray-400 w-5 mr-2"></i>
                  <span class="text-gray-600 dark:text-gray-400 font-medium w-20">Email:</span>
                  <span class="text-gray-900 dark:text-white truncate">{{ student.email }}</span>
                </div>
                <div class="flex items-center text-sm" v-if="student.phone">
                  <i class="fas fa-phone text-gray-400 w-5 mr-2"></i>
                  <span class="text-gray-600 dark:text-gray-400 font-medium w-20">Phone:</span>
                  <span class="text-gray-900 dark:text-white">{{ student.phone }}</span>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button @click="viewStudent(student)" class="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 text-sm font-medium" title="View Details">
                  <HandDrawnIcon name="eye" size="sm" />
                  <span>View</span>
                </button>
                <button @click="editStudent(student)" class="flex items-center gap-2 px-3 py-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 text-sm font-medium" title="Edit">
                  <HandDrawnIcon name="edit" size="sm" />
                  <span>Edit</span>
                </button>
                <button @click="deleteStudent(student)" class="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 text-sm font-medium" title="Delete">
                  <HandDrawnIcon name="trash" size="sm" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Desktop Table Layout (hidden on mobile, visible on md+ screens) -->
        <div class="hidden md:flex flex-1 flex-col overflow-hidden">
          <!-- Table Container -->
          <div class="flex-1 overflow-auto">
            <div class="min-w-full">
              <table class="min-w-full card-gradient-bg card-appear overflow-hidden rounded-lg">
                <thead class="sticky top-0 bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th @click="sortBy('name')" class="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div class="flex items-center gap-2">
                        Student Name
                        <i class="fas fa-sort text-gray-400" :class="getSortIcon('name')"></i>
                      </div>
                    </th>
                    <th @click="sortBy('grade')" class="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div class="flex items-center gap-2">
                        Grade
                        <i class="fas fa-sort text-gray-400" :class="getSortIcon('grade')"></i>
                      </div>
                    </th>
                    <th @click="sortBy('parent_name')" class="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div class="flex items-center gap-2">
                        Parent Name
                        <i class="fas fa-sort text-gray-400" :class="getSortIcon('parent_name')"></i>
                      </div>
                    </th>
                    <th @click="sortBy('email')" class="hidden xl:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div class="flex items-center gap-2">
                        Email
                        <i class="fas fa-sort text-gray-400" :class="getSortIcon('email')"></i>
                      </div>
                    </th>
                    <th @click="sortBy('phone')" class="hidden xl:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div class="flex items-center gap-2">
                        Phone
                        <i class="fas fa-sort text-gray-400" :class="getSortIcon('phone')"></i>
                      </div>
                    </th>
                    <th class="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="student in paginatedStudents" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <i class="fas fa-user-graduate text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">ID: {{ student.student_id }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getGradeClass(student.grade)">
                        {{ student.grade }}
                      </span>
                    </td>
                    <td class="hidden lg:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ student.parent_name }}
                    </td>
                    <td class="hidden xl:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div class="max-w-xs truncate">{{ student.email }}</div>
                    </td>
                    <td class="hidden xl:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ student.phone }}
                    </td>
                    <td class="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center gap-1 lg:gap-3">
                        <button @click="viewStudent(student)" class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="View Details">
                          <HandDrawnIcon name="eye" size="sm" />
                        </button>
                        <button @click="editStudent(student)" class="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Edit">
                          <HandDrawnIcon name="edit" size="sm" />
                        </button>
                        <button @click="deleteStudent(student)" class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Delete">
                          <HandDrawnIcon name="trash" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="card-gradient-bg card-appear-delayed border-t border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-4">
          <!-- Mobile Pagination -->
          <div class="md:hidden">
            <div class="text-sm text-gray-700 dark:text-gray-300 text-center mb-3">
              {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredStudents.length }}
            </div>
            <div class="flex items-center justify-between">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                <i class="fas fa-chevron-left"></i>
                <span class="hidden sm:inline">Previous</span>
              </button>
              <div class="flex items-center gap-1">
                <span class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">{{ currentPage }}</span>
                <span class="px-2 text-gray-500 dark:text-gray-400 text-sm">of</span>
                <span class="px-2 text-gray-700 dark:text-gray-300 text-sm font-medium">{{ totalPages }}</span>
              </div>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                <span class="hidden sm:inline">Next</span>
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <!-- Desktop Pagination -->
          <div class="hidden md:flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredStudents.length }} students
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <i class="fas fa-chevron-left"></i>
                Previous
              </button>
              <div class="flex items-center gap-1">
                <button 
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5',
                    currentPage === page 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2"
              >
                Next
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Student Modal -->
    <div v-if="showAddStudentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto" @click="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md card-appear my-4 sm:my-0" @click.stop>
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ editingStudent ? 'Edit Student' : 'Add New Student' }}</h3>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <form @submit.prevent="saveStudent" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student Name</label>
              <input v-model="studentForm.name" type="text" required class="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade</label>
              <select v-model="studentForm.grade" required class="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base">
                <option value="">Select Grade</option>
                <option value="K">Kindergarten</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parent Name</label>
              <input v-model="studentForm.parent_name" type="text" required class="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input v-model="studentForm.email" type="email" required class="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input v-model="studentForm.phone" type="tel" class="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base">
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
              <button type="button" @click="closeModal" class="w-full sm:w-auto order-2 sm:order-1 px-4 py-3 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 text-base font-medium">Cancel</button>
              <button type="submit" class="w-full sm:w-auto order-1 sm:order-2 px-4 py-3 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 text-base font-medium">
                {{ editingStudent ? 'Update Student' : 'Add Student' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      ref="confirmDialog"
      :title="'Delete Student'"
      :message="pendingDeleteStudent ? `Are you sure you want to delete '${pendingDeleteStudent.full_name || pendingDeleteStudent.name}'? This action cannot be undone.` : ''"
      confirm-text="Delete"
      confirm-icon="fas fa-trash"
      @confirm="confirmDeleteStudent"
      @cancel="pendingDeleteStudent = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase.js'
import { useToast } from '../utils/useToast.js'
import ConfirmationDialog from './ConfirmationDialog.vue'
import HandDrawnIcon from './HandDrawnIcon.vue'

// Router
const router = useRouter()

// Reactive data
const students = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filteredStudents = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortField = ref('name')
const sortDirection = ref('asc')
const showAddStudentModal = ref(false)
const editingStudent = ref(null)
const studentForm = ref({
  name: '',
  grade: '',
  parent_name: '',
  email: '',
  phone: ''
})

// Toast and dialog refs
const toast = useToast()
const confirmDialog = ref(null)
const pendingDeleteStudent = ref(null)

// Load students function
const loadStudents = async () => {
  try {
    loading.value = true
    console.log('Loading students from Supabase...')
    
    let studentsData = []
    
    // Try RPC function first (more efficient for complex queries)
    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('algo_get_students')
      
      if (rpcError) {
        console.warn('RPC function failed, falling back to direct query:', rpcError)
        throw rpcError
      }
      
      // Handle the wrapped response structure
      if (rpcData && rpcData.success && rpcData.students) {
        studentsData = rpcData.students
        console.log('Students loaded via RPC:', studentsData.length, 'Total:', rpcData.total_students)
      } else if (Array.isArray(rpcData)) {
        // Fallback if RPC returns direct array
        studentsData = rpcData
        console.log('Students loaded via RPC (direct array):', studentsData.length)
      } else {
        console.warn('Unexpected RPC response format:', rpcData)
        studentsData = []
      }
    } catch (rpcError) {
      console.warn('RPC function algo_get_students failed:', rpcError)
      throw new Error(`Failed to load students: ${rpcError.message}`)
    }
    
    // Transform data to match UI expectations
    students.value = studentsData.map((student, index) => {
      // Find primary parent or use first parent
      const primaryParent = student.parents?.find(p => p.is_primary_contact) || student.parents?.[0]
      
      return {
        id: student.id,
        student_id: student.student_id || `STU${String(student.id).padStart(3, '0')}`,
        name: student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim(),
        grade: student.current_grade || 'N/A',
        parent_name: primaryParent?.name || 'No parent assigned',
        email: primaryParent?.email || student.email || '',
        phone: primaryParent?.phone_number || student.phone_number || '',
        date_of_birth: student.date_of_birth,
        // Store original data for editing
        _original: student
      }
    })
    
    filteredStudents.value = [...students.value]
    console.log('Students processed and assigned:', students.value.length)
    if (students.value.length > 0) {
      console.log('Sample student:', students.value[0])
    }
  } catch (error) {
    console.error('Error loading students:', error)
    students.value = []
    filteredStudents.value = []
  } finally {
    loading.value = false
  }
}

// Computed properties
const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredStudents.value.length))

const paginatedStudents = computed(() => {
  return filteredStudents.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const filterStudents = () => {
  if (!searchQuery.value.trim()) {
    filteredStudents.value = [...students.value]
  } else {
    const query = searchQuery.value.toLowerCase()
    filteredStudents.value = students.value.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.parent_name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.student_id.toLowerCase().includes(query)
    )
  }
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  
  filteredStudents.value.sort((a, b) => {
    let aVal = a[field]
    let bVal = b[field]
    
    if (field === 'grade') {
      aVal = parseInt(aVal) || 0
      bVal = parseInt(bVal) || 0
    } else {
      aVal = aVal?.toString().toLowerCase() || ''
      bVal = bVal?.toString().toLowerCase() || ''
    }
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return ''
  return sortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
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

const viewStudent = (student) => {
  console.log('Viewing student:', student)
  // Navigate to family details page
  router.push(`/dashboard/students/${student.id}/family`)
}

const editStudent = (student) => {
  editingStudent.value = student
  studentForm.value = { ...student }
  showAddStudentModal.value = true
}

const deleteStudent = (student) => {
  pendingDeleteStudent.value = student
  confirmDialog.value.open()
}

const confirmDeleteStudent = async () => {
  if (!pendingDeleteStudent.value) return
  
  try {
    // TODO: Implement delete functionality using proper RPC function
    console.log('Delete student requested:', pendingDeleteStudent.value.name)
    toast.info('Coming Soon', 'Delete functionality will be implemented soon')
  } catch (error) {
    console.error('Error deleting student:', error)
    toast.error('Delete Failed', 'Error deleting student. Please try again.')
  } finally {
    pendingDeleteStudent.value = null
  }
}

const saveStudent = async () => {
  try {
    // TODO: Implement save functionality using proper RPC functions
    console.log('Save student requested:', studentForm.value)
    toast.info('Coming Soon', 'Add/Edit student functionality will be implemented soon')
    closeModal()
  } catch (error) {
    console.error('Error saving student:', error)
    toast.error('Save Failed', 'Error saving student. Please try again.')
  }
}

const closeModal = () => {
  showAddStudentModal.value = false
  editingStudent.value = null
  studentForm.value = {
    name: '',
    grade: '',
    parent_name: '',
    email: '',
    phone: ''
  }
}

// Lifecycle
onMounted(() => {
  console.log('StudentsComponent mounted')
  loadStudents()
})
</script>

<style scoped>
</style>
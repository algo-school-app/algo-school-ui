<template>
  <div class="staff-container w-full" style="position: relative;">
    <!-- Header -->
    <div class="flex-shrink-0 px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h2>
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Search -->
          <div class="relative flex-1 sm:flex-none">
            <input 
              v-model="searchQuery" 
              @input="filterStaff"
              type="text" 
              placeholder="Search staff..." 
              class="w-full sm:w-48 lg:w-64 pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <i class="fas fa-search absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
          
          <!-- Active Filter Checkbox -->
          <div class="flex items-center gap-2">
            <input 
              v-model="activeFilter" 
              @change="filterStaff"
              type="checkbox" 
              id="activeFilter"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            >
            <label for="activeFilter" class="text-sm font-medium text-gray-900 dark:text-gray-300">
              Active Only
            </label>
          </div>
          
          <!-- Add Staff Button - Only show if user has permission -->
          <button 
            v-if="hasPermission('staff_add')"
            @click="openAddStaffModal"
            class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            <i class="fas fa-plus"></i>
            <span class="hidden sm:inline">Add Staff</span>
            <span class="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="staff-content flex flex-col h-full">
      <!-- Loading State -->
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Loading staff...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="flex-1 flex items-center justify-center">
        <div class="text-center max-w-md mx-auto">
          <i class="fas fa-exclamation-triangle text-6xl text-red-300 dark:text-red-600 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Staff</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
          <button @click="loadStaff" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 mx-auto">
            <i class="fas fa-redo"></i>
            Try Again
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredStaff.length === 0" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <i class="fas fa-users text-6xl mb-4 text-gray-400"></i>
          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">No Staff Found</h3>
          <p class="mb-6 text-gray-600 dark:text-gray-400">
            {{ searchQuery || !activeFilter ? 'No staff match your search criteria.' : 'No staff have been added yet.' }}
          </p>
          <button 
            v-if="!searchQuery && hasPermission('staff_add')" 
            @click="openAddStaffModal"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
          >
            <i class="fas fa-plus"></i>
            Add First Staff Member
          </button>
        </div>
      </div>
      
      <!-- Staff Table -->
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <!-- Desktop Table Layout -->
        <div class="flex-1 overflow-auto">
          <div class="min-w-full">
            <table class="min-w-full card-gradient-bg card-appear overflow-hidden rounded-lg">
              <thead class="sticky top-0 bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th @click="sortBy('first_name')" class="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-2">
                      Name
                      <i class="fas fa-sort text-gray-400" :class="getSortIcon('first_name')"></i>
                    </div>
                  </th>
                  <th @click="sortBy('email')" class="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-2">
                      Email
                      <i class="fas fa-sort text-gray-400" :class="getSortIcon('email')"></i>
                    </div>
                  </th>
                  <th @click="sortBy('role_name')" class="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-2">
                      Role
                      <i class="fas fa-sort text-gray-400" :class="getSortIcon('role_name')"></i>
                    </div>
                  </th>
                  <th @click="sortBy('phone')" class="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-2">
                      Phone
                      <i class="fas fa-sort text-gray-400" :class="getSortIcon('phone')"></i>
                    </div>
                  </th>
                  <th class="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="staff in paginatedStaff" :key="staff.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <i class="fas fa-user-tie text-indigo-600 dark:text-indigo-400"></i>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ getFullName(staff) || 'N/A' }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Staff Member</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ staff.email || 'N/A' }}
                  </td>
                  <td class="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      {{ staff.roles && staff.roles.length > 0 ? staff.roles[0].role_display_name : 'No Role' }}
                    </span>
                  </td>
                  <td class="hidden lg:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ staff.phone_number || staff.phone || 'N/A' }}
                  </td>
                  <td class="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <input 
                        v-if="hasPermission('staff_edit')"
                        type="checkbox"
                        :checked="staff.is_active"
                        @change="toggleStaffStatus(staff)"
                        class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      >
                      <span v-else :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        staff.is_active ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      ]">
                        {{ staff.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                  </td>
                  <td class="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button
                        @click="viewStaff(staff)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="View Details"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button
                        v-if="hasPermission('staff_edit')"
                        @click="editStaff(staff)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        v-if="hasPermission('super_admin')"
                        @click="deleteStaff(staff)"
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
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between px-3 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div class="flex items-center gap-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Staff Modal -->
    <div v-if="showAddStaffModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ editingStaff ? 'Edit Staff Member' : 'Add New Staff Member' }}</h3>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <form @submit.prevent="saveStaff" class="space-y-6">
            <!-- Personal Information -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name <span class="text-red-500">*</span></label>
                <input 
                  v-model="staffForm.first_name" 
                  @blur="validateField('first_name')"
                  type="text" 
                  :class="['w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent', validationErrors.first_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                >
                <p v-if="validationErrors.first_name" class="mt-1 text-xs text-red-500">{{ validationErrors.first_name }}</p>
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name <span class="text-red-500">*</span></label>
                <input 
                  v-model="staffForm.last_name" 
                  @blur="validateField('last_name')"
                  type="text" 
                  :class="['w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent', validationErrors.last_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                >
                <p v-if="validationErrors.last_name" class="mt-1 text-xs text-red-500">{{ validationErrors.last_name }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email <span class="text-red-500">*</span></label>
                <input 
                  v-model="staffForm.email" 
                  @blur="validateField('email')"
                  @input="validateField('email')"
                  type="email" 
                  :class="['w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent', validationErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                >
                <p v-if="validationErrors.email" class="mt-1 text-xs text-red-500">{{ validationErrors.email }}</p>
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input 
                  v-model="staffForm.phone" 
                  @input="handlePhoneInput"
                  type="tel" 
                  placeholder="(123) 456-7890"
                  class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>
            

            <!-- Address Information -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <input 
                v-model="staffForm.address" 
                type="text" 
                class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                <input 
                  v-model="staffForm.city" 
                  type="text" 
                  class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State/Province</label>
                <select 
                  v-model="staffForm.state" 
                  class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  <option value="NJ">New Jersey (NJ)</option>
                  <option value="NY">New York (NY)</option>
                  <option value="PA">Pennsylvania (PA)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zip/Postal Code</label>
                <input 
                  v-model="staffForm.zip_code" 
                  type="text" 
                  class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>

            <!-- Role and Tenant Information -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School/Campus <span class="text-red-500">*</span></label>
                <select 
                  v-model="staffForm.tenant_id" 
                  :class="['w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent', validationErrors.tenant_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                >
                  <option value="">Select School/Campus</option>
                  <option v-for="tenant in userTenants" :key="tenant.id" :value="tenant.id">
                    {{ tenant.display_name || tenant.tenant_name }}
                  </option>
                </select>
                <p v-if="validationErrors.tenant_id" class="mt-1 text-xs text-red-500">{{ validationErrors.tenant_id }}</p>
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role <span class="text-red-500">*</span></label>
                <select 
                  v-model="staffForm.role_id" 
                  :class="['w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent', validationErrors.role_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                >
                  <option value="">Select Role</option>
                  <option v-for="role in roles" :key="role.id" :value="role.id">
                    {{ role.display_name }}
                  </option>
                </select>
                <p v-if="validationErrors.role_id" class="mt-1 text-xs text-red-500">{{ validationErrors.role_id }}</p>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <div class="flex items-center gap-2">
                <input 
                  v-model="staffForm.is_active" 
                  type="checkbox" 
                  id="staffStatus"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <label for="staffStatus" class="text-sm font-medium text-gray-900 dark:text-gray-300">
                  Active
                </label>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end gap-3 pt-4">
              <button type="button" @click="closeModal" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="!isFormValid || isSaving"
                :class="['px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg transition-all duration-200', isFormValid && !isSaving ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 hover:-translate-y-0.5' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed']"
              >
                <span v-if="isSaving" class="flex items-center gap-2">
                  <i class="fas fa-spinner fa-spin"></i>
                  {{ editingStaff ? 'Updating...' : 'Adding...' }}
                </span>
                <span v-else>{{ editingStaff ? 'Update Staff' : 'Add Staff' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../services/supabase.js'
import { useToast } from '../utils/useToast.js'
import { UserService } from '../services/userService.js'

// Reactive data
const staff = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const activeFilter = ref(true)
const filteredStaff = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortColumn = ref('first_name')
const sortDirection = ref('asc')
const showAddStaffModal = ref(false)
const editingStaff = ref(null)
const roles = ref([])
const userTenants = ref([])
const validationErrors = ref({})
const isSaving = ref(false)

// Form data
const staffForm = ref({
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  tenant_id: '',  // Use empty string for v-model compatibility
  role_id: '',    // Use empty string for v-model compatibility
  is_active: true
})

// Toast
const toast = useToast()

// Computed property for form validation - simple and clean
const isFormValid = computed(() => {
  const valid = (
    staffForm.value.first_name && 
    staffForm.value.last_name && 
    staffForm.value.email && 
    isValidEmail(staffForm.value.email) &&
    staffForm.value.tenant_id && staffForm.value.tenant_id !== '' &&
    staffForm.value.role_id && staffForm.value.role_id !== ''
  )
  
  // Debug logging
  console.log('Form validation check:', {
    first_name: !!staffForm.value.first_name,
    last_name: !!staffForm.value.last_name,
    email: !!staffForm.value.email,
    email_valid: isValidEmail(staffForm.value.email),
    tenant_id: staffForm.value.tenant_id,
    role_id: staffForm.value.role_id,
    overall_valid: valid
  })
  
  return valid
})

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone number input handler - only allow numbers, +, (), - and spaces
const handlePhoneInput = (event) => {
  // Remove any characters that aren't numbers, +, (), - or spaces
  const cleaned = event.target.value.replace(/[^0-9+() -]/g, '')
  staffForm.value.phone = cleaned
}

// Strip all non-numeric characters from phone number
const stripPhoneNumber = (phone) => {
  if (!phone) return null  // Return null for database
  // Remove everything except digits
  const stripped = phone.replace(/\D/g, '')
  return stripped.length > 0 ? stripped : null  // Return null if empty after stripping
}

// Convert string to proper case (first letter uppercase, rest lowercase for each word)
const toProperCase = (str) => {
  if (!str) return str
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

// Convert email to lowercase
const toLowerCaseEmail = (email) => {
  return email ? email.toLowerCase() : email
}

// Field validation
const validateField = (field) => {
  const errors = { ...validationErrors.value }
  
  switch(field) {
    case 'first_name':
      if (!staffForm.value.first_name) {
        errors.first_name = 'First name is required'
      } else {
        delete errors.first_name
      }
      break
    
    case 'last_name':
      if (!staffForm.value.last_name) {
        errors.last_name = 'Last name is required'
      } else {
        delete errors.last_name
      }
      break
    
    case 'email':
      if (!staffForm.value.email) {
        errors.email = 'Email is required'
      } else if (!isValidEmail(staffForm.value.email)) {
        errors.email = 'Please enter a valid email address'
      } else {
        delete errors.email
      }
      break
    
    case 'tenant_id':
      // Check for null, undefined, or empty string
      if (!staffForm.value.tenant_id || staffForm.value.tenant_id === '') {
        errors.tenant_id = 'Please select a school/campus'
      } else {
        delete errors.tenant_id
      }
      break
    
    case 'role_id':
      // Check for null, undefined, or empty string
      if (!staffForm.value.role_id || staffForm.value.role_id === '') {
        errors.role_id = 'Please select a role'
      } else {
        delete errors.role_id
      }
      break
  }
  
  validationErrors.value = errors
}

// Validate all fields
const validateAllFields = () => {
  validateField('first_name')
  validateField('last_name')
  validateField('email')
  validateField('tenant_id')
  validateField('role_id')
  return Object.keys(validationErrors.value).length === 0
}

// Load staff from Supabase
const loadStaff = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('StaffComponent: Loading staff from Supabase...')
    
    // Check if user has permission to read staff
    if (!hasPermission('staff_read_all')) {
      error.value = 'You do not have permission to view staff data'
      staff.value = []
      filteredStaff.value = []
      return
    }
    
    // Call the algo_get_staff function
    const { data, error: supabaseError } = await supabase.rpc('algo_get_staff')
    
    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`)
    }
    
    if (data && data.success) {
      console.log('StaffComponent: Successfully loaded staff:', data)
      
      // Update staff array with response data
      staff.value = data.staff || []
      
      // Apply initial filter
      filterStaff()
      
      console.log(`StaffComponent: Loaded ${staff.value.length} staff members`)
      
    } else {
      // Handle error response
      const errorMsg = data?.error || 'Unknown error occurred'
      console.error('StaffComponent: Error response from server:', errorMsg)
      // Don't hide data on email validation errors, just log the error
      if (errorMsg.includes('email') || errorMsg.includes('Email')) {
        console.warn('StaffComponent: Email validation issue detected, continuing to display data')
        // Continue with empty staff array if there's an email issue
        staff.value = []
        filteredStaff.value = []
      } else {
        error.value = errorMsg
        staff.value = []
        filteredStaff.value = []
      }
    }
    
  } catch (err) {
    console.error('StaffComponent: Error loading staff:', err)
    // Handle email validation errors gracefully
    if (err.message && (err.message.includes('email') || err.message.includes('Email'))) {
      console.warn('StaffComponent: Email validation issue, continuing with empty data')
      staff.value = []
      filteredStaff.value = []
    } else {
      error.value = err.message || 'Failed to load staff'
      staff.value = []
      filteredStaff.value = []
    }
  } finally {
    loading.value = false
  }
}

// Load roles from Supabase
const loadRoles = async () => {
  try {
    console.log('StaffComponent: Loading roles...')
    
    const { data, error: supabaseError } = await supabase.rpc('algo_get_roles')
    
    if (supabaseError) {
      throw new Error(`Failed to load roles: ${supabaseError.message}`)
    }
    
    if (data && data.success) {
      roles.value = data.roles || []
      console.log('StaffComponent: Loaded roles:', roles.value)
    } else {
      console.error('StaffComponent: Failed to load roles:', data?.error)
      roles.value = []
    }
  } catch (err) {
    console.error('StaffComponent: Error loading roles:', err)
    roles.value = []
  }
}

// Get user tenants from profile
const loadUserTenants = () => {
  try {
    const profile = UserService.getStoredProfile()
    console.log('StaffComponent: Loading user tenants from profile:', profile)
    
    if (profile && profile.available_tenants && Array.isArray(profile.available_tenants)) {
      userTenants.value = profile.available_tenants
      console.log('StaffComponent: User tenants loaded successfully:', userTenants.value)
      console.log('StaffComponent: Number of tenants:', userTenants.value.length)
      
      // Log each tenant for debugging
      userTenants.value.forEach((tenant, index) => {
        console.log(`StaffComponent: Tenant ${index} full object:`, tenant)
        console.log(`StaffComponent: Tenant ${index} properties:`, {
          id: tenant.id,
          tenant_id: tenant.tenant_id,
          display_name: tenant.display_name,
          tenant_name: tenant.tenant_name,
          name: tenant.name,
          is_current: tenant.is_current
        })
      })
    } else {
      console.warn('StaffComponent: No available_tenants found in profile or invalid format')
      console.log('StaffComponent: Profile structure:', {
        hasProfile: !!profile,
        hasAvailableTenants: !!(profile && profile.available_tenants),
        isArray: Array.isArray(profile && profile.available_tenants)
      })
      userTenants.value = []
    }
  } catch (err) {
    console.error('StaffComponent: Error loading user tenants:', err)
    userTenants.value = []
  }
}

// Computed properties
const totalPages = computed(() => Math.ceil(filteredStaff.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredStaff.value.length))

const paginatedStaff = computed(() => {
  return filteredStaff.value.slice(startIndex.value, endIndex.value)
})

// Methods
const filterStaff = () => {
  let filtered = [...staff.value]
  
  console.log('FilterStaff: Total staff:', staff.value.length)
  console.log('FilterStaff: Active filter:', activeFilter.value)
  console.log('FilterStaff: Active staff:', staff.value.filter(s => s.is_active).length)
  console.log('FilterStaff: Inactive staff:', staff.value.filter(s => !s.is_active).length)
  
  // Apply active filter
  if (activeFilter.value) {
    filtered = filtered.filter(s => s.is_active)
  }
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s => {
      const fullName = getFullName(s).toLowerCase()
      const phone = s.phone_number || s.phone || ''
      const roleName = (s.roles && s.roles.length > 0) ? s.roles[0].role_display_name : ''
      
      return fullName.includes(query) ||
        (s.email && s.email.toLowerCase().includes(query)) ||
        (phone && phone.toLowerCase().includes(query)) ||
        (roleName && roleName.toLowerCase().includes(query))
    })
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    const aVal = a[sortColumn.value] || ''
    const bVal = b[sortColumn.value] || ''
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  
  filteredStaff.value = filtered
  currentPage.value = 1
}

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
  filterStaff()
}

const getSortIcon = (column) => {
  if (sortColumn.value !== column) return ''
  return sortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}

const toggleStaffStatus = async (staffMember) => {
  try {
    // Validate email before proceeding
    if (!staffMember.email || !isValidEmail(staffMember.email)) {
      console.warn('StaffComponent: Staff member has invalid email, skipping status update')
      toast.error('Error', 'Cannot update staff member with invalid email address')
      return
    }
    
    const updatedData = {
      ...staffMember,
      is_active: !staffMember.is_active
    }
    
    console.log('StaffComponent: Toggling staff status:', updatedData)
    
    // Use first and last name directly
    const firstName = staffMember.first_name || ''
    const lastName = staffMember.last_name || ''
    
    // Extract role_id from roles array if it exists
    const roleId = staffMember.roles && staffMember.roles.length > 0 
      ? staffMember.roles[0].role_id 
      : (staffMember.role_id || null)
    
    const { data, error: supabaseError } = await supabase.rpc('algo_save_user', {
      p_first_name: toProperCase(firstName),
      p_last_name: toProperCase(lastName),
      p_role_id: roleId,
      p_email: toLowerCaseEmail(staffMember.email), // Convert to lowercase
      p_person_id: staffMember.id || null,
      p_phone_number: stripPhoneNumber(staffMember.phone) || null, // Strip non-numeric chars
      p_date_of_birth: staffMember.date_of_birth || null,
      p_street_address: toProperCase(staffMember.address) || null,
      p_city: toProperCase(staffMember.city) || null,
      p_state: staffMember.state || null,
      p_zip_code: staffMember.zip_code || null,
      p_tenant_id: staffMember.tenant_id || null,
      p_auth_user_id: staffMember.auth_user_id || null,
      p_user_uuid: staffMember.user_uuid || null
    })
    
    if (supabaseError) {
      throw new Error(`Failed to update status: ${supabaseError.message}`)
    }
    
    if (data && data.success) {
      // Update local data
      const index = staff.value.findIndex(s => s.id === staffMember.id)
      if (index !== -1) {
        staff.value[index].is_active = !staffMember.is_active
      }
      filterStaff()
      
      toast.success('Success', `Staff member ${updatedData.is_active ? 'activated' : 'deactivated'} successfully`)
    } else {
      throw new Error(data?.error || 'Failed to update status')
    }
  } catch (err) {
    console.error('StaffComponent: Error updating staff status:', err)
    toast.error('Error', err.message || 'Failed to update staff status')
  }
}

const openAddStaffModal = () => {
  // Initialize form for new staff member
  editingStaff.value = null
  staffForm.value = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    tenant_id: '',  // Empty string for v-model
    role_id: '',    // Empty string for v-model
    is_active: true
  }
  validationErrors.value = {}
  showAddStaffModal.value = true
  console.log('StaffComponent: Opened Add Staff modal with fresh form')
}

const editStaff = (staffMember) => {
  editingStaff.value = staffMember
  
  // Extract role_id from roles array if it exists
  const roleId = staffMember.roles && staffMember.roles.length > 0 
    ? staffMember.roles[0].role_id 
    : (staffMember.role_id || '')
  
  // Get current tenant_id from user context since it's not returned per staff member
  // All staff members in the list are from the current tenant anyway
  const currentTenantId = userTenants.value.find(t => t.is_current)?.id || ''
  
  staffForm.value = {
    id: staffMember.id,
    first_name: staffMember.first_name || '',
    last_name: staffMember.last_name || '',
    email: staffMember.email || '',
    phone: staffMember.phone_number || staffMember.phone || '',
    address: staffMember.street_address || staffMember.address || '',
    city: staffMember.city || '',
    state: staffMember.state || '',
    zip_code: staffMember.zip_code || '',
    tenant_id: staffMember.tenant_id || currentTenantId || '',  // Use current tenant if not in staff data
    role_id: roleId,                          // Extract from roles array
    is_active: staffMember.is_active || false
  }
  validationErrors.value = {}  // Clear validation errors when opening modal
  showAddStaffModal.value = true
  console.log('StaffComponent: Opened Edit Staff modal for:', staffMember.id, 'Role:', roleId, 'Tenant:', staffForm.value.tenant_id)
}

const viewStaff = (staffMember) => {
  console.log('Viewing staff member:', staffMember)
  // TODO: Implement view functionality - could navigate to detail page or show modal
  toast.info('Coming Soon', 'Staff member details view will be implemented soon')
}

const deleteStaff = async (staffMember) => {
  if (!confirm(`Are you sure you want to delete ${staffMember.first_name} ${staffMember.last_name}?`)) {
    return
  }
  
  try {
    console.log('StaffComponent: Deleting staff member:', staffMember.id)
    
    // For now, we'll mark the staff as inactive since there's no delete function yet
    // You can create a proper delete function in the database later
    const updatedData = {
      ...staffMember,
      is_active: false
    }
    
    // Extract role_id from roles array if it exists
    const roleId = staffMember.roles && staffMember.roles.length > 0 
      ? staffMember.roles[0].role_id 
      : (staffMember.role_id || null)
    
    const { data, error: supabaseError } = await supabase.rpc('algo_save_user', {
      p_first_name: toProperCase(staffMember.first_name),
      p_last_name: toProperCase(staffMember.last_name),
      p_role_id: roleId,
      p_email: toLowerCaseEmail(staffMember.email),
      p_person_id: staffMember.id,
      p_phone_number: stripPhoneNumber(staffMember.phone_number || staffMember.phone) || null,
      p_date_of_birth: staffMember.date_of_birth || null,
      p_street_address: toProperCase(staffMember.street_address || staffMember.address) || null,
      p_city: toProperCase(staffMember.city) || null,
      p_state: staffMember.state || null,
      p_zip_code: staffMember.zip_code || null,
      p_tenant_id: staffMember.tenant_id || null,
      p_auth_user_id: null,
      p_user_uuid: null
    })
    
    if (supabaseError) {
      throw new Error(`Failed to delete staff: ${supabaseError.message}`)
    }
    
    if (data && data.success) {
      toast.success('Success', 'Staff member has been deactivated')
      // Reload the staff list
      await loadStaff()
    } else {
      throw new Error(data?.error || 'Failed to delete staff member')
    }
  } catch (err) {
    console.error('StaffComponent: Error deleting staff:', err)
    toast.error('Error', err.message || 'Failed to delete staff member')
  }
}

const saveStaff = async () => {
  try {
    // Validate all fields before submission
    if (!validateAllFields()) {
      toast.error('Validation Error', 'Please fill in all required fields correctly')
      return
    }
    
    isSaving.value = true
    
    console.log('StaffComponent: Saving staff with form data:', {
      first_name: staffForm.value.first_name,
      last_name: staffForm.value.last_name,
      email: staffForm.value.email,
      phone: staffForm.value.phone,
      phone_stripped: stripPhoneNumber(staffForm.value.phone),
      tenant_id: staffForm.value.tenant_id,
      role_id: staffForm.value.role_id
    })
    
    // Ensure tenant_id and role_id are properly converted
    const tenantId = staffForm.value.tenant_id && staffForm.value.tenant_id !== '' ? staffForm.value.tenant_id : null
    const roleId = staffForm.value.role_id && staffForm.value.role_id !== '' ? staffForm.value.role_id : null
    
    const { data, error: supabaseError } = await supabase.rpc('algo_save_user', {
      p_first_name: toProperCase(staffForm.value.first_name),
      p_last_name: toProperCase(staffForm.value.last_name),
      p_role_id: roleId,
      p_email: toLowerCaseEmail(staffForm.value.email), // Convert to lowercase
      p_person_id: staffForm.value.id || null, // For update operations
      p_phone_number: stripPhoneNumber(staffForm.value.phone), // Strip non-numeric chars
      p_date_of_birth: null, // Not in the form currently
      p_street_address: toProperCase(staffForm.value.address) || null,
      p_city: toProperCase(staffForm.value.city) || null,
      p_state: staffForm.value.state || null, // State codes stay uppercase
      p_zip_code: staffForm.value.zip_code || null,
      p_tenant_id: tenantId,
      p_auth_user_id: null, // Will be set by the database function if needed
      p_user_uuid: null // Will be set by the database function if needed
    })
    
    if (supabaseError) {
      throw new Error(`Failed to save staff: ${supabaseError.message}`)
    }
    
    if (data && data.success) {
      toast.success('Success', editingStaff.value ? 'Staff member updated successfully' : 'Staff member added successfully')
      closeModal()
      await loadStaff() // Reload staff list
    } else {
      throw new Error(data?.error || 'Failed to save staff')
    }
  } catch (err) {
    console.error('StaffComponent: Error saving staff:', err)
    toast.error('Error', err.message || 'Failed to save staff member')
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  showAddStaffModal.value = false
  editingStaff.value = null
  staffForm.value = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    tenant_id: '',  // Empty string for v-model
    role_id: '',    // Empty string for v-model
    is_active: true
  }
  validationErrors.value = {}
  isSaving.value = false
}

// Helper function to get full name from staff member
const getFullName = (staff) => {
  const firstName = staff.first_name || ''
  const lastName = staff.last_name || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || staff.full_name || 'N/A'
}

// Permission checking functions
const hasPermission = (permissionName) => {
  try {
    const profile = UserService.getStoredProfile()
    if (profile && profile.permissions && Array.isArray(profile.permissions)) {
      // Check if user has super_admin permission (grants all permissions)
      if (profile.permissions.some(p => p.name === 'super_admin' && p.is_active)) {
        return true
      }
      // Check for specific permission
      return profile.permissions.some(p => p.name === permissionName && p.is_active)
    }
  } catch (error) {
    console.error(`Error checking ${permissionName} permission:`, error)
  }
  return false
}

// No watchers needed - just rely on the computed property

// Lifecycle
onMounted(() => {
  console.log('StaffComponent mounted')
  loadStaff()
  loadRoles()
  loadUserTenants()
})

// Expose refresh function for parent components
defineExpose({
  refreshStaff: loadStaff
})
</script>

<style scoped>
/* Reuse styles from StudentsComponent for consistency */
.staff-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.staff-content {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

/* Card gradient background */
.card-gradient-bg {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
}

.dark .card-gradient-bg {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%);
}

/* Card appear animation */
.card-appear {
  animation: cardAppear 0.5s ease-out;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
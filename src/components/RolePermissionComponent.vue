<template>
  <div class="role-permission-container w-full animated-gradient-bg floating-pattern-bg content-area-animated">
    <!-- Header -->
    <div class="card-gradient-bg card-appear border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-2 sm:py-4">
      <div class="flex flex-col gap-3 sm:gap-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <i class="fas fa-shield-alt text-blue-500 text-lg sm:text-xl"></i>
          <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Role & Permission Management</h2>
        </div>
        <!-- Tabs -->
        <div class="flex gap-1 border-b border-gray-200 dark:border-gray-700">
          <button
            @click="selectedView = 'roles'"
            :class="[
              'px-4 py-2 text-sm font-medium transition-all duration-200',
              selectedView === 'roles' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            Roles
          </button>
          <button
            @click="selectedView = 'permissions'"
            :class="[
              'px-4 py-2 text-sm font-medium transition-all duration-200',
              selectedView === 'permissions' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            Permissions
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-3 sm:p-6">
      <!-- Roles View -->
      <div v-if="selectedView === 'roles'" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <div
            v-for="(role, index) in roles"
            :key="role.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-appear-staggered"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ role.display_name || role.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ role.description }}</p>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Users:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ role.userCount }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Permissions:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ role.permissions.length }}</span>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="permission in expandedRoles.has(role.id) ? role.permissions : role.permissions.slice(0, 3)"
                  :key="permission.id || permission.name"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {{ permission.display_name || permission.name }}
                </span>
                <button
                  v-if="role.permissions.length > 3"
                  @click="toggleRoleExpansion(role.id)"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  {{ expandedRoles.has(role.id) ? 'Show less' : `+${role.permissions.length - 3} more` }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions View -->
      <div v-if="selectedView === 'permissions'" class="space-y-6">
        <!-- Search Box -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 card-appear">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0">
              <i class="fas fa-search text-gray-400 dark:text-gray-500"></i>
            </div>
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search permissions by name, description, or resource..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div v-if="searchQuery" class="flex-shrink-0">
              <button
                @click="searchQuery = ''"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                title="Clear search"
              >
                <i class="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ filteredPermissions.length }} of {{ permissions.length }} permissions
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden card-appear">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resource</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permission</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="filteredPermissions.length === 0" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td colspan="3" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="fas fa-search text-4xl text-gray-300 dark:text-gray-600"></i>
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No permissions found</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ searchQuery ? `No permissions match "${searchQuery}"` : 'No permissions available' }}
                      </p>
                    </div>
                    <button
                      v-if="searchQuery"
                      @click="searchQuery = ''"
                      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                    >
                      Clear search
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="permission in sortedFilteredPermissions" :key="permission.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    {{ permission.resource }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ permission.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ permission.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase.js'

// State
const selectedView = ref('roles')
const searchQuery = ref('')
const expandedRoles = ref(new Set()) // Track which roles have expanded permissions

// Data arrays
const roles = ref([])
const permissions = ref([])
const rolePermissions = ref([])
const loading = ref(true)

// Computed properties
const filteredPermissions = computed(() => {
  if (!searchQuery.value.trim()) {
    return permissions.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return permissions.value.filter(permission => 
    permission.name.toLowerCase().includes(query) ||
    permission.description.toLowerCase().includes(query) ||
    permission.resource.toLowerCase().includes(query)
  )
})

// Sort filtered permissions by resource first, then by name
const sortedFilteredPermissions = computed(() => {
  return [...filteredPermissions.value].sort((a, b) => {
    // First sort by resource
    const resourceCompare = (a.resource || '').localeCompare(b.resource || '')
    if (resourceCompare !== 0) return resourceCompare
    
    // Then sort by name within the same resource
    return (a.name || '').localeCompare(b.name || '')
  })
})

// Load all data with a single API call
const loadAllData = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .rpc('algo_get_role_management_data')
    
    if (error) throw error
    
    // Process roles - they already include userCount and permissions
    roles.value = (data.roles || []).map(role => ({
      ...role,
      userCount: role.user_count || 0, // Use the actual user count from the API
      permissions: role.permissions || [] // Permissions are already included
    }))
    
    // Process permissions
    permissions.value = (data.permissions || []).map(permission => ({
      ...permission,
      resource: permission.resource || 'general',
      roleCount: 0 // Will be calculated from rolePermissions
    }))
    
    // Store role permissions for reference
    rolePermissions.value = data.role_permissions || []
    
    // Update permissions with role count
    permissions.value.forEach(permission => {
      permission.roleCount = rolePermissions.value.filter(rp => rp.permission_id === permission.id).length
    })
    
    // Log summary if available
    if (data.summary) {
      console.log('Role Management Summary:', data.summary)
    }
    
  } catch (error) {
    console.error('Error loading role management data:', error)
  } finally {
    loading.value = false
  }
}

// Toggle expansion of permissions for a role
const toggleRoleExpansion = (roleId) => {
  if (expandedRoles.value.has(roleId)) {
    expandedRoles.value.delete(roleId)
  } else {
    expandedRoles.value.add(roleId)
  }
  // Force reactivity update
  expandedRoles.value = new Set(expandedRoles.value)
}

onMounted(() => {
  console.log('RolePermissionComponent mounted')
  loadAllData()
})
</script>
<template>
  <div class="role-permission-container w-full animated-gradient-bg floating-pattern-bg content-area-animated">
    <!-- Header -->
    <div class="card-gradient-bg card-appear border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-2 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <i class="fas fa-shield-alt text-blue-500 text-lg sm:text-xl"></i>
          <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Role & Permission Management</h2>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <select v-model="selectedView" class="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="roles">Roles</option>
            <option value="permissions">Permissions</option>
            <option value="users">User Assignments</option>
          </select>
          <button @click="showAddModal = true" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <i class="fas fa-plus text-xs sm:text-sm"></i>
            <span class="hidden sm:inline">Add {{ selectedView === 'roles' ? 'Role' : selectedView === 'permissions' ? 'Permission' : 'Assignment' }}</span>
            <span class="sm:hidden">Add</span>
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
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ role.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ role.description }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button @click="editRole(role)" class="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Edit Role">
                  <HandDrawnIcon name="edit" size="sm" />
                </button>
                <button @click="deleteRole(role)" class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Delete Role">
                  <HandDrawnIcon name="trash" size="sm" />
                </button>
              </div>
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
                  v-for="permission in role.permissions.slice(0, 3)"
                  :key="permission"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {{ permission }}
                </span>
                <span
                  v-if="role.permissions.length > 3"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  +{{ role.permissions.length - 3 }} more
                </span>
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
                placeholder="Search permissions by name, description, or category..."
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permission</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Roles</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="filteredPermissions.length === 0" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td colspan="5" class="px-6 py-12 text-center">
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
              <tr v-else v-for="permission in filteredPermissions" :key="permission.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ permission.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ permission.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    {{ permission.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ permission.roleCount }} roles</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button @click="editPermission(permission)" class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 transition-all duration-200 hover:scale-105">Edit</button>
                    <button @click="deletePermission(permission)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 transition-all duration-200 hover:scale-105">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Users View -->
      <div v-if="selectedView === 'users'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Active</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="user in userAssignments" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(user.lastActive) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="changeUserRole(user)" class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 transition-all duration-200 hover:scale-105">Change Role</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-md" @click.stop>
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editing ? 'Edit' : 'Add' }} {{ selectedView === 'roles' ? 'Role' : 'Permission' }}
          </h3>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <form @submit.prevent="save" class="space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input v-model="form.name" type="text" required class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>
            <div v-if="selectedView === 'permissions'">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select v-model="form.category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="user">User Management</option>
                <option value="content">Content Management</option>
                <option value="system">System Administration</option>
                <option value="academic">Academic Management</option>
              </select>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4">
              <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
                {{ editing ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase.js'
import HandDrawnIcon from './HandDrawnIcon.vue'

// State
const selectedView = ref('roles')
const showAddModal = ref(false)
const editing = ref(false)
const searchQuery = ref('')
const form = ref({
  name: '',
  description: '',
  category: 'user'
})

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
    permission.category.toLowerCase().includes(query)
  )
})

// Load data from Supabase
const loadRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('algo_roles')
      .select('*')
      .order('name')
    
    if (error) throw error
    roles.value = data.map(role => ({
      ...role,
      userCount: 0, // TODO: Get actual user count
      permissions: []
    }))
  } catch (error) {
    console.error('Error loading roles:', error)
  }
}

const loadPermissions = async () => {
  try {
    const { data, error } = await supabase
      .from('algo_permissions')
      .select('*')
      .order('name')
    
    if (error) throw error
    permissions.value = data.map(permission => ({
      ...permission,
      category: permission.resource || 'general',
      roleCount: 0 // Will be calculated after loading role-permissions
    }))
  } catch (error) {
    console.error('Error loading permissions:', error)
  }
}

const loadRolePermissions = async () => {
  try {
    const { data, error } = await supabase
      .from('algo_role_permissions')
      .select(`
        role_id,
        permission_id,
        algo_roles!inner(name),
        algo_permissions!inner(name)
      `)
    
    if (error) throw error
    rolePermissions.value = data
    
    // Update roles with their permissions
    roles.value.forEach(role => {
      role.permissions = data
        .filter(rp => rp.role_id === role.id)
        .map(rp => rp.algo_permissions.name)
    })
    
    // Update permissions with role count
    permissions.value.forEach(permission => {
      permission.roleCount = data.filter(rp => rp.permission_id === permission.id).length
    })
  } catch (error) {
    console.error('Error loading role permissions:', error)
  }
}

const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadRoles(),
      loadPermissions(),
      loadRolePermissions()
    ])
  } finally {
    loading.value = false
  }
}

// User assignments - TODO: Implement actual user data
const userAssignments = ref([])

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const editRole = (role) => {
  editing.value = true
  form.value = { ...role }
  showAddModal.value = true
}

const editPermission = (permission) => {
  editing.value = true
  form.value = { ...permission }
  showAddModal.value = true
}

const deleteRole = async (role) => {
  if (confirm(`Are you sure you want to delete the role "${role.name || role.display_name}"?`)) {
    try {
      const { error } = await supabase
        .from('algo_roles')
        .delete()
        .eq('id', role.id)
      
      if (error) throw error
      await loadRoles()
      await loadRolePermissions()
    } catch (error) {
      console.error('Error deleting role:', error)
      alert('Error deleting role. Please try again.')
    }
  }
}

const deletePermission = async (permission) => {
  if (confirm(`Are you sure you want to delete the permission "${permission.name || permission.display_name}"?`)) {
    try {
      const { error } = await supabase
        .from('algo_permissions')
        .delete()
        .eq('id', permission.id)
      
      if (error) throw error
      await loadPermissions()
      await loadRolePermissions()
    } catch (error) {
      console.error('Error deleting permission:', error)
      alert('Error deleting permission. Please try again.')
    }
  }
}

const changeUserRole = (user) => {
  // This would open a role selection modal in a real app
  console.log('Changing role for user:', user)
}

const save = async () => {
  try {
    if (selectedView.value === 'roles') {
      if (editing.value) {
        const { error } = await supabase
          .from('algo_roles')
          .update({
            name: form.value.name,
            display_name: form.value.name,
            description: form.value.description
          })
          .eq('id', form.value.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('algo_roles')
          .insert({
            name: form.value.name.toLowerCase().replace(/\s+/g, '_'),
            display_name: form.value.name,
            description: form.value.description,
            is_active: true
          })
        
        if (error) throw error
      }
      await loadRoles()
      await loadRolePermissions()
    } else if (selectedView.value === 'permissions') {
      if (editing.value) {
        const { error } = await supabase
          .from('algo_permissions')
          .update({
            name: form.value.name,
            display_name: form.value.name,
            description: form.value.description,
            resource: form.value.category
          })
          .eq('id', form.value.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('algo_permissions')
          .insert({
            name: form.value.name.toLowerCase().replace(/\s+/g, '_'),
            display_name: form.value.name,
            description: form.value.description,
            resource: form.value.category,
            action: 'access',
            is_active: true
          })
        
        if (error) throw error
      }
      await loadPermissions()
      await loadRolePermissions()
    }
    closeModal()
  } catch (error) {
    console.error('Error saving:', error)
    alert('Error saving data. Please try again.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  editing.value = false
  form.value = {
    name: '',
    description: '',
    category: 'user'
  }
}

onMounted(() => {
  console.log('RolePermissionComponent mounted')
  loadAllData()
})
</script>
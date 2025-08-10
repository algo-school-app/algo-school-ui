<template>
  <div class="agent-tools-table-container h-full flex flex-col overflow-hidden">
    <!-- Header with Actions -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div class="flex items-center gap-2 sm:gap-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Agent-Tool Relationships ({{ relationships.length }})</h3>
          <!-- Search -->
          <div class="relative flex-1 sm:flex-none">
            <i class="fas fa-search absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search relationships..."
              class="w-full sm:w-64 pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Agent Filter -->
          <select v-model="selectedAgentFilter" class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Agents</option>
            <option v-for="agent in agents" :key="agent.id" :value="agent.id">
              {{ agent.display_name }}
            </option>
          </select>
          <!-- Tool Filter -->
          <select v-model="selectedToolFilter" class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Tools</option>
            <option v-for="tool in tools" :key="tool.id" :value="tool.id">
              {{ tool.display_name }}
            </option>
          </select>
          <button @click="showCreateModal = true" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <i class="fas fa-plus text-xs sm:text-sm"></i>
            <span class="hidden sm:inline">New Relationship</span>
            <span class="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading relationships...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredRelationships.length === 0" class="flex-1 flex items-center justify-center">
      <div class="text-center max-w-md mx-auto">
        <i class="fas fa-link text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Relationships Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ searchQuery || selectedAgentFilter || selectedToolFilter ? 'No relationships match your criteria.' : 'No agent-tool relationships have been configured yet.' }}
        </p>
        <button v-if="!searchQuery && !selectedAgentFilter && !selectedToolFilter" @click="showCreateModal = true" class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto">
          <i class="fas fa-plus"></i>
          Create First Relationship
        </button>
      </div>
    </div>

    <!-- Relationships Table -->
    <div v-else class="flex-1 overflow-auto">
      <table class="min-w-full bg-white dark:bg-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
          <tr>
            <th @click="sortBy('agent_name')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex items-center gap-2">
                Agent
                <i class="fas fa-sort text-gray-400" :class="getSortIcon('agent_name')"></i>
              </div>
            </th>
            <th @click="sortBy('tool_name')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex items-center gap-2">
                Tool
                <i class="fas fa-sort text-gray-400" :class="getSortIcon('tool_name')"></i>
              </div>
            </th>
            <th @click="sortBy('priority')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex items-center gap-2">
                Priority
                <i class="fas fa-sort text-gray-400" :class="getSortIcon('priority')"></i>
              </div>
            </th>
            <th @click="sortBy('is_active')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex items-center gap-2">
                Status
                <i class="fas fa-sort text-gray-400" :class="getSortIcon('is_active')"></i>
              </div>
            </th>
            <th @click="sortBy('created_at')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hidden lg:table-cell">
              <div class="flex items-center gap-2">
                Created
                <i class="fas fa-sort text-gray-400" :class="getSortIcon('created_at')"></i>
              </div>
            </th>
            <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="relationship in paginatedRelationships" :key="relationship.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-robot text-blue-600 dark:text-blue-400 text-sm"></i>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ getAgentName(relationship.agent_id) }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ relationship.agent_id }}</div>
                </div>
              </div>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-tools text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ getToolName(relationship.tool_id) }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ relationship.tool_id }}</div>
                </div>
              </div>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  getPriorityClass(relationship.priority)
                ]">
                  {{ relationship.priority }}
                </span>
                <button @click="adjustPriority(relationship, -1)" :disabled="relationship.priority <= 1" class="ml-2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i class="fas fa-arrow-up text-xs"></i>
                </button>
                <button @click="adjustPriority(relationship, 1)" class="p-1 text-gray-400 hover:text-gray-600">
                  <i class="fas fa-arrow-down text-xs"></i>
                </button>
              </div>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <label class="inline-flex items-center">
                <input 
                  type="checkbox" 
                  :checked="relationship.is_active" 
                  @change="toggleRelationshipStatus(relationship)"
                  class="sr-only"
                >
                <div class="relative">
                  <div :class="[
                    'block w-10 h-6 rounded-full transition-colors',
                    relationship.is_active ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                  ]"></div>
                  <div :class="[
                    'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
                    relationship.is_active ? 'transform translate-x-4' : ''
                  ]"></div>
                </div>
              </label>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
              {{ formatDate(relationship.created_at) }}
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-3">
                <button @click="editRelationship(relationship)" class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Edit">
                  <HandDrawnIcon name="edit" size="sm" />
                </button>
                <button @click="deleteRelationship(relationship)" class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Delete">
                  <HandDrawnIcon name="trash" size="sm" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredRelationships.length > itemsPerPage" class="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredRelationships.length }} relationships
        </div>
        <div class="flex items-center gap-1 sm:gap-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="px-2 sm:px-3 py-1 sm:py-2 text-sm text-gray-700 dark:text-gray-300">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AgentToolModal
      v-if="showCreateModal || showEditModal"
      :relationship="editingRelationship"
      :agents="agents"
      :tools="tools"
      :is-edit="showEditModal"
      @close="closeModal"
      @saved="handleRelationshipSaved"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationDialog
      ref="confirmDialog"
      title="Delete Relationship"
      :message="deletingRelationship ? `Are you sure you want to remove the relationship between '${getAgentName(deletingRelationship.agent_id)}' and '${getToolName(deletingRelationship.tool_id)}'?` : ''"
      confirm-text="Delete"
      confirm-icon="fas fa-trash"
      @confirm="confirmDelete"
      @cancel="deletingRelationship = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { agentAPIService } from '../../services/agentAPIService.js'
import AgentToolModal from './AgentToolModal.vue'
import ConfirmationDialog from '../ConfirmationDialog.vue'
import HandDrawnIcon from '../HandDrawnIcon.vue'

const props = defineProps({
  relationships: {
    type: Array,
    default: () => []
  },
  agents: {
    type: Array,
    default: () => []
  },
  tools: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh', 'relationship-updated'])

// State
const searchQuery = ref('')
const selectedAgentFilter = ref('')
const selectedToolFilter = ref('')
const sortField = ref('priority')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(15)

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const confirmDialog = ref(null)
const editingRelationship = ref(null)
const deletingRelationship = ref(null)

// Computed
const filteredRelationships = computed(() => {
  let filtered = [...props.relationships]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(rel => {
      const agentName = getAgentName(rel.agent_id).toLowerCase()
      const toolName = getToolName(rel.tool_id).toLowerCase()
      return agentName.includes(query) || toolName.includes(query) || rel.agent_id.toString().includes(query) || rel.tool_id.toString().includes(query)
    })
  }

  // Agent filter
  if (selectedAgentFilter.value) {
    filtered = filtered.filter(rel => rel.agent_id == selectedAgentFilter.value)
  }

  // Tool filter
  if (selectedToolFilter.value) {
    filtered = filtered.filter(rel => rel.tool_id == selectedToolFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    if (sortField.value === 'agent_name') {
      aVal = getAgentName(a.agent_id).toLowerCase()
      bVal = getAgentName(b.agent_id).toLowerCase()
    } else if (sortField.value === 'tool_name') {
      aVal = getToolName(a.tool_id).toLowerCase()
      bVal = getToolName(b.tool_id).toLowerCase()
    } else if (sortField.value === 'created_at') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredRelationships.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredRelationships.value.length))

const paginatedRelationships = computed(() => {
  return filteredRelationships.value.slice(startIndex.value, endIndex.value)
})

// Methods
const getAgentName = (agentId) => {
  const agent = props.agents.find(a => a.id == agentId)
  return agent ? agent.display_name : `Agent ${agentId}`
}

const getToolName = (toolId) => {
  const tool = props.tools.find(t => t.id == toolId)
  return tool ? tool.display_name : `Tool ${toolId}`
}

const getPriorityClass = (priority) => {
  if (priority <= 5) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  if (priority <= 10) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  if (priority <= 20) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return 'fa-sort'
  return sortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const adjustPriority = async (relationship, direction) => {
  try {
    const newPriority = Math.max(1, relationship.priority + direction)
    const updatedRelationship = { ...relationship, priority: newPriority }
    await agentAPIService.updateAgentTool(relationship.id, updatedRelationship)
    emit('relationship-updated')
  } catch (error) {
    console.error('Error updating priority:', error)
  }
}

const editRelationship = (relationship) => {
  editingRelationship.value = { ...relationship }
  showEditModal.value = true
}

const deleteRelationship = (relationship) => {
  deletingRelationship.value = relationship
  confirmDialog.value.open()
}

const toggleRelationshipStatus = async (relationship) => {
  try {
    const updatedRelationship = { ...relationship, is_active: !relationship.is_active }
    await agentAPIService.updateAgentTool(relationship.id, updatedRelationship)
    emit('relationship-updated')
  } catch (error) {
    console.error('Error updating relationship status:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingRelationship.value = null
}

const handleRelationshipSaved = () => {
  closeModal()
  emit('relationship-updated')
}

const confirmDelete = async () => {
  try {
    await agentAPIService.deleteAgentTool(deletingRelationship.value.id)
    deletingRelationship.value = null
    emit('relationship-updated')
  } catch (error) {
    console.error('Error deleting relationship:', error)
  }
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedAgentFilter, selectedToolFilter], () => {
  currentPage.value = 1
})
</script>
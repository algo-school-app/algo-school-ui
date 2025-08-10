<template>
  <div class="tools-table-container h-full flex flex-col overflow-hidden">
    <!-- Header with Actions -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div class="flex items-center gap-2 sm:gap-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Tools ({{ tools.length }})</h3>
          <!-- Search -->
          <div class="relative flex-1 sm:flex-none">
            <i class="fas fa-search absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search tools..."
              class="w-full sm:w-64 pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </div>
        <button @click="showCreateModal = true" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
          <i class="fas fa-plus text-xs sm:text-sm"></i>
          <span class="hidden sm:inline">New Tool</span>
          <span class="sm:hidden">New</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading tools...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTools.length === 0" class="flex-1 flex items-center justify-center">
      <div class="text-center max-w-md mx-auto">
        <i class="fas fa-tools text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Tools Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ searchQuery ? 'No tools match your search criteria.' : 'No AI tools have been configured yet.' }}
        </p>
        <button v-if="!searchQuery" @click="showCreateModal = true" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto">
          <i class="fas fa-plus"></i>
          Create First Tool
        </button>
      </div>
    </div>

    <!-- Tools Table -->
    <div v-else class="flex-1 overflow-auto">
      <table class="min-w-full bg-white dark:bg-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
          <tr>
            <th @click="sortBy('display_name')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex items-center gap-2">
                Name
                <i class="fas fa-sort text-gray-400" :class="getSortIcon('display_name')"></i>
              </div>
            </th>
            <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Description</th>
            <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permission</th>
            <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Module/Class</th>
            <th @click="sortBy('is_active')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex items-center gap-2">
                Status
                <i class="fas fa-sort text-gray-400" :class="getSortIcon('is_active')"></i>
              </div>
            </th>
            <th @click="sortBy('updated_at')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hidden xl:table-cell">
              <div class="flex items-center gap-2">
                Updated
                <i class="fas fa-sort text-gray-400" :class="getSortIcon('updated_at')"></i>
              </div>
            </th>
            <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="tool in paginatedTools" :key="tool.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-tools text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ tool.display_name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ tool.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
              <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate" :title="tool.description">
                {{ tool.description || 'No description' }}
              </div>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                {{ tool.permission_required || 'None' }}
              </span>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                <div>{{ tool.tool_module || 'N/A' }}</div>
                <div class="font-mono">{{ tool.tool_class || 'N/A' }}</div>
              </div>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <label class="inline-flex items-center">
                <input 
                  type="checkbox" 
                  :checked="tool.is_active" 
                  @change="toggleToolStatus(tool)"
                  class="sr-only"
                >
                <div class="relative">
                  <div :class="[
                    'block w-10 h-6 rounded-full transition-colors',
                    tool.is_active ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  ]"></div>
                  <div :class="[
                    'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
                    tool.is_active ? 'transform translate-x-4' : ''
                  ]"></div>
                </div>
              </label>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden xl:table-cell">
              {{ formatDate(tool.updated_at) }}
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-3">
                <button @click="editTool(tool)" class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Edit">
                  <HandDrawnIcon name="edit" size="sm" />
                </button>
                <button @click="viewSystemPrompt(tool)" class="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="View System Prompt">
                  <HandDrawnIcon name="eye" size="sm" />
                </button>
                <button @click="deleteTool(tool)" class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110 hover:-translate-y-1" title="Delete">
                  <HandDrawnIcon name="trash" size="sm" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredTools.length > itemsPerPage" class="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredTools.length }} tools
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
    <ToolModal
      v-if="showCreateModal || showEditModal"
      :tool="editingTool"
      :is-edit="showEditModal"
      @close="closeModal"
      @saved="handleToolSaved"
    />


    <!-- System Prompt Modal -->
    <SystemPromptModal
      v-if="showSystemPromptModal"
      :agent="viewingTool"
      :is-tool="true"
      @close="showSystemPromptModal = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationDialog
      ref="confirmDialog"
      title="Delete Tool"
      :message="deletingTool ? `Are you sure you want to delete '${deletingTool.display_name}'? This action cannot be undone and will affect all agents using this tool.` : ''"
      confirm-text="Delete"
      confirm-icon="fas fa-trash"
      @confirm="confirmDelete"
      @cancel="deletingTool = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { agentAPIService } from '../../services/agentAPIService.js'
import ToolModal from './ToolModal.vue'
import SystemPromptModal from './SystemPromptModal.vue'
import ConfirmationDialog from '../ConfirmationDialog.vue'
import HandDrawnIcon from '../HandDrawnIcon.vue'

const props = defineProps({
  tools: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh', 'tool-updated'])

// State
const searchQuery = ref('')
const sortField = ref('display_name')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showSystemPromptModal = ref(false)
const confirmDialog = ref(null)
const editingTool = ref(null)
const viewingTool = ref(null)
const deletingTool = ref(null)

// Computed
const filteredTools = computed(() => {
  let filtered = [...props.tools]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.display_name.toLowerCase().includes(query) ||
      (tool.description && tool.description.toLowerCase().includes(query)) ||
      (tool.permission_required && tool.permission_required.toLowerCase().includes(query)) ||
      (tool.tool_module && tool.tool_module.toLowerCase().includes(query)) ||
      (tool.tool_class && tool.tool_class.toLowerCase().includes(query))
    )
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    if (sortField.value === 'updated_at') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredTools.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredTools.value.length))

const paginatedTools = computed(() => {
  return filteredTools.value.slice(startIndex.value, endIndex.value)
})

// Methods
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const editTool = (tool) => {
  editingTool.value = { ...tool }
  showEditModal.value = true
}

const viewSystemPrompt = (tool) => {
  viewingTool.value = tool
  showSystemPromptModal.value = true
}

const deleteTool = (tool) => {
  deletingTool.value = tool
  confirmDialog.value.open()
}

const toggleToolStatus = async (tool) => {
  try {
    const updatedTool = { ...tool, is_active: !tool.is_active }
    await agentAPIService.updateTool(tool.id, updatedTool)
    emit('tool-updated')
  } catch (error) {
    console.error('Error updating tool status:', error)
    // Could show a toast notification here
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTool.value = null
}

const handleToolSaved = () => {
  closeModal()
  emit('tool-updated')
}

const confirmDelete = async () => {
  try {
    await agentAPIService.deleteTool(deletingTool.value.id)
    deletingTool.value = null
    emit('tool-updated')
  } catch (error) {
    console.error('Error deleting tool:', error)
    // Could show a toast notification here
  }
}

// Watch for search changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <i class="fas fa-link text-purple-600 dark:text-purple-400"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEdit ? 'Edit Relationship' : 'Create Agent-Tool Relationship' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ isEdit ? 'Update agent-tool relationship' : 'Connect an agent to a tool' }}
            </p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <!-- Agent Selection -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-robot text-blue-500"></i>
              Agent Selection
            </h4>

            <div>
              <label for="agent_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Agent <span class="text-red-500">*</span>
              </label>
              <select
                id="agent_id"
                v-model="form.agent_id"
                required
                :disabled="isEdit"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Choose an agent...</option>
                <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                  {{ agent.display_name }} ({{ agent.name }})
                </option>
              </select>
              <p v-if="isEdit" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Agent cannot be changed when editing
              </p>
            </div>

            <!-- Selected Agent Preview -->
            <div v-if="selectedAgent" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-robot text-blue-600 dark:text-blue-400 text-sm"></i>
                </div>
                <div>
                  <div class="text-sm font-medium text-blue-900 dark:text-blue-100">{{ selectedAgent.display_name }}</div>
                  <div class="text-xs text-blue-700 dark:text-blue-300">{{ selectedAgent.description || 'No description' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tool Selection -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-tools text-green-500"></i>
              Tool Selection
            </h4>

            <div>
              <label for="tool_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Tool <span class="text-red-500">*</span>
              </label>
              <select
                id="tool_id"
                v-model="form.tool_id"
                required
                :disabled="isEdit"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Choose a tool...</option>
                <option v-for="tool in availableTools" :key="tool.id" :value="tool.id">
                  {{ tool.display_name }} ({{ tool.name }})
                </option>
              </select>
              <p v-if="isEdit" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tool cannot be changed when editing
              </p>
            </div>

            <!-- Selected Tool Preview -->
            <div v-if="selectedTool" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-tools text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <div>
                  <div class="text-sm font-medium text-green-900 dark:text-green-100">{{ selectedTool.display_name }}</div>
                  <div class="text-xs text-green-700 dark:text-green-300">{{ selectedTool.description || 'No description' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Relationship Configuration -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-cog text-orange-500"></i>
              Relationship Configuration
            </h4>

            <!-- Priority -->
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center gap-3">
                <input
                  id="priority"
                  v-model.number="form.priority"
                  type="number"
                  min="1"
                  max="100"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                <div class="flex gap-1">
                  <button type="button" @click="form.priority = Math.max(1, form.priority - 1)" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <i class="fas fa-minus text-xs"></i>
                  </button>
                  <button type="button" @click="form.priority = Math.min(100, form.priority + 1)" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <i class="fas fa-plus text-xs"></i>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    :class="[
                      'h-2 rounded-full transition-all',
                      getPriorityBarClass()
                    ]"
                    :style="{ width: `${form.priority}%` }"
                  ></div>
                </div>
                <span :class="['text-xs font-medium', getPriorityTextClass()]">
                  {{ getPriorityLabel() }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lower values = higher priority (1 = highest, 100 = lowest)
              </p>
            </div>

            <!-- Status -->
            <div class="flex items-center justify-between">
              <div>
                <label for="is_active" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Relationship Status
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400">Enable or disable this relationship</p>
              </div>
              <label class="inline-flex items-center">
                <input 
                  id="is_active"
                  v-model="form.is_active" 
                  type="checkbox"
                  class="sr-only"
                >
                <div class="relative">
                  <div :class="[
                    'block w-12 h-6 rounded-full transition-colors',
                    form.is_active ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                  ]"></div>
                  <div :class="[
                    'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
                    form.is_active ? 'transform translate-x-6' : ''
                  ]"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving || !isFormValid"
              class="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 order-1 sm:order-2"
            >
              <i v-if="isSaving" class="fas fa-spinner animate-spin"></i>
              <i v-else class="fas fa-link"></i>
              {{ isSaving ? 'Saving...' : (isEdit ? 'Update Relationship' : 'Create Relationship') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { agentAPIService } from '../../services/agentAPIService.js'

const props = defineProps({
  relationship: {
    type: Object,
    default: null
  },
  agents: {
    type: Array,
    default: () => []
  },
  tools: {
    type: Array,
    default: () => []
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

// State
const isSaving = ref(false)

// Form data
const form = ref({
  agent_id: '',
  tool_id: '',
  priority: 10,
  is_active: true
})

// Computed
const isFormValid = computed(() => {
  return form.value.agent_id && form.value.tool_id && form.value.priority >= 1
})

const selectedAgent = computed(() => {
  return props.agents.find(agent => agent.id == form.value.agent_id)
})

const selectedTool = computed(() => {
  return props.tools.find(tool => tool.id == form.value.tool_id)
})

const availableTools = computed(() => {
  return props.tools.filter(tool => tool.is_active)
})

// Priority helpers
const getPriorityBarClass = () => {
  if (form.value.priority <= 5) return 'bg-red-500'
  if (form.value.priority <= 10) return 'bg-yellow-500'
  if (form.value.priority <= 20) return 'bg-green-500'
  return 'bg-gray-400'
}

const getPriorityTextClass = () => {
  if (form.value.priority <= 5) return 'text-red-600 dark:text-red-400'
  if (form.value.priority <= 10) return 'text-yellow-600 dark:text-yellow-400'
  if (form.value.priority <= 20) return 'text-green-600 dark:text-green-400'
  return 'text-gray-600 dark:text-gray-400'
}

const getPriorityLabel = () => {
  if (form.value.priority <= 5) return 'High'
  if (form.value.priority <= 10) return 'Medium'
  if (form.value.priority <= 20) return 'Normal'
  return 'Low'
}

// Methods
const resetForm = () => {
  if (props.isEdit && props.relationship) {
    // Populate form with existing relationship data
    form.value = {
      agent_id: props.relationship.agent_id || '',
      tool_id: props.relationship.tool_id || '',
      priority: props.relationship.priority || 10,
      is_active: props.relationship.is_active ?? true
    }
  } else {
    // Reset to defaults for new relationship
    form.value = {
      agent_id: '',
      tool_id: '',
      priority: 10,
      is_active: true
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value || isSaving.value) return

  try {
    isSaving.value = true

    const relationshipData = {
      agent_id: parseInt(form.value.agent_id),
      tool_id: parseInt(form.value.tool_id),
      priority: form.value.priority,
      is_active: form.value.is_active
    }

    if (props.isEdit && props.relationship) {
      await agentAPIService.updateAgentTool(props.relationship.id, relationshipData)
    } else {
      await agentAPIService.createAgentTool(relationshipData)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving relationship:', error)
    // Could show a toast notification here
  } finally {
    isSaving.value = false
  }
}

// Initialize form when component mounts or props change
watch(() => [props.relationship, props.isEdit], resetForm, { immediate: true })
</script>

<style scoped>
/* Custom scrollbar for the modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Form focus effects */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
  
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
}
</style>
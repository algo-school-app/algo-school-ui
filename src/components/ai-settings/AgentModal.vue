<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleOverlayClick" @keydown.escape="$emit('close')" tabindex="0">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <i class="fas fa-robot text-blue-600 dark:text-blue-400"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ isEdit ? 'Edit Agent' : 'Create New Agent' }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ isEdit ? 'Update agent details' : 'Configure a new AI agent' }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col" style="height: calc(90vh - 120px);">
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6" style="max-height: calc(90vh - 200px);">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-info-circle text-blue-500"></i>
              Basic Information
            </h4>

            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Technical Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="e.g., gpt_4_teacher"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Unique identifier for the agent (lowercase, underscores allowed)</p>
            </div>

            <!-- Display Name -->
            <div>
              <label for="display_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name <span class="text-red-500">*</span>
              </label>
              <input
                id="display_name"
                v-model="form.display_name"
                type="text"
                required
                placeholder="e.g., GPT-4 Teaching Assistant"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                placeholder="Describe the agent's purpose and capabilities..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Configuration -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-cog text-green-500"></i>
              Configuration
            </h4>

            <!-- Permission Required -->
            <div>
              <label for="permission_required" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Permission Required
              </label>
              <input
                id="permission_required"
                v-model="form.permission_required"
                type="text"
                placeholder="e.g., agents_use_teacher_assistant"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Permission name required to use this agent (leave empty if no permission needed)</p>
            </div>

            <!-- LLM Provider -->
            <div>
              <label for="llm_provider" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LLM Provider
              </label>
              <select
                id="llm_provider"
                v-model="form.llm_provider"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="azure">Azure OpenAI</option>
                <option value="local">Local Model</option>
              </select>
            </div>

            <!-- LLM Model -->
            <div>
              <label for="llm_model" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LLM Model
              </label>
              <input
                id="llm_model"
                v-model="form.llm_model"
                type="text"
                placeholder="e.g., gpt-4-turbo, claude-3-sonnet"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- System Prompt -->
            <div>
              <label for="system_prompt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                System Prompt
              </label>
              <textarea
                id="system_prompt"
                v-model="form.system_prompt"
                rows="6"
                placeholder="Enter the system prompt that defines this agent's behavior and personality..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">This prompt defines how the agent behaves and responds</p>
            </div>

            <!-- Status -->
            <div class="flex items-center justify-between">
              <div>
                <label for="is_active" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Agent Status
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400">Enable or disable this agent</p>
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
                    form.is_active ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
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
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 order-1 sm:order-2"
            >
              <i v-if="isSaving" class="fas fa-spinner animate-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ isSaving ? 'Saving...' : (isEdit ? 'Update Agent' : 'Create Agent') }}
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
  agent: {
    type: Object,
    default: null
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
  name: '',
  display_name: '',
  description: '',
  permission_required: '',
  llm_provider: 'openai',
  llm_model: '',
  system_prompt: '',
  is_active: true
})

// Computed
const isFormValid = computed(() => {
  return form.value.name.trim() && form.value.display_name.trim()
})

// Methods
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const resetForm = () => {
  if (props.isEdit && props.agent) {
    // Populate form with existing agent data
    form.value = {
      name: props.agent.name || '',
      display_name: props.agent.display_name || '',
      description: props.agent.description || '',
      permission_required: props.agent.permission_required || '',
      llm_provider: props.agent.llm_provider || 'openai',
      llm_model: props.agent.llm_model || '',
      system_prompt: props.agent.system_prompt || '',
      is_active: props.agent.is_active ?? true
    }
  } else {
    // Reset to defaults for new agent
    form.value = {
      name: '',
      display_name: '',
      description: '',
      permission_required: '',
      llm_provider: 'openai',
      llm_model: '',
      system_prompt: '',
      is_active: true
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value || isSaving.value) return

  try {
    isSaving.value = true

    const agentData = {
      name: form.value.name.trim(),
      display_name: form.value.display_name.trim(),
      description: form.value.description.trim() || null,
      permission_required: form.value.permission_required || null,
      llm_provider: form.value.llm_provider,
      llm_model: form.value.llm_model.trim() || null,
      system_prompt: form.value.system_prompt.trim() || null,
      is_active: form.value.is_active
    }

    if (props.isEdit && props.agent) {
      await agentAPIService.updateAgent(props.agent.id, agentData)
    } else {
      await agentAPIService.createAgent(agentData)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving agent:', error)
    // Could show a toast notification here
  } finally {
    isSaving.value = false
  }
}

// Initialize form when component mounts or props change
watch(() => [props.agent, props.isEdit], resetForm, { immediate: true })
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
textarea:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
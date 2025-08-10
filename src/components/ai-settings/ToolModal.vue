<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleOverlayClick" @keydown.escape="$emit('close')" tabindex="0">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <i class="fas fa-tools text-green-600 dark:text-green-400"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ isEdit ? 'Edit Tool' : 'Create New Tool' }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ isEdit ? 'Update tool details' : 'Configure a new AI tool' }}</p>
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
              <i class="fas fa-info-circle text-green-500"></i>
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
                placeholder="e.g., file_reader, web_search"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Unique identifier for the tool (lowercase, underscores allowed)</p>
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
                placeholder="e.g., File Reader, Web Search"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                placeholder="Describe what this tool does and how it helps the agent..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Technical Configuration -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-code text-purple-500"></i>
              Technical Configuration
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Tool Module -->
              <div>
                <label for="tool_module" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tool Module
                </label>
                <input
                  id="tool_module"
                  v-model="form.tool_module"
                  type="text"
                  placeholder="e.g., file_tools"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                >
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Python module containing the tool</p>
              </div>

              <!-- Tool Class -->
              <div>
                <label for="tool_class" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tool Class
                </label>
                <input
                  id="tool_class"
                  v-model="form.tool_class"
                  type="text"
                  placeholder="e.g., FileReaderTool"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                >
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Python class name of the tool</p>
              </div>
            </div>

            <!-- Permission Required -->
            <div>
              <label for="permission_required" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Permission Required
              </label>
              <input
                id="permission_required"
                v-model="form.permission_required"
                type="text"
                placeholder="e.g., agent_tools_list_students"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Permission name required to use this tool (leave empty if no permission needed)</p>
            </div>
          </div>

          <!-- Tool Configuration -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-cog text-blue-500"></i>
              Tool Configuration
            </h4>

            <!-- Tool Config JSON -->
            <div>
              <label for="tool_config" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tool Configuration (JSON)
              </label>
              <textarea
                id="tool_config"
                v-model="form.tool_config"
                rows="8"
                placeholder='{\n  "parameter1": "value1",\n  "parameter2": "value2"\n}'
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">JSON configuration object for the tool (optional)</p>
              <div v-if="configError" class="text-xs text-red-500 mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-triangle"></i>
                {{ configError }}
              </div>
            </div>

            <!-- System Prompt for Tool -->
            <div>
              <label for="system_prompt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tool System Prompt
              </label>
              <textarea
                id="system_prompt"
                v-model="form.system_prompt"
                rows="4"
                placeholder="Instructions for how agents should use this tool..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Additional instructions for agents using this tool</p>
            </div>

            <!-- Status -->
            <div class="flex items-center justify-between">
              <div>
                <label for="is_active" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tool Status
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400">Enable or disable this tool</p>
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
                    form.is_active ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
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
              class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 order-1 sm:order-2"
            >
              <i v-if="isSaving" class="fas fa-spinner animate-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ isSaving ? 'Saving...' : (isEdit ? 'Update Tool' : 'Create Tool') }}
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
  tool: {
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
const configError = ref('')

// Form data
const form = ref({
  name: '',
  display_name: '',
  description: '',
  tool_module: '',
  tool_class: '',
  permission_required: '',
  tool_config: '',
  system_prompt: '',
  is_active: true
})

// Computed
const isFormValid = computed(() => {
  return form.value.name.trim() && form.value.display_name.trim() && !configError.value
})

// Methods
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const validateConfig = () => {
  configError.value = ''
  
  if (form.value.tool_config.trim()) {
    try {
      JSON.parse(form.value.tool_config)
    } catch (error) {
      configError.value = 'Invalid JSON format'
    }
  }
}

const resetForm = () => {
  if (props.isEdit && props.tool) {
    // Populate form with existing tool data
    form.value = {
      name: props.tool.name || '',
      display_name: props.tool.display_name || '',
      description: props.tool.description || '',
      tool_module: props.tool.tool_module || '',
      tool_class: props.tool.tool_class || '',
      permission_required: props.tool.permission_required || '',
      tool_config: props.tool.tool_config ? JSON.stringify(props.tool.tool_config, null, 2) : '',
      system_prompt: props.tool.system_prompt || '',
      is_active: props.tool.is_active ?? true
    }
  } else {
    // Reset to defaults for new tool
    form.value = {
      name: '',
      display_name: '',
      description: '',
      tool_module: '',
      tool_class: '',
      permission_required: '',
      tool_config: '',
      system_prompt: '',
      is_active: true
    }
  }
  
  validateConfig()
}

const handleSubmit = async () => {
  if (!isFormValid.value || isSaving.value) return

  try {
    isSaving.value = true

    const toolData = {
      name: form.value.name.trim(),
      display_name: form.value.display_name.trim(),
      description: form.value.description.trim() || null,
      tool_module: form.value.tool_module.trim() || null,
      tool_class: form.value.tool_class.trim() || null,
      permission_required: form.value.permission_required || null,
      tool_config: form.value.tool_config.trim() ? JSON.parse(form.value.tool_config) : null,
      system_prompt: form.value.system_prompt.trim() || null,
      is_active: form.value.is_active
    }

    if (props.isEdit && props.tool) {
      await agentAPIService.updateTool(props.tool.id, toolData)
    } else {
      await agentAPIService.createTool(toolData)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving tool:', error)
    // Could show a toast notification here
  } finally {
    isSaving.value = false
  }
}

// Watch for config changes to validate
watch(() => form.value.tool_config, validateConfig)

// Initialize form when component mounts or props change
watch(() => [props.tool, props.isEdit], resetForm, { immediate: true })
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
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
  
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
  
  .grid-cols-1.md:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
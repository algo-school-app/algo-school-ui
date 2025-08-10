<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <i class="fas fa-cog text-purple-600 dark:text-purple-400"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tool Configuration</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ tool?.display_name || tool?.name || 'Unknown Tool' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            v-if="canEdit" 
            @click="toggleEditMode" 
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-1',
              isEditing 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' 
                : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
            ]"
          >
            <span>{{ isEditing ? '👁️' : '✏️' }}</span>
            {{ isEditing ? 'View Mode' : 'Edit Mode' }}
          </button>
          <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fas fa-times">✕</i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-hidden">
          <!-- View Mode -->
          <div v-if="!isEditing" class="h-full flex flex-col">
            <!-- Tool Metadata -->
            <div class="flex-shrink-0 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Tool Name
                  </label>
                  <p class="text-sm text-gray-900 dark:text-white font-medium">{{ tool?.display_name || 'N/A' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ tool?.name || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Module
                  </label>
                  <p class="text-sm text-gray-900 dark:text-white font-mono">{{ tool?.tool_module || 'N/A' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ tool?.tool_class || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Last Updated
                  </label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(tool?.updated_at) }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Status
                  </label>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    tool?.is_active 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  ]">
                    {{ tool?.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Configuration Display -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6">
              <div class="space-y-6">
                <!-- JSON Configuration -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Configuration (JSON)
                    </label>
                    <div class="flex items-center gap-2">
                      <button 
                        v-if="tool?.tool_config"
                        @click="copyConfigToClipboard" 
                        class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <i class="fas fa-copy"></i>
                        Copy
                      </button>
                      <button 
                        v-if="tool?.tool_config"
                        @click="downloadConfig" 
                        class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <i class="fas fa-download"></i>
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <div v-if="tool?.tool_config" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <pre class="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-mono leading-relaxed overflow-x-auto">{{ formattedConfig }}</pre>
                  </div>
                  
                  <div v-else class="text-center py-8">
                    <i class="fas fa-cog text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Configuration</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                      This tool doesn't have any configuration parameters set.
                    </p>
                    <button 
                      v-if="canEdit" 
                      @click="isEditing = true" 
                      class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    >
                      <i class="fas fa-plus"></i>
                      Add Configuration
                    </button>
                  </div>
                </div>

                <!-- Configuration Schema/Help -->
                <div v-if="tool?.tool_config" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                  <div class="flex items-start gap-3">
                    <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
                    <div>
                      <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Configuration Details</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                        <div>
                          <span class="font-medium">Parameters:</span>
                          <span class="ml-2">{{ Object.keys(tool.tool_config || {}).length }}</span>
                        </div>
                        <div>
                          <span class="font-medium">Size:</span>
                          <span class="ml-2">{{ getConfigSize() }} bytes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="h-full flex flex-col">
            <form @submit.prevent="handleSave" class="flex flex-col h-full">
              <div class="flex-1 overflow-y-auto p-4 sm:p-6">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <label for="tool_config" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tool Configuration (JSON)
                    </label>
                    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{{ configText.length }} characters</span>
                      <span v-if="configError" class="text-red-500 flex items-center gap-1">
                        <i class="fas fa-exclamation-triangle"></i>
                        Invalid JSON
                      </span>
                      <span v-else-if="configText.trim()" class="text-green-500 flex items-center gap-1">
                        <i class="fas fa-check"></i>
                        Valid JSON
                      </span>
                    </div>
                  </div>
                  
                  <textarea
                    id="tool_config"
                    v-model="configText"
                    rows="20"
                    placeholder='{\n  "api_key": "your-api-key",\n  "timeout": 30,\n  "max_retries": 3,\n  "enabled_features": [\n    "feature1",\n    "feature2"\n  ],\n  "settings": {\n    "debug": false,\n    "verbose": true\n  }\n}'
                    class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                    :class="{ 'border-red-500 focus:ring-red-500': configError }"
                  ></textarea>
                  
                  <div v-if="configError" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-700">
                    <div class="flex items-start gap-2">
                      <i class="fas fa-exclamation-triangle mt-0.5"></i>
                      <div>
                        <p class="font-medium">JSON Syntax Error:</p>
                        <p class="text-xs mt-1">{{ configError }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <div class="flex items-start gap-2">
                      <i class="fas fa-lightbulb text-purple-500 mt-0.5"></i>
                      <div class="text-sm text-purple-800 dark:text-purple-200">
                        <p class="font-medium mb-1">Configuration Guidelines:</p>
                        <ul class="list-disc list-inside space-y-1 text-xs">
                          <li>Use valid JSON format with proper quotes and commas</li>
                          <li>Include all required parameters for the tool</li>
                          <li>Use appropriate data types (strings, numbers, booleans, arrays, objects)</li>
                          <li>Avoid including sensitive data like passwords or API keys in plain text</li>
                          <li>Test the configuration after saving to ensure the tool works correctly</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- JSON Formatting Tools -->
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="formatJSON"
                      :disabled="configError"
                      class="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 dark:text-blue-300 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <i class="fas fa-magic"></i>
                      Format
                    </button>
                    <button
                      type="button"
                      @click="compactJSON"
                      :disabled="configError"
                      class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <i class="fas fa-compress"></i>
                      Compact
                    </button>
                    <button
                      type="button"
                      @click="clearConfig"
                      class="px-3 py-1.5 text-xs bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <i class="fas fa-trash"></i>
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <!-- Edit Footer -->
              <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    @click="cancelEdit"
                    class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="isSaving || configError"
                    class="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 order-1 sm:order-2"
                  >
                    <i v-if="isSaving" class="fas fa-spinner animate-spin"></i>
                    <i v-else class="fas fa-save"></i>
                    {{ isSaving ? 'Saving...' : 'Save Configuration' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { agentAPIService } from '../../services/agentAPIService.js'

const props = defineProps({
  tool: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'updated'])

// State
const isEditing = ref(false)
const isSaving = ref(false)
const configText = ref('')
const configError = ref('')

// Computed
const canEdit = computed(() => true) // Could add permission check here

const formattedConfig = computed(() => {
  if (!props.tool?.tool_config) return ''
  try {
    return JSON.stringify(props.tool.tool_config, null, 2)
  } catch (error) {
    return JSON.stringify(props.tool.tool_config)
  }
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const getConfigSize = () => {
  if (!props.tool?.tool_config) return 0
  return JSON.stringify(props.tool.tool_config).length
}

const validateJSON = () => {
  configError.value = ''
  
  if (configText.value.trim()) {
    try {
      JSON.parse(configText.value)
    } catch (error) {
      configError.value = error.message
    }
  }
}

const toggleEditMode = () => {
  if (isEditing.value) {
    cancelEdit()
  } else {
    configText.value = formattedConfig.value
    isEditing.value = true
    validateJSON()
  }
}

const cancelEdit = () => {
  isEditing.value = false
  configText.value = formattedConfig.value
  configError.value = ''
}

const formatJSON = () => {
  if (configError.value) return
  
  try {
    const parsed = JSON.parse(configText.value)
    configText.value = JSON.stringify(parsed, null, 2)
  } catch (error) {
    // Should not happen as we check for errors
  }
}

const compactJSON = () => {
  if (configError.value) return
  
  try {
    const parsed = JSON.parse(configText.value)
    configText.value = JSON.stringify(parsed)
  } catch (error) {
    // Should not happen as we check for errors
  }
}

const clearConfig = () => {
  configText.value = ''
  configError.value = ''
}

const handleSave = async () => {
  if (isSaving.value || configError.value) return

  try {
    isSaving.value = true

    const toolConfig = configText.value.trim() ? JSON.parse(configText.value) : null
    
    const updateData = {
      ...props.tool,
      tool_config: toolConfig
    }

    await agentAPIService.updateTool(props.tool.id, updateData)

    isEditing.value = false
    emit('updated')
  } catch (error) {
    console.error('Error saving tool configuration:', error)
    // Could show a toast notification here
  } finally {
    isSaving.value = false
  }
}

const copyConfigToClipboard = async () => {
  if (!formattedConfig.value) return

  try {
    await navigator.clipboard.writeText(formattedConfig.value)
    // Could show a toast notification here
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const downloadConfig = () => {
  if (!formattedConfig.value) return

  const blob = new Blob([formattedConfig.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.tool.name}_config.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Watch for config changes to validate
watch(() => configText.value, validateJSON)

// Keyboard handling
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Initialize
watch(() => props.tool, (newTool) => {
  if (newTool) {
    configText.value = formattedConfig.value
    validateJSON()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Custom scrollbar */
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
textarea:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Pre formatting */
pre {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md\\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .grid-cols-1.md\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
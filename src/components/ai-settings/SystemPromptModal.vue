<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <i :class="[isToolMode ? 'fas fa-tools text-green-600 dark:text-green-400' : 'fas fa-robot text-blue-600 dark:text-blue-400']"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isToolMode ? 'Tool' : 'Agent' }} System Prompt
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ entity?.display_name || entity?.name || 'Unknown' }}
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
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
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
            <!-- Metadata -->
            <div class="flex-shrink-0 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    {{ isToolMode ? 'Tool' : 'Agent' }} Name
                  </label>
                  <p class="text-sm text-gray-900 dark:text-white font-medium">{{ entity?.display_name || 'N/A' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ entity?.name || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Last Updated
                  </label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(entity?.updated_at) }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Status
                  </label>
                  <div class="flex items-center gap-2">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      entity?.is_active 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    ]">
                      {{ entity?.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Prompt Display -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    System Prompt
                  </label>
                  <button 
                    @click="copyToClipboard" 
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <i class="fas fa-copy"></i>
                    Copy
                  </button>
                </div>
                
                <div v-if="entity?.system_prompt" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <pre class="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-mono leading-relaxed">{{ entity.system_prompt }}</pre>
                </div>
                
                <div v-else class="text-center py-12">
                  <i class="fas fa-file-alt text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No System Prompt</h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">
                    This {{ isToolMode ? 'tool' : 'agent' }} doesn't have a system prompt configured.
                  </p>
                  <button 
                    v-if="canEdit" 
                    @click="isEditing = true" 
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <i class="fas fa-plus"></i>
                    Add System Prompt
                  </button>
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
                    <label for="system_prompt" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      System Prompt
                    </label>
                    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{{ systemPrompt.length }} characters</span>
                      <span>•</span>
                      <span>{{ Math.ceil(systemPrompt.length / 4) }} tokens (approx.)</span>
                    </div>
                  </div>
                  
                  <textarea
                    id="system_prompt"
                    v-model="systemPrompt"
                    rows="20"
                    :placeholder="isToolMode 
                      ? 'Enter instructions for how agents should use this tool...\n\nExample:\nYou are a file reading tool. When asked to read files:\n1. Check if the file path is valid\n2. Read the content safely\n3. Return the content or an error message'
                      : 'Enter the system prompt that defines this agent\'s behavior...\n\nExample:\nYou are a helpful teaching assistant for an educational platform. You should:\n1. Be patient and encouraging with students\n2. Provide clear explanations\n3. Ask follow-up questions to ensure understanding'"
                    class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                  ></textarea>
                  
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                    <div class="flex items-start gap-2">
                      <i class="fas fa-lightbulb text-blue-500 mt-0.5"></i>
                      <div class="text-sm text-blue-800 dark:text-blue-200">
                        <p class="font-medium mb-1">Tips for writing effective system prompts:</p>
                        <ul class="list-disc list-inside space-y-1 text-xs">
                          <li>Be specific about the {{ isToolMode ? 'tool\'s purpose and usage' : 'agent\'s role and behavior' }}</li>
                          <li>Include examples of expected {{ isToolMode ? 'input/output patterns' : 'responses and interactions' }}</li>
                          <li>Set clear boundaries and limitations</li>
                          <li>Use clear, concise language</li>
                        </ul>
                      </div>
                    </div>
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
                    :disabled="isSaving"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 order-1 sm:order-2"
                  >
                    <i v-if="isSaving" class="fas fa-spinner animate-spin"></i>
                    <i v-else class="fas fa-save"></i>
                    {{ isSaving ? 'Saving...' : 'Save Prompt' }}
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
  agent: {
    type: Object,
    default: null
  },
  isTool: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'updated'])

// State
const isEditing = ref(false)
const isSaving = ref(false)
const systemPrompt = ref('')

// Computed
const isToolMode = computed(() => props.isTool)
const entity = computed(() => props.agent)
const canEdit = computed(() => true) // Could add permission check here

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

const toggleEditMode = () => {
  if (isEditing.value) {
    cancelEdit()
  } else {
    systemPrompt.value = entity.value?.system_prompt || ''
    isEditing.value = true
  }
}

const cancelEdit = () => {
  isEditing.value = false
  systemPrompt.value = entity.value?.system_prompt || ''
}

const handleSave = async () => {
  if (isSaving.value) return

  try {
    isSaving.value = true

    const updateData = {
      ...entity.value,
      system_prompt: systemPrompt.value.trim() || null
    }

    if (isToolMode.value) {
      await agentAPIService.updateTool(entity.value.id, updateData)
    } else {
      await agentAPIService.updateAgent(entity.value.id, updateData)
    }

    isEditing.value = false
    emit('updated')
  } catch (error) {
    console.error('Error saving system prompt:', error)
    // Could show a toast notification here
  } finally {
    isSaving.value = false
  }
}

const copyToClipboard = async () => {
  if (!entity.value?.system_prompt) return

  try {
    await navigator.clipboard.writeText(entity.value.system_prompt)
    // Could show a toast notification here
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

// Keyboard handling
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Initialize
watch(() => entity.value, (newEntity) => {
  if (newEntity) {
    systemPrompt.value = newEntity.system_prompt || ''
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
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Pre formatting */
pre {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>
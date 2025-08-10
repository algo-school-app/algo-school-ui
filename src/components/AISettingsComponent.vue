<template>
  <div class="ai-settings-container w-full h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <i class="fas fa-robot text-blue-500 text-lg sm:text-xl"></i>
          <div>
            <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">AI Settings</h2>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage AI agents, tools, and their relationships</p>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <button @click="refreshData" :disabled="isLoading" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base disabled:opacity-50">
            <i class="fas fa-refresh" :class="{ 'animate-spin': isLoading }"></i>
            <span class="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6">
      <div class="flex space-x-1 overflow-x-auto">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap',
            activeTab === tab.id 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <i :class="tab.icon" class="text-sm sm:text-base"></i>
          <span class="hidden sm:inline">{{ tab.label }}</span>
          <span class="sm:hidden">{{ tab.shortLabel }}</span>
          <span v-if="getCounts[tab.id]" class="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{{ getCounts[tab.id] }}</span>
        </button>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="flex-shrink-0 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-400"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700 dark:text-red-200">{{ error }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button @click="error = null" class="text-red-400 hover:text-red-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-hidden">
      <!-- Agents Tab -->
      <div v-if="activeTab === 'agents'" class="h-full">
        <AgentsTable 
          :agents="agents" 
          :loading="isLoading"
          @refresh="loadAgents"
          @agent-updated="handleAgentUpdated"
        />
      </div>

      <!-- Tools Tab -->
      <div v-if="activeTab === 'tools'" class="h-full">
        <ToolsTable 
          :tools="tools" 
          :loading="isLoading"
          @refresh="loadTools"
          @tool-updated="handleToolUpdated"
        />
      </div>

      <!-- Relationships Tab -->
      <div v-if="activeTab === 'relationships'" class="h-full">
        <AgentToolsTable 
          :relationships="agentTools" 
          :agents="agents"
          :tools="tools"
          :loading="isLoading"
          @refresh="loadAgentTools"
          @relationship-updated="handleRelationshipUpdated"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { agentAPIService } from '../services/agentAPIService.js'
import AgentsTable from './ai-settings/AgentsTable.vue'
import ToolsTable from './ai-settings/ToolsTable.vue'
import AgentToolsTable from './ai-settings/AgentToolsTable.vue'

// State
const activeTab = ref('agents')
const isLoading = ref(false)
const error = ref(null)

// Data
const agents = ref([])
const tools = ref([])
const agentTools = ref([])

// Tab configuration
const tabs = [
  { id: 'agents', label: 'Agents', shortLabel: 'Agents', icon: 'fas fa-robot' },
  { id: 'tools', label: 'Tools', shortLabel: 'Tools', icon: 'fas fa-tools' },
  { id: 'relationships', label: 'Agent-Tool Relationships', shortLabel: 'Relations', icon: 'fas fa-link' }
]

// Computed
const getCounts = computed(() => {
  return {
    agents: agents.value.length,
    tools: tools.value.length,
    relationships: agentTools.value.length
  }
})

// Methods
const showError = (message) => {
  error.value = message
  console.error('AI Settings Error:', message)
}

const loadAgents = async () => {
  try {
    isLoading.value = true
    const data = await agentAPIService.getAgents()
    agents.value = Array.isArray(data) ? data : []
    console.log('Loaded agents:', agents.value)
  } catch (err) {
    showError(`Failed to load agents: ${err.message}`)
    agents.value = []
  } finally {
    isLoading.value = false
  }
}

const loadTools = async () => {
  try {
    isLoading.value = true
    const data = await agentAPIService.getTools()
    tools.value = Array.isArray(data) ? data : []
    console.log('Loaded tools:', tools.value)
  } catch (err) {
    showError(`Failed to load tools: ${err.message}`)
    tools.value = []
  } finally {
    isLoading.value = false
  }
}

const loadAgentTools = async () => {
  try {
    isLoading.value = true
    const data = await agentAPIService.getAgentTools()
    agentTools.value = Array.isArray(data) ? data : []
    console.log('Loaded agent-tools:', agentTools.value)
  } catch (err) {
    showError(`Failed to load agent-tool relationships: ${err.message}`)
    agentTools.value = []
  } finally {
    isLoading.value = false
  }
}

const loadAllData = async () => {
  // Check if service is configured
  if (!agentAPIService.isConfigured()) {
    showError('Agent management service is not properly configured. Please check environment variables.')
    return
  }

  try {
    isLoading.value = true
    error.value = null
    
    // Load all data in parallel
    await Promise.all([
      loadAgents(),
      loadTools(),
      loadAgentTools()
    ])
  } catch (err) {
    showError(`Failed to load AI settings data: ${err.message}`)
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  loadAllData()
}

// Event handlers
const handleAgentUpdated = () => {
  loadAgents()
  loadAgentTools() // Refresh relationships as they might be affected
}

const handleToolUpdated = () => {
  loadTools()
  loadAgentTools() // Refresh relationships as they might be affected
}

const handleRelationshipUpdated = () => {
  loadAgentTools()
}

// Lifecycle
onMounted(() => {
  console.log('AI Settings Component mounted')
  loadAllData()
})
</script>

<style scoped>
/* Custom scrollbar for tab navigation */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Responsive design improvements */
@media (max-width: 640px) {
  .ai-settings-container {
    font-size: 14px;
  }
}
</style>
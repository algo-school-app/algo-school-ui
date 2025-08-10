<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-lg w-auto">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
          toast.type === 'success' && 'border-l-4 border-green-400',
          toast.type === 'error' && 'border-l-4 border-red-400',
          toast.type === 'warning' && 'border-l-4 border-yellow-400',
          toast.type === 'info' && 'border-l-4 border-blue-400'
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <i
                :class="[
                  'text-lg',
                  toast.type === 'success' && 'fas fa-check-circle text-green-400',
                  toast.type === 'error' && 'fas fa-exclamation-circle text-red-400',
                  toast.type === 'warning' && 'fas fa-exclamation-triangle text-yellow-400',
                  toast.type === 'info' && 'fas fa-info-circle text-blue-400'
                ]"
              ></i>
            </div>
            <div class="ml-3 flex-1 pt-0.5 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ toast.message }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeToast(toast.id)"
                class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="sr-only">Close</span>
                <i class="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- Animated Progress Bar -->
        <div v-if="toast.duration > 0" class="h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            :key="`progress-${toast.id}`"
            :class="[
              'h-full toast-progress-bar',
              toast.type === 'success' && 'bg-green-400',
              toast.type === 'error' && 'bg-red-400',
              toast.type === 'warning' && 'bg-yellow-400',
              toast.type === 'info' && 'bg-blue-400'
            ]"
            :style="{ 
              animationDuration: toast.duration + 'ms'
            }"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const toasts = ref([])
let toastIdCounter = 0

const addToast = (type, title, message = '', duration = 5000) => {
  const toast = {
    id: ++toastIdCounter,
    type,
    title,
    message,
    duration,
    startTime: Date.now()
  }
  
  toasts.value.push(toast)
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(toast.id)
    }, duration)
  }
  
  return toast.id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAllToasts = () => {
  toasts.value = []
}

// Expose methods globally for easy access
const showSuccess = (title, message = '', duration = 5000) => {
  return addToast('success', title, message, duration)
}

const showError = (title, message = '', duration = 7000) => {
  return addToast('error', title, message, duration)
}

const showWarning = (title, message = '', duration = 6000) => {
  return addToast('warning', title, message, duration)
}

const showInfo = (title, message = '', duration = 5000) => {
  return addToast('info', title, message, duration)
}

// Make methods available globally
onMounted(() => {
  // Attach to window for global access
  window.toast = {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    remove: removeToast,
    clear: clearAllToasts
  }
  
  // Also expose individual methods
  window.showToast = addToast
  window.showSuccessToast = showSuccess
  window.showErrorToast = showError
  window.showWarningToast = showWarning
  window.showInfoToast = showInfo
})

// Component methods
defineExpose({
  addToast,
  removeToast,
  clearAllToasts,
  showSuccess,
  showError,
  showWarning,
  showInfo
})
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Animated progress bar countdown */
@keyframes toast-countdown {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

.toast-progress-bar {
  width: 100%;
  animation-name: toast-countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
</style>
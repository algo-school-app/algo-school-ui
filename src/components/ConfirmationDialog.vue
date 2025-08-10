<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md" @click.stop>
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
          </div>
        </div>
        
        <!-- Content -->
        <div class="text-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">{{ title }}</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{{ message }}</p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button 
            @click="handleCancel"
            class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 text-sm font-medium"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="handleConfirm"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 text-sm font-medium flex items-center justify-center gap-2"
          >
            <i v-if="confirmIcon" :class="confirmIcon"></i>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmIcon: {
    type: String,
    default: 'fas fa-check'
  },
  backdropClose: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['confirm', 'cancel', 'close'])

// State
const isOpen = ref(false)

// Methods
const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

const handleBackdropClick = () => {
  if (props.backdropClose) {
    handleCancel()
  }
}

// Keyboard handling
const handleKeydown = (event) => {
  if (!isOpen.value) return
  
  if (event.key === 'Escape') {
    handleCancel()
  } else if (event.key === 'Enter') {
    handleConfirm()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Expose methods
defineExpose({
  open,
  close
})
</script>
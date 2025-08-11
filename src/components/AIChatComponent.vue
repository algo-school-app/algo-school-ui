<template>
  <div class="ai-chat-container w-full h-full bg-white dark:bg-gray-900 flex flex-col">
    <!-- Class Selection Header (only show if user has classes) -->
    <div v-if="userClasses.length >= 1" class="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div class="flex items-center gap-2">
          <HandDrawnIcon name="chalkboard-teacher" size="sm" class="text-blue-500" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Class Context:</span>
        </div>
        <select 
          v-model="selectedClassId"
          @change="onClassChange"
          class="flex-1 max-w-full sm:max-w-md px-3 py-3 sm:py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
        >
          <option v-for="cls in userClasses" :key="cls.classId" :value="cls.classId">
            {{ cls.courseName }} - {{ cls.className }}
          </option>
        </select>
        <div class="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
          AI responses will be scoped to this class
        </div>
      </div>
    </div>
    
    <!-- Chat Messages Area -->
    <div class="ai-chat-content flex-1 p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 overflow-auto overscroll-contain" ref="chatContainer">
      <!-- Welcome Message -->
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center max-w-lg mx-auto px-4">
          <div class="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 ai-icon-bounce shadow-2xl">
            <HandDrawnIcon name="ai" size="xl" class="text-white" />
          </div>
          <h3 class="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            🤖 Your AI Learning Assistant
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
            ✨ Ask me anything about your school, students, or programs. I'm here to make your life easier! 
          </p>
          <div class="flex justify-center gap-2 text-2xl mb-8">
            <span class="animate-bounce">🎓</span>
            <span class="animate-bounce" style="animation-delay: 0.1s">📚</span>
            <span class="animate-bounce" style="animation-delay: 0.2s">💡</span>
            <span class="animate-bounce" style="animation-delay: 0.3s">✨</span>
          </div>
          
          <!-- Chat Suggestions -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto px-2">
            <button 
              v-for="(suggestion, index) in suggestions" 
              :key="suggestion"
              @click="sendMessage(suggestion)"
              class="relative px-4 py-4 sm:py-3 text-left bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 text-gray-700 dark:text-gray-200 text-sm font-medium group touch-manipulation min-h-[44px] flex items-center"
              :style="{ '--delay': index * 0.1 + 's' }"
            >
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xl sm:text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                {{ ['💭', '💡', '📚', '✨'][index % 4] }}
              </span>
              <span class="pl-8 leading-tight">{{ suggestion }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-else class="space-y-4 py-4">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="[
            'flex group message-animation',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div 
            :class="[
              'relative max-w-3xl shadow-lg transition-all duration-300 hover:shadow-xl',
              message.role === 'user' 
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm ml-2 sm:ml-12' 
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-t-2xl rounded-br-2xl rounded-bl-sm mr-2 sm:mr-12',
              'transform hover:scale-[1.01] sm:hover:scale-[1.02]'
            ]"
          >
            <!-- Message Header with Copy Button -->
            <div class="px-5 pt-4 pb-2 flex items-start justify-between">
              <div class="flex items-center gap-3">
                <!-- Fun Avatar -->
                <div 
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md transform transition-transform hover:scale-110',
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-purple-400 to-pink-400' 
                      : 'bg-gradient-to-br from-blue-400 to-teal-400'
                  ]"
                >
                  <span class="text-2xl">{{ message.role === 'user' ? '🧑‍🎓' : '🤖' }}</span>
                </div>
                <div class="flex flex-col">
                  <span 
                    :class="[
                      'text-sm font-bold',
                      message.role === 'user' 
                        ? 'text-purple-100' 
                        : 'text-gray-900 dark:text-white'
                    ]"
                  >
                    {{ message.role === 'user' ? 'You' : '✨ AI Learning Assistant' }}
                  </span>
                  <span 
                    :class="[
                      'text-xs',
                      message.role === 'user' 
                        ? 'text-purple-200' 
                        : 'text-gray-500 dark:text-gray-400'
                    ]"
                  >
                    {{ formatTime(message.timestamp) }}
                  </span>
                </div>
              </div>
              
              <!-- Copy Button -->
              <button
                @click="copyMessage(message.content)"
                :class="[
                  'opacity-70 hover:opacity-100 transition-all duration-200 p-2 rounded-lg flex items-center justify-center transform hover:scale-105',
                  message.role === 'user'
                    ? 'hover:bg-purple-700/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
                title="Copy message"
              >
                <span class="text-lg">📋</span>
              </button>
            </div>

            <!-- Message Content -->
            <div 
              :class="[
                'px-5 pb-4 break-words leading-relaxed text-base message-content',
                message.role === 'user' 
                  ? 'text-white' 
                  : 'text-gray-800 dark:text-gray-200'
              ]"
              v-html="formatMessageContent(message.content)"
            ></div>
            
            <!-- Message Tail (Speech Bubble Effect) -->
            <div 
              :class="[
                'absolute w-4 h-4',
                message.role === 'user' 
                  ? 'bottom-0 right-0 transform translate-x-2 translate-y-1' 
                  : 'bottom-0 left-0 transform -translate-x-2 translate-y-1'
              ]"
            >
              <svg viewBox="0 0 16 16" :class="message.role === 'user' ? 'text-pink-600' : 'text-white dark:text-gray-800'">
                <path 
                  fill="currentColor" 
                  :d="message.role === 'user' 
                    ? 'M 0 0 L 16 0 L 16 16 Q 16 0, 0 0' 
                    : 'M 16 0 L 0 0 L 0 16 Q 0 0, 16 0'"
                />
              </svg>
            </div>

            <!-- Message Files -->
            <div v-if="message.files && message.files.length > 0" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div class="space-y-2">
                <div 
                  v-for="file in message.files" 
                  :key="file.name"
                  :class="[
                    'flex items-center gap-2 p-2 rounded-lg text-sm',
                    message.role === 'user' 
                      ? 'bg-blue-400 text-white' 
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                  ]"
                >
                  <i class="fas fa-file text-xs"></i>
                  <span class="flex-1 truncate">{{ file.name }}</span>
                  <span class="text-xs opacity-70">{{ formatFileSize(file.size) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start message-animation">
          <div class="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-t-2xl rounded-br-2xl rounded-bl-sm shadow-lg px-5 py-4 mr-12">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center shadow-md animate-pulse">
                <span class="text-2xl">🤖</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">AI is thinking</span>
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                  <div class="w-2 h-2 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
                </div>
              </div>
            </div>
            <!-- Tail -->
            <div class="absolute w-4 h-4 bottom-0 left-0 transform -translate-x-2 translate-y-1">
              <svg viewBox="0 0 16 16" class="text-white dark:text-gray-800">
                <path fill="currentColor" d="M 16 0 L 0 0 L 0 16 Q 0 0, 16 0"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input Area -->
    <div class="flex-shrink-0 border-t border-purple-200/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 sm:p-4">
      <!-- Selected Files -->
      <div v-if="selectedFiles.length > 0" class="mb-3 sm:mb-4">
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="(file, index) in selectedFiles" 
            :key="index"
            class="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700 rounded-full px-3 py-2 text-sm shadow-sm"
          >
            <i class="fas fa-file text-purple-500 text-xs"></i>
            <span class="text-purple-700 dark:text-purple-300 truncate max-w-24 sm:max-w-32">{{ file.name }}</span>
            <button 
              @click="removeFile(index)"
              class="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200 transition-colors p-1 touch-manipulation"
            >
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Input Container -->
      <div class="flex gap-2 sm:gap-3 items-end">
        <!-- File Upload Button - Hidden as requested -->
        <!-- 
        <button 
          @click="triggerFileUpload"
          :disabled="isLoading"
          class="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/50 dark:to-pink-800/50 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-700/60 dark:hover:to-pink-700/60 border border-purple-200 dark:border-purple-600 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          title="Upload file"
        >
          <span class="text-lg">📎</span>
        </button>
        -->

        <!-- Message Input -->
        <div class="flex-1 relative">
          <textarea
            v-model="currentMessage"
            @keydown="handleKeyDown"
            @input="autoResize"
            :disabled="isLoading"
            :placeholder="isLoading ? 'AI is typing...' : 'Type your message... (Enter to send)'"
            class="w-full min-h-[44px] max-h-32 px-4 py-3 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 border border-purple-300/50 dark:border-purple-600/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-purple-500/70 dark:placeholder-purple-400/70 transition-all duration-200 hover:shadow-md focus:shadow-lg backdrop-blur-sm text-base touch-manipulation"
            ref="messageInput"
          ></textarea>
          
          <!-- Bubble Animation Overlay -->
          <div 
            v-if="isLoading" 
            class="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
            style="margin: 1px;"
          >
            <div class="bubble-container">
              <div class="bubble bubble-1"></div>
              <div class="bubble bubble-2"></div>
              <div class="bubble bubble-3"></div>
              <div class="bubble bubble-4"></div>
              <div class="bubble bubble-5"></div>
              <div class="bubble bubble-6"></div>
            </div>
          </div>
        </div>

        <!-- Send Button -->
        <button 
          @click="sendCurrentMessage"
          :disabled="!currentMessage.trim() || isLoading"
          class="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-500 dark:disabled:to-gray-600 text-white disabled:text-gray-300 dark:disabled:text-gray-400 rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:transform-none touch-manipulation"
          title="Send message"
        >
          <!-- Use emoji as reliable cross-platform icon -->
          <span v-if="!isLoading" class="text-lg sm:text-xl">➤</span>
          <div v-else class="w-4 h-4 border-2 border-purple-200 border-t-purple-600 dark:border-purple-300 dark:border-t-purple-100 rounded-full animate-spin"></div>
        </button>
      </div>

      <!-- Hidden File Input -->
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileSelect" 
        multiple 
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        class="hidden"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import HandDrawnIcon from './HandDrawnIcon.vue'
import { agentAPIService } from '../services/agentAPIService.js'
import { UserService } from '../services/userService.js'

const messages = ref([])
const currentMessage = ref('')
const selectedFiles = ref([])
const isLoading = ref(false)
const isTyping = ref(false)
const chatContainer = ref(null)
const messageInput = ref(null)
const fileInput = ref(null)

// Class selection state
const userClasses = ref([])
const selectedClassId = ref(null)
const selectedCourseId = ref(null)

const suggestions = ref([
  "Help me create a lesson plan about the Five Pillars of Islam",
  "Find materials about Islamic prayer (Salah) procedures",
  "Generate quiz questions on the life of Prophet Muhammad (PBUH)",
  "Search for content about Islamic ethics and moral values"
])

// Load user classes from profile
const loadUserClasses = () => {
  try {
    const profile = UserService.getStoredProfile()
    const classList = []
    
    if (profile && profile.courses && Array.isArray(profile.courses)) {
      profile.courses.forEach(course => {
        if (course.classes && Array.isArray(course.classes)) {
          course.classes.forEach(classItem => {
            classList.push({
              classId: classItem.id,
              courseId: course.id,
              courseName: course.name,
              className: classItem.classroom?.name || 'Class'
            })
          })
        }
      })
    }
    
    userClasses.value = classList
    
    // Auto-select first class if available
    if (classList.length > 0) {
      selectedClassId.value = classList[0].classId
      selectedCourseId.value = classList[0].courseId
    }
    
  } catch (error) {
    console.error('Error loading user classes:', error)
    userClasses.value = []
  }
}

// Handle class selection change
const onClassChange = () => {
  const selectedClass = userClasses.value.find(cls => cls.classId === selectedClassId.value)
  if (selectedClass) {
    selectedCourseId.value = selectedClass.courseId
    
    // Clear chat messages when changing class context
    messages.value = []
    
    // Ensure container scrolls back to top after clearing
    if (chatContainer.value) {
      chatContainer.value.scrollTop = 0
    }
    
    console.log('AI Chat: Class context changed to:', {
      classId: selectedClassId.value,
      courseId: selectedCourseId.value,
      className: selectedClass.className,
      courseName: selectedClass.courseName
    })
  }
}

const sendMessage = async (text, files = []) => {
  if (!text || !text.trim()) return
  
  const userMessage = {
    role: 'user',
    content: text,
    files: files,
    timestamp: new Date()
  }
  
  // Step 1: Add user message and clear form immediately
  messages.value.push(userMessage)
  currentMessage.value = ''
  selectedFiles.value = []
  
  // Step 2: Wait for user message to be fully rendered before showing loading states
  await nextTick()
  scrollToBottom() // Instant scroll for user messages
  
  // Step 3: Small delay to ensure user message is visible before loading indicators
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // Step 4: Now set loading states after user message is visible
  isLoading.value = true
  isTyping.value = true
  
  try {
    // Check if agent service is configured
    if (!agentAPIService.isConfigured()) {
      throw new Error('Agent service is not properly configured. Please check your environment variables.')
    }

    // Send message to agent service with class context
    const context = {
      classId: selectedClassId.value,
      courseId: selectedCourseId.value
    }
    const response = await agentAPIService.sendMessage(text, files, context)
    
    // Step 5: Clear typing indicator first, then wait before adding AI message
    isTyping.value = false
    await nextTick() // Allow typing indicator to fade out
    
    // Small delay to ensure smooth transition from typing to AI message
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const aiMessage = {
      role: 'ai',
      content: response.message || response.response || 'I received your message but got an unexpected response format.',
      timestamp: new Date()
    }
    
    messages.value.push(aiMessage)
    isLoading.value = false
    
    // Wait for DOM to fully update with the new AI message
    await nextTick()
    // Additional delay to ensure message content is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('Scrolling to bottom after AI response')
    scrollToBottom(true) // Smooth scroll for AI responses
    
    // Restore focus to input after AI response
    if (messageInput.value) {
      messageInput.value.focus()
    }
    
  } catch (error) {
    console.error('Error sending message to AI:', error)
    
    // Clear typing indicator first
    isTyping.value = false
    await nextTick()
    
    // Small delay before showing error message
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let errorContent = "I'm sorry, I encountered an error while processing your request. Please try again later."
    
    // Check if error has a status code (from fetch response)
    if (error.status === 401) {
      errorContent = "Your session has expired. Redirecting to login..."
      // The redirect will happen automatically from agentAPIService
    } else if (error.message.includes('Agent service is not properly configured')) {
      errorContent = "AI service is not configured. Please check the environment settings."
    } else if (error.message.includes('No authentication token')) {
      errorContent = "Authentication required. Please log in again."
    } else if (error.message.includes('Agent API error')) {
      errorContent = "AI service is currently unavailable. Please try again later."
    }
    
    const errorMessage = {
      role: 'ai',
      content: errorContent,
      timestamp: new Date()
    }
    
    messages.value.push(errorMessage)
    isLoading.value = false
    
    // Wait for DOM to fully update with the error message
    await nextTick()
    // Additional delay to ensure message content is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100))
    
    scrollToBottom(true) // Smooth scroll for error messages
    
    // Restore focus to input after error response
    if (messageInput.value) {
      messageInput.value.focus()
    }
  }
}

const sendCurrentMessage = () => {
  if (currentMessage.value && currentMessage.value.trim()) {
    sendMessage(currentMessage.value, selectedFiles.value)
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendCurrentMessage()
  }
  // Allow Shift + Enter to create new lines (default behavior)
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  
  for (const file of files) {
    // Convert file to base64 for transmission
    const fileData = await fileToBase64(file)
    selectedFiles.value.push({
      name: file.name,
      size: file.size,
      type: file.type,
      data: fileData
    })
  }
  
  // Clear the file input
  event.target.value = ''
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const scrollToBottom = (smooth = false) => {
  if (!chatContainer.value) {
    console.warn('Chat container ref not available for scrolling')
    return
  }

  // Use requestAnimationFrame to ensure DOM is fully rendered
  requestAnimationFrame(() => {
    // Double RAF for better timing with complex message content
    requestAnimationFrame(() => {
      try {
        const container = chatContainer.value
        const targetScrollTop = container.scrollHeight - container.clientHeight
        
        if (smooth) {
          // Smooth scrolling for better UX
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          })
          
          // Fallback: ensure we reach the bottom after smooth scroll animation
          setTimeout(() => {
            if (container.scrollTop < targetScrollTop - 10) {
              console.log('Fallback scroll triggered - ensuring scroll to bottom')
              container.scrollTop = targetScrollTop
            }
          }, 500) // Give smooth scroll animation time to complete
        } else {
          // Instant scrolling for immediate feedback
          container.scrollTop = targetScrollTop
        }
      } catch (error) {
        console.error('Error scrolling chat container:', error)
      }
    })
  })
}

const getSessionId = () => {
  let sessionId = localStorage.getItem('algo_chat_session')
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('algo_chat_session', sessionId)
  }
  return sessionId
}

// Auto-resize textarea
const autoResize = () => {
  const textarea = messageInput.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Copy message to clipboard
const copyMessage = async (content) => {
  try {
    // Strip HTML tags for copying plain text
    const plainText = content.replace(/<[^>]*>/g, '')
    await navigator.clipboard.writeText(plainText)
    
    // Show success feedback
    if (window.toast) {
      window.toast.success('Copied!', 'Message copied to clipboard', 2000)
    }
  } catch (err) {
    console.error('Failed to copy message:', err)
    if (window.toast) {
      window.toast.error('Copy Failed', 'Could not copy message to clipboard')
    }
  }
}

// Format message content - detect and render HTML safely
const formatMessageContent = (content) => {
  if (!content) return ''
  
  // Check if content contains HTML tags
  const htmlTagPattern = /<[^>]+>/
  
  if (htmlTagPattern.test(content)) {
    // Content contains HTML, return as-is for v-html rendering
    // Note: In production, you might want to sanitize HTML for security
    return content
  } else {
    // Plain text content - preserve line breaks and whitespace
    return content.replace(/\n/g, '<br>').replace(/\s\s+/g, match => '&nbsp;'.repeat(match.length))
  }
}

// Watch for new messages and auto-scroll (backup mechanism)
watch(() => messages.value.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    // New message added, scroll to bottom after DOM update
    nextTick(() => {
      // Small delay to ensure message is fully rendered
      setTimeout(() => {
        const lastMessage = messages.value[messages.value.length - 1]
        if (lastMessage) {
          // Use smooth scroll for AI messages, instant for user messages
          const useSmooth = lastMessage.role === 'ai'
          console.log(`Auto-scroll triggered for ${lastMessage.role} message (smooth: ${useSmooth})`)
          scrollToBottom(useSmooth)
        }
      }, 50)
    })
  }
}, { flush: 'post' })

onMounted(() => {
  // Load user classes on component mount
  loadUserClasses()
  
  if (messageInput.value) {
    messageInput.value.addEventListener('input', autoResize)
  }
})
</script>

<style scoped>
/* AI Icon bounce animation */
.ai-icon-bounce {
  animation: aiIconBounce 3s ease-in-out infinite;
}

/* Modern Message Animations */
.message-animation {
  animation: messageSlideIn 0.6s ease-out backwards;
  animation-delay: var(--delay, 0s);
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Chat Suggestions Animation */
.grid > button {
  animation: suggestionFadeIn 0.8s ease-out backwards;
  animation-delay: var(--delay, 0s);
}

@keyframes suggestionFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced Gradient Animations */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes aiIconBounce {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }
  25% {
    transform: translateY(-8px) scale(1.05) rotate(1deg);
    box-shadow: 0 15px 35px rgba(147, 51, 234, 0.4);
  }
  50% {
    transform: translateY(-4px) scale(1.02) rotate(-1deg);
    box-shadow: 0 12px 30px rgba(236, 72, 153, 0.35);
  }
  75% {
    transform: translateY(-10px) scale(1.03) rotate(0.5deg);
    box-shadow: 0 18px 40px rgba(59, 130, 246, 0.45);
  }
}

/* Enhanced chat suggestions */
.ai-chat-content button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Bubble Animation Styles */
.bubble-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  animation: bubbleRise 3s infinite;
  pointer-events: none;
}

/* Light theme bubbles */
.bubble {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* Dark theme bubbles */
.dark .bubble {
  background: rgba(147, 197, 253, 0.15);
  border: 1px solid rgba(147, 197, 253, 0.25);
}

/* Individual bubble sizes and positions */
.bubble-1 {
  width: 8px;
  height: 8px;
  left: 15%;
  animation-delay: 0s;
  animation-duration: 2.5s;
}

.bubble-2 {
  width: 12px;
  height: 12px;
  left: 25%;
  animation-delay: 0.5s;
  animation-duration: 3s;
}

.bubble-3 {
  width: 6px;
  height: 6px;
  left: 45%;
  animation-delay: 1s;
  animation-duration: 2.8s;
}

.bubble-4 {
  width: 10px;
  height: 10px;
  left: 65%;
  animation-delay: 1.5s;
  animation-duration: 3.2s;
}

.bubble-5 {
  width: 7px;
  height: 7px;
  left: 80%;
  animation-delay: 2s;
  animation-duration: 2.7s;
}

.bubble-6 {
  width: 9px;
  height: 9px;
  left: 35%;
  animation-delay: 0.8s;
  animation-duration: 3.1s;
}

/* Bubble rise animation */
@keyframes bubbleRise {
  0% {
    transform: translateY(100px) translateX(0px) scale(0);
    opacity: 0;
  }
  10% {
    transform: translateY(80px) translateX(2px) scale(0.5);
    opacity: 0.6;
  }
  50% {
    transform: translateY(30px) translateX(-3px) scale(1);
    opacity: 0.8;
  }
  80% {
    transform: translateY(10px) translateX(1px) scale(0.9);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-20px) translateX(-2px) scale(0.3);
    opacity: 0;
  }
}

.ai-chat-content button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

/* Gradient text animation */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 4s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Enhanced input area animations */
.flex-shrink-0 button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.flex-shrink-0 button:hover {
  transform: translateY(-1px);
}

.flex-shrink-0 button:active {
  transform: translateY(0);
}

/* Textarea focus glow effect */
textarea:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1), 0 8px 25px rgba(147, 51, 234, 0.15);
}

/* File tag animations */
.flex-wrap > div {
  transition: all 0.2s ease;
}

.flex-wrap > div:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.2);
}

/* Welcome message enhancements */
.text-center.max-w-lg {
  animation: welcomeFadeIn 1.2s ease-out;
}

@keyframes welcomeFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Copy button enhanced hover effect */
.group:hover [title="Copy message"] {
  animation: copyButtonPulse 0.6s ease-in-out;
}

@keyframes copyButtonPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Chat container scroll enhancement - remove global smooth scroll to allow JS control */
.ai-chat-content {
  /* Removed scroll-behavior: smooth to let JavaScript handle scroll timing properly */
}

/* Enhanced typing indicator with better timing */
.message-animation {
  transition: all 0.3s ease-in-out;
}

/* Typing indicator fade transitions */
.typing-indicator-enter-active, .typing-indicator-leave-active {
  transition: all 0.3s ease-in-out;
}

.typing-indicator-enter-from, .typing-indicator-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.typing-indicator-enter-to, .typing-indicator-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Message state transitions for better visual timing */
.user-message-enter-active {
  transition: all 0.2s ease-out;
}

.user-message-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.user-message-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.ai-message-enter-active {
  transition: all 0.4s ease-out;
  transition-delay: 0.1s;
}

.ai-message-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.96);
}

.ai-message-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Loading state transitions */
.loading-state-enter-active, .loading-state-leave-active {
  transition: all 0.2s ease-in-out;
}

.loading-state-enter-from, .loading-state-leave-to {
  opacity: 0;
}

.loading-state-enter-to, .loading-state-leave-from {
  opacity: 1;
}

/* Enhanced gradient animations for message bubbles */
.bg-gradient-to-br {
  background-size: 150% 150%;
  animation: subtleGradientShift 6s ease-in-out infinite;
}

@keyframes subtleGradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  33% {
    background-position: 50% 0%;
  }
  66% {
    background-position: 100% 50%;
  }
}

/* HTML content styling within messages */
.message-content h1, .message-content h2, .message-content h3, .message-content h4, .message-content h5, .message-content h6 {
  font-weight: bold;
  margin: 0.5em 0;
}

.message-content h1 { font-size: 1.5em; }
.message-content h2 { font-size: 1.3em; }
.message-content h3 { font-size: 1.1em; }

.message-content p {
  margin: 0.5em 0;
}

.message-content ul, .message-content ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message-content li {
  margin: 0.25em 0;
}

.message-content code {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.1em 0.3em;
  border-radius: 0.25em;
  font-family: monospace;
  font-size: 0.9em;
}

.message-content pre {
  background: rgba(0, 0, 0, 0.1);
  padding: 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin: 0.5em 0;
}

.message-content pre code {
  background: none;
  padding: 0;
}

.message-content blockquote {
  border-left: 4px solid rgba(0, 0, 0, 0.2);
  padding-left: 1em;
  margin: 0.5em 0;
  font-style: italic;
}

.message-content a {
  color: inherit;
  text-decoration: underline;
  opacity: 0.8;
}

.message-content a:hover {
  opacity: 1;
}

/* Dark mode adjustments for HTML content */
.dark .message-content code {
  background: rgba(255, 255, 255, 0.1);
}

.dark .message-content pre {
  background: rgba(255, 255, 255, 0.1);
}

.dark .message-content blockquote {
  border-left-color: rgba(255, 255, 255, 0.3);
}
</style>
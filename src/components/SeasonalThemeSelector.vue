<template>
  <!-- Only show if seasonal themes are enabled or in settings mode -->
  <div v-if="seasonalThemesEnabled || showControls" class="seasonal-theme-selector">
    <!-- Theme Selector Button -->
    <Menu as="div" class="relative">
      <MenuButton 
        class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 theme-selector-button text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ currentTheme.decorations[0] }}</span>
          <span class="text-sm font-medium">{{ currentTheme.name }}</span>
          <i class="fas fa-chevron-down text-xs opacity-60"></i>
        </div>
      </MenuButton>
      
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems class="absolute right-0 mt-2 w-80 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-xl">🎨</span>
              Choose Your Season
            </h3>
            
            <!-- Seasonal Themes Toggle -->
            <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">Seasonal Themes</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Enable seasonal decorations and animations</div>
                </div>
                <button
                  @click="toggleSeasonalThemes"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                    seasonalThemesEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  ]"
                >
                  <span class="sr-only">Enable seasonal themes</span>
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      seasonalThemesEnabled ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
              </div>
            </div>
            
            <!-- Theme Selection (only visible when seasonal themes are enabled) -->
            <div v-if="seasonalThemesEnabled">
            
              <!-- Auto Theme Option -->
              <MenuItem v-slot="{ active }">
                <button
                  @click="setAutoTheme"
                  :class="[
                    'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 mb-2',
                    isAutoTheme ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span class="text-white text-lg">🤖</span>
                  </div>
                  <div class="flex-1 text-left">
                    <div class="font-medium">Auto Season</div>
                    <div class="text-sm opacity-75">Changes automatically</div>
                  </div>
                  <div v-if="isAutoTheme" class="text-blue-500">
                    <i class="fas fa-check"></i>
                  </div>
                </button>
              </MenuItem>
            
              <!-- Theme Options Grid -->
              <div class="grid grid-cols-2 gap-2">
                <MenuItem v-for="theme in availableThemes" :key="theme.key" v-slot="{ active }">
                  <button
                    @click="selectTheme(theme.key)"
                    :class="[
                      'flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 theme-card bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white',
                      selectedThemeKey === theme.key ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:shadow-md'
                    ]"
                  >
                    <div class="text-2xl">{{ theme.decorations[0] }}</div>
                    <div class="text-xs font-medium text-center">{{ theme.name }}</div>
                    <div class="flex gap-1">
                      <span v-for="decoration in theme.decorations.slice(1, 4)" :key="decoration" class="text-xs">
                        {{ decoration }}
                      </span>
                    </div>
                  </button>
                </MenuItem>
              </div>
            
              <!-- Preview Section -->
              <div v-if="previewTheme" class="mt-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div class="text-center">
                  <div class="text-lg mb-2 text-gray-900 dark:text-white">{{ previewTheme.name }} Preview</div>
                  <div class="flex justify-center gap-2 mb-2">
                    <span v-for="decoration in previewTheme.decorations" :key="decoration" class="text-lg">
                      {{ decoration }}
                    </span>
                  </div>
                  <div class="text-sm opacity-75 text-gray-700 dark:text-gray-300">
                    Experience the magic of {{ previewTheme.name.toLowerCase() }} throughout your dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MenuItems>
      </transition>
    </Menu>
    
    <!-- Seasonal Decorations Overlay (only show if seasonal themes are enabled) -->
    <div v-if="seasonalThemesEnabled && showDecorations" class="seasonal-decorations" :class="decorationClass">
      <div 
        v-for="(decoration, index) in floatingDecorations" 
        :key="index"
        class="floating-decoration"
        :style="decoration.style"
      >
        {{ decoration.emoji }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { 
  getAllThemes, 
  getCurrentTheme, 
  getThemeByKey, 
  saveThemePreference, 
  getThemePreference, 
  clearThemeOverride,
  generateThemeCSS,
  saveSeasonalThemesEnabled,
  getSeasonalThemesEnabled
} from '../utils/seasonalThemes.js'

// Props to control visibility from parent components
const props = defineProps({
  showControls: {
    type: Boolean,
    default: false
  }
})

// Reactive state
const selectedThemeKey = ref(null)
const isAutoTheme = ref(true)
const showDecorations = ref(true)
const previewTheme = ref(null)
const floatingDecorations = ref([])
const seasonalThemesEnabled = ref(false) // Default to disabled

// Computed properties
const availableThemes = computed(() => getAllThemes())
const currentTheme = computed(() => {
  if (isAutoTheme.value) {
    return getCurrentTheme()
  }
  return getThemeByKey(selectedThemeKey.value) || getCurrentTheme()
})

// Remove the buttonStyle computed property since we're using Tailwind classes

const decorationClass = computed(() => {
  return `decoration-${currentTheme.value.particles.type}`
})

// Methods
const selectTheme = (themeKey) => {
  selectedThemeKey.value = themeKey
  isAutoTheme.value = false
  saveThemePreference(themeKey)
  applyTheme()
  generateFloatingDecorations()
}

const setAutoTheme = () => {
  isAutoTheme.value = true
  selectedThemeKey.value = null
  clearThemeOverride()
  applyTheme()
  generateFloatingDecorations()
}

const applyTheme = () => {
  const theme = currentTheme.value
  const cssVars = generateThemeCSS(theme)
  
  // Apply CSS variables to root
  const root = document.documentElement
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  
  // Emit theme change event
  document.dispatchEvent(new CustomEvent('themeChanged', { 
    detail: { theme, isAuto: isAutoTheme.value } 
  }))
}

// Remove the getThemeCardStyle method since we're using Tailwind classes

// Remove the getPreviewStyle method since we're using Tailwind classes

const toggleSeasonalThemes = () => {
  seasonalThemesEnabled.value = !seasonalThemesEnabled.value
  saveSeasonalThemesEnabled(seasonalThemesEnabled.value)
  
  if (!seasonalThemesEnabled.value) {
    // If disabling, clear any overrides and reset to auto theme
    clearThemeOverride()
    isAutoTheme.value = true
    selectedThemeKey.value = null
    showDecorations.value = false
    floatingDecorations.value = []
  } else {
    // If enabling, restore decorations
    showDecorations.value = true
    generateFloatingDecorations()
  }
  
  applyTheme()
}

const generateFloatingDecorations = () => {
  // Only generate decorations if seasonal themes are enabled
  if (!seasonalThemesEnabled.value) {
    floatingDecorations.value = []
    return
  }
  
  const theme = currentTheme.value
  floatingDecorations.value = []
  
  // Generate random floating decorations
  const decorationCount = theme.particles.density === 'high' ? 8 : theme.particles.density === 'medium' ? 5 : 3
  
  for (let i = 0; i < decorationCount; i++) {
    floatingDecorations.value.push({
      emoji: theme.decorations[Math.floor(Math.random() * theme.decorations.length)],
      style: {
        position: 'fixed',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 20 + 15}px`,
        opacity: Math.random() * 0.6 + 0.2,
        animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        pointerEvents: 'none',
        zIndex: 1
      }
    })
  }
}

// Lifecycle
onMounted(() => {
  // Load seasonal themes enabled preference (default to false)
  seasonalThemesEnabled.value = getSeasonalThemesEnabled()
  
  // Only load theme preferences if seasonal themes are enabled
  if (seasonalThemesEnabled.value) {
    const savedTheme = getThemePreference()
    if (savedTheme && localStorage.getItem('algo_theme_override') === 'true') {
      selectedThemeKey.value = savedTheme
      isAutoTheme.value = false
    }
    
    generateFloatingDecorations()
    
    // Regenerate decorations periodically
    setInterval(() => {
      if (seasonalThemesEnabled.value) {
        generateFloatingDecorations()
      }
    }, 30000) // Every 30 seconds
  } else {
    // If seasonal themes are disabled, ensure no decorations
    showDecorations.value = false
    floatingDecorations.value = []
  }
  
  applyTheme()
})

// Watch for theme changes
watch(() => currentTheme.value, () => {
  applyTheme()
}, { deep: true })

// Expose for parent components
defineExpose({
  currentTheme,
  applyTheme,
  generateFloatingDecorations,
  seasonalThemesEnabled
})
</script>

<style scoped>
.theme-selector-button {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.theme-selector-button:hover {
  transform: translateY(-1px);
}

.theme-card {
  backdrop-filter: blur(5px);
  transition: all 0.2s ease;
}

.theme-card:hover {
  transform: translateY(-2px);
}

.floating-decoration {
  user-select: none;
  z-index: 1;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, -10px) rotate(5deg);
  }
  50% {
    transform: translate(-5px, -20px) rotate(-5deg);
  }
  75% {
    transform: translate(-10px, -10px) rotate(3deg);
  }
}

/* Seasonal decoration animations */
.decoration-leaves .floating-decoration {
  animation: leaffall 20s linear infinite;
}

.decoration-snowflakes .floating-decoration {
  animation: snowfall 25s linear infinite;
}

.decoration-petals .floating-decoration {
  animation: petalfall 18s ease-in-out infinite;
}

.decoration-stars .floating-decoration {
  animation: twinkle 3s ease-in-out infinite;
}

.decoration-confetti .floating-decoration {
  animation: confettifall 8s ease-out infinite;
}

@keyframes leaffall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes snowfall {
  0% {
    transform: translateY(-100vh) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(100px);
    opacity: 0;
  }
}

@keyframes petalfall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes confettifall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
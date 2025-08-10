<template>
  <div v-if="isActive" class="confetti-container fixed inset-0 pointer-events-none z-50">
    <!-- Confetti Pieces -->
    <div 
      v-for="(piece, index) in confettiPieces" 
      :key="index"
      class="confetti-piece absolute"
      :style="piece.style"
      :class="piece.class"
    >
      {{ piece.content }}
    </div>
    
    <!-- Celebration Text -->
    <div v-if="showCelebrationText" class="celebration-text fixed inset-0 flex items-center justify-center p-4">
      <div class="text-center celebration-message">
        <div class="text-4xl sm:text-5xl lg:text-6xl mb-4 animate-bounce">🎉</div>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 celebration-title">
          Welcome Back!
        </h2>
        <p class="text-lg sm:text-xl text-white/90 celebration-subtitle">
          Ready to continue your learning adventure? ✨
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  duration: {
    type: Number,
    default: 4000
  },
  intensity: {
    type: String,
    default: 'high',
    validator: (value) => ['low', 'medium', 'high', 'extreme'].includes(value)
  }
})

const emit = defineEmits(['complete'])

// Reactive state
const isActive = ref(false)
const showCelebrationText = ref(false)
const confettiPieces = ref([])
let animationInterval = null
let timeoutId = null

// Confetti configuration
const confettiConfig = {
  low: { count: 30, duration: 3000 },
  medium: { count: 60, duration: 4000 },
  high: { count: 100, duration: 5000 },
  extreme: { count: 150, duration: 6000 }
}

// Confetti shapes and emojis
const confettiShapes = [
  // Educational emojis
  '🎓', '📚', '✨', '🌟', '💫', '🎊', '🎉', '🏆', '👏', '🎯',
  '📝', '✏️', '🔥', '💪', '🚀', '🌈', '⭐', '💎', '🎪', '🎭'
]

const confettiColors = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE',
  '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#D2B4DE'
]

// Create individual confetti piece
const createConfettiPiece = (index) => {
  const isEmoji = Math.random() > 0.3
  const content = isEmoji 
    ? confettiShapes[Math.floor(Math.random() * confettiShapes.length)]
    : ''
  
  const startX = Math.random() * window.innerWidth
  const startY = -50
  const endX = startX + (Math.random() - 0.5) * 400
  const endY = window.innerHeight + 100
  const rotation = Math.random() * 720 + 360
  const scale = Math.random() * 0.8 + 0.6
  const duration = Math.random() * 3 + 2
  const delay = Math.random() * 2
  
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)]
  
  return {
    content,
    class: isEmoji ? 'confetti-emoji' : 'confetti-shape',
    style: {
      left: startX + 'px',
      top: startY + 'px',
      '--end-x': endX + 'px',
      '--end-y': endY + 'px',
      '--rotation': rotation + 'deg',
      '--scale': scale,
      '--duration': duration + 's',
      '--delay': delay + 's',
      '--color': color,
      fontSize: isEmoji ? (Math.random() * 20 + 20) + 'px' : '0px',
      color: isEmoji ? 'transparent' : color,
      backgroundColor: isEmoji ? 'transparent' : color,
      width: isEmoji ? 'auto' : (Math.random() * 8 + 4) + 'px',
      height: isEmoji ? 'auto' : (Math.random() * 8 + 4) + 'px',
      animationDuration: duration + 's',
      animationDelay: delay + 's'
    }
  }
}

// Generate confetti pieces
const generateConfetti = () => {
  const config = confettiConfig[props.intensity]
  confettiPieces.value = []
  
  for (let i = 0; i < config.count; i++) {
    confettiPieces.value.push(createConfettiPiece(i))
  }
}

// Start confetti explosion
const explode = () => {
  isActive.value = true
  generateConfetti()
  
  // Show celebration text after a short delay
  setTimeout(() => {
    showCelebrationText.value = true
  }, 500)
  
  // Hide celebration text before confetti ends
  setTimeout(() => {
    showCelebrationText.value = false
  }, props.duration - 1000)
  
  // End the confetti
  timeoutId = setTimeout(() => {
    stop()
  }, props.duration)
}

// Stop confetti
const stop = () => {
  isActive.value = false
  showCelebrationText.value = false
  confettiPieces.value = []
  
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  
  emit('complete')
}

// Cleanup
onUnmounted(() => {
  stop()
})

// Expose methods
defineExpose({
  explode,
  stop
})
</script>

<style scoped>
.confetti-container {
  overflow: hidden;
}

.confetti-piece {
  animation: confettiFall var(--duration) var(--delay) ease-out forwards;
  transform-origin: center;
}

.confetti-emoji {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.confetti-shape {
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes confettiFall {
  0% {
    transform: translateX(0) translateY(0) rotateZ(0deg) scale(var(--scale));
    opacity: 1;
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(var(--end-x)) translateY(var(--end-y)) rotateZ(var(--rotation)) scale(0.2);
    opacity: 0;
  }
}

/* Celebration Text Animations */
.celebration-text {
  animation: celebrationAppear 1s ease-out;
}

.celebration-message {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.celebration-title {
  background: linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4, #45B7D1);
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGradient 2s ease-in-out infinite, titleBounce 0.6s ease-out;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.celebration-subtitle {
  animation: subtitleSlide 0.8s ease-out 0.3s both;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes celebrationAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes titleGradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes titleBounce {
  0% {
    transform: scale(0.3) translateY(20px);
  }
  50% {
    transform: scale(1.05) translateY(-10px);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

@keyframes subtitleSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Additional confetti physics */
.confetti-piece:nth-child(odd) {
  animation-timing-function: ease-in-out;
}

.confetti-piece:nth-child(even) {
  animation-timing-function: ease-in;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .celebration-title {
    font-size: 2rem;
  }
  
  .celebration-subtitle {
    font-size: 1rem;
  }
  
  .celebration-message {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>
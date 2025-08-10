// Seasonal Themes System for AlgoSchool.app
// This creates a magical, ever-changing experience based on seasons and Islamic calendar

export const SEASONS = {
  BACK_TO_SCHOOL: 'back-to-school',
  AUTUMN: 'autumn',
  WINTER: 'winter',
  SPRING: 'spring',
  SUMMER: 'summer',
  RAMADAN: 'ramadan',
  EID: 'eid',
  GRADUATION: 'graduation'
}

export const SEASONAL_THEMES = {
  [SEASONS.BACK_TO_SCHOOL]: {
    name: 'Back to School',
    period: { start: { month: 8, day: 1 }, end: { month: 9, day: 30 } },
    colors: {
      primary: '#4F46E5', // Indigo
      secondary: '#F59E0B', // Amber
      accent: '#EF4444', // Red
      background: '#FEF3C7', // Light yellow
      surface: '#FFFFFF',
      text: '#1F2937'
    },
    decorations: [
      '📚', '✏️', '🎒', '📝', '🏫', '🍎'
    ],
    backgroundPattern: 'notebooks',
    particles: {
      type: 'books',
      density: 'medium',
      colors: ['#4F46E5', '#F59E0B', '#EF4444']
    }
  },

  [SEASONS.AUTUMN]: {
    name: 'Autumn Learning',
    period: { start: { month: 10, day: 1 }, end: { month: 11, day: 30 } },
    colors: {
      primary: '#D97706', // Orange
      secondary: '#92400E', // Brown
      accent: '#DC2626', // Red
      background: '#FEF3C7', // Warm cream
      surface: '#FFFBEB',
      text: '#92400E'
    },
    decorations: [
      '🍂', '🍁', '🌰', '🎃', '🦃', '📖'
    ],
    backgroundPattern: 'leaves',
    particles: {
      type: 'leaves',
      density: 'high',
      colors: ['#D97706', '#92400E', '#DC2626', '#F59E0B']
    }
  },

  [SEASONS.WINTER]: {
    name: 'Winter Wisdom',
    period: { start: { month: 12, day: 1 }, end: { month: 2, day: 28 } },
    colors: {
      primary: '#1E40AF', // Blue
      secondary: '#059669', // Emerald
      accent: '#DC2626', // Red
      background: '#F0F9FF', // Light blue
      surface: '#FFFFFF',
      text: '#1E3A8A'
    },
    decorations: [
      '❄️', '⛄', '🎄', '🎁', '📚', '☕'
    ],
    backgroundPattern: 'snowflakes',
    particles: {
      type: 'snowflakes',
      density: 'medium',
      colors: ['#1E40AF', '#059669', '#FFFFFF', '#E0E7FF']
    }
  },

  [SEASONS.SPRING]: {
    name: 'Spring Growth',
    period: { start: { month: 3, day: 1 }, end: { month: 5, day: 31 } },
    colors: {
      primary: '#059669', // Green
      secondary: '#7C3AED', // Purple
      accent: '#F59E0B', // Yellow
      background: '#ECFDF5', // Light green
      surface: '#FFFFFF',
      text: '#064E3B'
    },
    decorations: [
      '🌸', '🌱', '🌻', '🦋', '🐝', '📚'
    ],
    backgroundPattern: 'flowers',
    particles: {
      type: 'petals',
      density: 'high',
      colors: ['#059669', '#7C3AED', '#F59E0B', '#EC4899']
    }
  },

  [SEASONS.SUMMER]: {
    name: 'Summer Break',
    period: { start: { month: 6, day: 1 }, end: { month: 7, day: 31 } },
    colors: {
      primary: '#0EA5E9', // Sky blue
      secondary: '#F59E0B', // Sunny yellow
      accent: '#EC4899', // Pink
      background: '#F0F9FF', // Light blue
      surface: '#FFFFFF',
      text: '#0C4A6E'
    },
    decorations: [
      '☀️', '🏖️', '🌊', '🍉', '🏊', '📖'
    ],
    backgroundPattern: 'waves',
    particles: {
      type: 'bubbles',
      density: 'low',
      colors: ['#0EA5E9', '#F59E0B', '#EC4899', '#FFFFFF']
    }
  },

  [SEASONS.RAMADAN]: {
    name: 'Ramadan Reflection',
    period: null, // Calculated based on Islamic calendar
    colors: {
      primary: '#7C3AED', // Purple
      secondary: '#059669', // Green
      accent: '#F59E0B', // Gold
      background: '#F5F3FF', // Light purple
      surface: '#FFFFFF',
      text: '#581C87'
    },
    decorations: [
      '🌙', '⭐', '🕌', '📿', '🤲', '📚'
    ],
    backgroundPattern: 'crescents',
    particles: {
      type: 'stars',
      density: 'medium',
      colors: ['#7C3AED', '#059669', '#F59E0B', '#FBBF24']
    }
  },

  [SEASONS.EID]: {
    name: 'Eid Celebration',
    period: null, // Calculated based on Islamic calendar
    colors: {
      primary: '#059669', // Green
      secondary: '#F59E0B', // Gold
      accent: '#EC4899', // Pink
      background: '#ECFDF5', // Light green
      surface: '#FFFFFF',
      text: '#064E3B'
    },
    decorations: [
      '🎉', '🎊', '🌙', '⭐', '🎁', '🕌'
    ],
    backgroundPattern: 'celebration',
    particles: {
      type: 'confetti',
      density: 'high',
      colors: ['#059669', '#F59E0B', '#EC4899', '#7C3AED']
    }
  },

  [SEASONS.GRADUATION]: {
    name: 'Graduation Pride',
    period: { start: { month: 5, day: 15 }, end: { month: 6, day: 15 } },
    colors: {
      primary: '#1E40AF', // Royal blue
      secondary: '#F59E0B', // Gold
      accent: '#DC2626', // Red
      background: '#EFF6FF', // Light blue
      surface: '#FFFFFF',
      text: '#1E3A8A'
    },
    decorations: [
      '🎓', '🏆', '🎉', '📜', '🌟', '🎊'
    ],
    backgroundPattern: 'caps',
    particles: {
      type: 'graduation-caps',
      density: 'medium',
      colors: ['#1E40AF', '#F59E0B', '#DC2626', '#7C3AED']
    }
  }
}

// Helper functions
export function getCurrentSeason() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()

  // Check Islamic calendar events first (these would need actual Islamic calendar integration)
  // For now, we'll use approximate dates
  
  // Check regular seasonal periods
  for (const [seasonKey, theme] of Object.entries(SEASONAL_THEMES)) {
    if (!theme.period) continue // Skip Islamic calendar events for now
    
    const { start, end } = theme.period
    
    // Handle cross-year periods (like winter)
    if (start.month > end.month) {
      if (currentMonth >= start.month || currentMonth <= end.month) {
        if (currentMonth === start.month && currentDay >= start.day) return seasonKey
        if (currentMonth === end.month && currentDay <= end.day) return seasonKey
        if (currentMonth > start.month || currentMonth < end.month) return seasonKey
      }
    } else {
      // Same year period
      if (currentMonth >= start.month && currentMonth <= end.month) {
        if (currentMonth === start.month && currentDay >= start.day) return seasonKey
        if (currentMonth === end.month && currentDay <= end.day) return seasonKey
        if (currentMonth > start.month && currentMonth < end.month) return seasonKey
      }
    }
  }
  
  // Default fallback
  return SEASONS.SPRING
}

export function getThemeByKey(seasonKey) {
  return SEASONAL_THEMES[seasonKey] || SEASONAL_THEMES[SEASONS.SPRING]
}

export function getCurrentTheme() {
  const currentSeason = getCurrentSeason()
  return getThemeByKey(currentSeason)
}

export function getAllThemes() {
  return Object.entries(SEASONAL_THEMES).map(([key, theme]) => ({
    key,
    ...theme
  }))
}

// CSS Variable generator for themes
export function generateThemeCSS(theme) {
  return {
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-accent': theme.colors.accent,
    '--theme-background': theme.colors.background,
    '--theme-surface': theme.colors.surface,
    '--theme-text': theme.colors.text
  }
}

// Local storage helpers
export function saveThemePreference(seasonKey) {
  localStorage.setItem('algo_seasonal_theme', seasonKey)
  localStorage.setItem('algo_theme_override', 'true')
}

export function getThemePreference() {
  const override = localStorage.getItem('algo_theme_override') === 'true'
  const saved = localStorage.getItem('algo_seasonal_theme')
  
  if (override && saved) {
    return saved
  }
  
  return getCurrentSeason()
}

export function clearThemeOverride() {
  localStorage.removeItem('algo_theme_override')
  localStorage.removeItem('algo_seasonal_theme')
}
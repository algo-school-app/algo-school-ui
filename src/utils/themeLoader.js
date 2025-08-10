// Theme loader utility
export const loadCustomTheme = () => {
  const savedTheme = localStorage.getItem('algo_custom_theme')
  if (savedTheme) {
    try {
      const themeConfig = JSON.parse(savedTheme)
      applyCustomTheme(themeConfig)
    } catch (error) {
      console.error('Failed to load custom theme:', error)
    }
  }
}

export const applyCustomTheme = (themeConfig) => {
  // Apply font styles
  document.documentElement.style.setProperty('--custom-font-primary', themeConfig.font.primary)
  document.documentElement.style.setProperty('--custom-font-heading', themeConfig.font.heading)
  document.documentElement.style.setProperty('--custom-font-size', themeConfig.font.baseSize + 'px')
  
  // Apply colors
  document.documentElement.style.setProperty('--custom-primary', themeConfig.colors.primary)
  document.documentElement.style.setProperty('--custom-secondary', themeConfig.colors.secondary)
  document.documentElement.style.setProperty('--custom-bg-light', themeConfig.colors.backgroundLight)
  document.documentElement.style.setProperty('--custom-bg-dark', themeConfig.colors.backgroundDark)
  
  // Apply to body for immediate effect
  document.body.style.fontFamily = themeConfig.font.primary
  document.body.style.fontSize = themeConfig.font.baseSize + 'px'
}

export const resetCustomTheme = () => {
  const defaultTheme = {
    font: {
      primary: 'system-ui',
      heading: 'system-ui',
      baseSize: 16
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      backgroundLight: '#ffffff',
      backgroundDark: '#111827'
    }
  }
  
  applyCustomTheme(defaultTheme)
  document.documentElement.style.removeProperty('--custom-font-primary')
  document.documentElement.style.removeProperty('--custom-font-heading')
  document.documentElement.style.removeProperty('--custom-font-size')
  document.documentElement.style.removeProperty('--custom-primary')
  document.documentElement.style.removeProperty('--custom-secondary')
  document.documentElement.style.removeProperty('--custom-bg-light')
  document.documentElement.style.removeProperty('--custom-bg-dark')
  
  document.body.style.fontFamily = ''
  document.body.style.fontSize = ''
}
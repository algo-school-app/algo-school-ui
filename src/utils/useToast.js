// Toast utility for easy access across components
export const useToast = () => {
  // Helper function to show toast with fallback
  const showToast = (type, title, message = '', duration = 5000) => {
    if (window.toast && window.toast[type]) {
      return window.toast[type](title, message, duration)
    } else {
      // Fallback to alert if toast is not available
      console.warn('Toast component not available, using fallback')
      const fallbackMessage = message ? `${title}: ${message}` : title
      alert(fallbackMessage)
    }
  }

  return {
    success: (title, message = '', duration = 5000) => showToast('success', title, message, duration),
    error: (title, message = '', duration = 7000) => showToast('error', title, message, duration),
    warning: (title, message = '', duration = 6000) => showToast('warning', title, message, duration),
    info: (title, message = '', duration = 5000) => showToast('info', title, message, duration)
  }
}
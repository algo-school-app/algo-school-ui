import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset window.toast mock
    global.window.toast = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    }
  })

  it('calls window.toast.success when available', () => {
    const toast = useToast()
    
    toast.success('Test Title', 'Test Message', 3000)
    
    expect(window.toast.success).toHaveBeenCalledWith('Test Title', 'Test Message', 3000)
  })

  it('calls window.toast.error when available', () => {
    const toast = useToast()
    
    toast.error('Error Title', 'Error Message', 7000)
    
    expect(window.toast.error).toHaveBeenCalledWith('Error Title', 'Error Message', 7000)
  })

  it('falls back to alert when toast is not available', () => {
    // Mock alert
    global.alert = vi.fn()
    
    // Remove window.toast
    delete global.window.toast
    
    const toast = useToast()
    toast.success('Test Title', 'Test Message')
    
    expect(global.alert).toHaveBeenCalledWith('Test Title: Test Message')
  })

  it('falls back to alert when toast method is not available', () => {
    // Mock alert
    global.alert = vi.fn()
    
    // Remove specific toast method
    global.window.toast = { error: vi.fn() } // missing success
    
    const toast = useToast()
    toast.success('Test Title', 'Test Message')
    
    expect(global.alert).toHaveBeenCalledWith('Test Title: Test Message')
  })

  it('handles title-only messages', () => {
    const toast = useToast()
    
    toast.info('Info Title')
    
    expect(window.toast.info).toHaveBeenCalledWith('Info Title', '', 5000)
  })

  it('uses default durations for different types', () => {
    const toast = useToast()
    
    toast.success('Success')
    toast.error('Error')
    toast.warning('Warning')
    toast.info('Info')
    
    expect(window.toast.success).toHaveBeenCalledWith('Success', '', 5000)
    expect(window.toast.error).toHaveBeenCalledWith('Error', '', 7000)
    expect(window.toast.warning).toHaveBeenCalledWith('Warning', '', 6000)
    expect(window.toast.info).toHaveBeenCalledWith('Info', '', 5000)
  })
})
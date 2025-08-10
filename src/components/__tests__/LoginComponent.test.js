import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils'
import LoginComponent from '../LoginComponent.vue'

// Mock the services
vi.mock('../../services/supabase.js', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn()
    }
  }
}))

vi.mock('../../services/userService.js', () => ({
  UserService: {
    loadUserProfile: vi.fn()
  }
}))

describe('LoginComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders login form correctly', () => {
    const { getByText, getByLabelText } = renderWithProviders(LoginComponent)

    expect(getByText('AlgoSchool.app')).toBeInTheDocument()
    expect(getByText('MCGP School - Islamic Weekend Learning')).toBeInTheDocument()
    expect(getByLabelText('Username')).toBeInTheDocument()
    expect(getByLabelText('Password')).toBeInTheDocument()
    expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation error for empty fields', async () => {
    const user = userEvent.setup()
    const { getByRole, getByText } = renderWithProviders(LoginComponent)

    const submitButton = getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    expect(getByText('Please enter both username and password')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    const { getByLabelText, getByRole } = renderWithProviders(LoginComponent)

    // Mock successful auth response
    const { supabase } = await import('../../services/supabase.js')
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123', email: 'test@mcgp.school' } },
      error: null
    })

    const { UserService } = await import('../../services/userService.js')
    UserService.loadUserProfile.mockResolvedValue({
      success: true,
      user_profile: { person_id: '123' }
    })

    // Fill and submit form
    await user.type(getByLabelText('Username'), 'testuser')
    await user.type(getByLabelText('Password'), 'password123')
    await user.click(getByRole('button', { name: /sign in/i }))

    // Verify auth was called with correct parameters
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'testuser@mcgp.school',
      password: 'password123'
    })
  })

  it('shows tenant access dialog when user has no tenants', async () => {
    const user = userEvent.setup()
    const { getByLabelText, getByRole, getByText } = renderWithProviders(LoginComponent)

    // Mock successful auth but no tenant access
    const { supabase } = await import('../../services/supabase.js')
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123', email: 'test@mcgp.school' } },
      error: null
    })

    const { UserService } = await import('../../services/userService.js')
    UserService.loadUserProfile.mockResolvedValue({
      success: false,
      error: 'User has no access to any tenants'
    })

    // Fill and submit form
    await user.type(getByLabelText('Username'), 'testuser')
    await user.type(getByLabelText('Password'), 'password123')
    await user.click(getByRole('button', { name: /sign in/i }))

    // Should show tenant access dialog
    expect(getByText('Access Required')).toBeInTheDocument()
    expect(getByText(/contact the school administration/i)).toBeInTheDocument()
  })

  it('handles authentication errors', async () => {
    const user = userEvent.setup()
    const { getByLabelText, getByRole, getByText } = renderWithProviders(LoginComponent)

    // Mock auth error
    const { supabase } = await import('../../services/supabase.js')
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' }
    })

    // Fill and submit form
    await user.type(getByLabelText('Username'), 'testuser')
    await user.type(getByLabelText('Password'), 'wrongpassword')
    await user.click(getByRole('button', { name: /sign in/i }))

    // Should show error message
    expect(getByText('Invalid login credentials')).toBeInTheDocument()
  })

  it('handles tenant access dialog actions', async () => {
    const user = userEvent.setup()
    const { getByLabelText, getByRole, getByText } = renderWithProviders(LoginComponent)

    // Setup no tenant access scenario
    const { supabase } = await import('../../services/supabase.js')
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    })

    const { UserService } = await import('../../services/userService.js')
    UserService.loadUserProfile.mockResolvedValue({
      success: false,
      error: 'User has no access to any tenants'
    })

    // Trigger tenant access dialog
    await user.type(getByLabelText('Username'), 'testuser')
    await user.type(getByLabelText('Password'), 'password123')
    await user.click(getByRole('button', { name: /sign in/i }))

    // Test Close button
    const closeButton = getByRole('button', { name: /close/i })
    await user.click(closeButton)

    // Dialog should be closed (test by checking if we're back to login form)
    expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})
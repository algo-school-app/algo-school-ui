import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils'
import ConfirmationDialog from '../ConfirmationDialog.vue'

describe('ConfirmationDialog', () => {
  const defaultProps = {
    title: 'Test Title',
    message: 'Test message',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  }

  it('renders correctly when open', async () => {
    const { getByText } = renderWithProviders(ConfirmationDialog, {
      props: defaultProps
    })

    // Open the dialog
    const component = screen.getByRole('button', { name: /confirm/i })
    expect(component).toBeInTheDocument()
  })

  it('emits confirm event when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    
    const { getByRole, emitted } = renderWithProviders(ConfirmationDialog, {
      props: {
        ...defaultProps,
        onConfirm
      }
    })

    const confirmButton = getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)

    expect(emitted()).toHaveProperty('confirm')
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    
    const { getByRole, emitted } = renderWithProviders(ConfirmationDialog, {
      props: {
        ...defaultProps,
        onCancel
      }
    })

    const cancelButton = getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(emitted()).toHaveProperty('cancel')
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    
    renderWithProviders(ConfirmationDialog, {
      props: {
        ...defaultProps,
        onConfirm,
        onCancel
      }
    })

    // Test Escape key
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalled()

    // Test Enter key
    await user.keyboard('{Enter}')
    expect(onConfirm).toHaveBeenCalled()
  })

  it('displays custom icon and text', () => {
    const { getByText } = renderWithProviders(ConfirmationDialog, {
      props: {
        ...defaultProps,
        confirmText: 'Delete Forever',
        confirmIcon: 'fas fa-trash'
      }
    })

    expect(getByText('Delete Forever')).toBeInTheDocument()
  })
})
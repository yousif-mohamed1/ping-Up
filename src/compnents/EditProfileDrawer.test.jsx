import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '../test/test-utils'
import EditProfileDrawer from './EditProfileDrawer'
import { dummyUserData } from '../assets/assets'

const baseProfile = {
  ...dummyUserData,
  cover_gradient: { id: 'pink-blue', from: '#c7d2fe', to: '#fbcfe8' },
}

const originalCreateObjectURL = URL.createObjectURL

const renderDrawer = (overrides = {}) => {
  const onSave = vi.fn()
  const onClose = vi.fn()
  const view = render(
    <EditProfileDrawer
      isOpen
      onClose={onClose}
      onSave={onSave}
      profile={{ ...baseProfile, ...overrides }}
    />,
  )

  return { ...view, onSave, onClose }
}

const settleUsernameCheck = () => {
  act(() => {
    vi.advanceTimersByTime(650)
  })
}

describe('EditProfileDrawer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    URL.createObjectURL = vi.fn((file) => `blob:${file.name}`)
  })

  afterEach(() => {
    vi.useRealTimers()
    URL.createObjectURL = originalCreateObjectURL
  })

  it('renders required and optional FormField labels correctly', () => {
    renderDrawer()

    expect(screen.getByText(/full name/i, { selector: 'label' })).toHaveTextContent('*')
    expect(screen.getByText(/username/i, { selector: 'label' })).toHaveTextContent('*')
    expect(screen.getByText('Bio', { selector: 'label' })).not.toHaveTextContent('*')
    expect(screen.getByText('Location', { selector: 'label' })).not.toHaveTextContent('*')
    expect(screen.getByText('Website URL', { selector: 'label' })).not.toHaveTextContent('*')

    expect(document.querySelectorAll('span.text-red-400')).toHaveLength(2)
  })

  it('updates preview image when a new profile picture is selected', () => {
    const { container } = renderDrawer()
    const fileInput = container.querySelector('input[type="file"][accept="image/*"]')
    const file = new File(['image-bytes'], 'new-avatar.png', { type: 'image/png' })

    expect(fileInput).toBeInTheDocument()
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    expect(screen.getByAltText('Profile preview')).toHaveAttribute('src', 'blob:new-avatar.png')
  })

  it('validates website URL for invalid, empty, and valid input', () => {
    renderDrawer()
    settleUsernameCheck()

    const websiteInput = screen.getByPlaceholderText('https://example.com')
    fireEvent.change(websiteInput, { target: { value: 'invalid-url' } })
    fireEvent.blur(websiteInput)

    expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument()

    fireEvent.change(websiteInput, { target: { value: '' } })
    fireEvent.blur(websiteInput)
    expect(screen.queryByText(/please enter a valid url/i)).not.toBeInTheDocument()

    fireEvent.change(websiteInput, { target: { value: 'https://example.com/profile' } })
    fireEvent.blur(websiteInput)
    expect(screen.queryByText(/please enter a valid url/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled()
  })

  it('normalizes username and saves successfully when form is valid', () => {
    const { onSave, onClose } = renderDrawer()

    const usernameInput = screen.getByDisplayValue(baseProfile.username)
    fireEvent.change(usernameInput, { target: { value: 'new username' } })

    expect(screen.getByText(/checking/i)).toBeInTheDocument()
    settleUsernameCheck()
    expect(screen.getByText(/username is available/i)).toBeInTheDocument()

    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).toBeEnabled()
    fireEvent.click(saveButton)

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ username: 'new_username' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not save when username availability check fails', () => {
    const { onSave, onClose } = renderDrawer()

    const usernameInput = screen.getByDisplayValue(baseProfile.username)
    fireEvent.change(usernameInput, { target: { value: 'already_taken' } })

    settleUsernameCheck()
    expect(screen.getByText(/username is taken/i)).toBeInTheDocument()

    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).toBeDisabled()

    fireEvent.click(saveButton)

    expect(onSave).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })
})

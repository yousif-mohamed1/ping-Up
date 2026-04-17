import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen, userEvent, within } from '../test/test-utils'
import Settings from './settings'

const getToggleRowByLabel = (container, label) => {
  const labelNode = within(container).getByText(label)
  return labelNode.closest('p')?.closest('div')?.parentElement
}

describe('Settings page', () => {
  it('renders SectionTitle with and without description in Account tab', () => {
    render(<Settings />)

    expect(screen.getByRole('heading', { name: /change email/i })).toBeInTheDocument()
    expect(screen.getByText('Update your login email address.')).toBeInTheDocument()

    const connectedAccountsTitle = screen.getByRole('heading', { name: /connected accounts/i })
    expect(connectedAccountsTitle).toBeInTheDocument()
    expect(connectedAccountsTitle.parentElement?.querySelector('p')).toBeNull()
  })

  it('connects github account from Account tab', async () => {
    render(<Settings />)

    expect(screen.getAllByText('Connected')).toHaveLength(1)
    await userEvent.click(screen.getByRole('button', { name: /connect/i }))

    expect(screen.getAllByText('Connected')).toHaveLength(2)
  })

  it('toggles rows through ToggleSwitch and applies disabled ToggleRow styles for dependent rows', async () => {
    render(<Settings />)

    const twoFactorRow = getToggleRowByLabel(document.body, 'Authenticator App')
    expect(twoFactorRow).not.toBeNull()
    expect(screen.getByText('Add an extra layer of security to your account')).toBeInTheDocument()

    const twoFactorToggle = within(twoFactorRow).getByRole('button')
    expect(twoFactorToggle.className).toContain('bg-gray-300')
    await userEvent.click(twoFactorToggle)
    expect(twoFactorToggle.className).toContain('bg-indigo-600')

    await userEvent.click(screen.getByRole('button', { name: /notifications/i }))

    const pushSection = screen.getByRole('heading', { name: /push notifications/i }).closest('section')
    expect(pushSection).not.toBeNull()

    const masterRow = getToggleRowByLabel(pushSection, 'Enable push notifications')
    expect(masterRow).not.toBeNull()
    const masterToggle = within(masterRow).getByRole('button')
    expect(masterToggle.className).toContain('bg-indigo-600')

    await userEvent.click(masterToggle)
    expect(masterToggle.className).toContain('bg-gray-300')

    const dependentRow = getToggleRowByLabel(pushSection, 'Someone follows me')
    expect(dependentRow).not.toBeNull()
    expect(dependentRow.className).toContain('opacity-40')
    expect(dependentRow.className).toContain('pointer-events-none')
    expect(within(dependentRow).getByRole('button').className).toContain('cursor-not-allowed')
  })

  it('updates RadioGroup selection in Privacy & Safety tab', async () => {
    render(<Settings />)

    await userEvent.click(screen.getByRole('button', { name: /privacy & safety/i }))

    const messageSection = screen.getByRole('heading', { name: /who can message you/i }).closest('section')
    expect(messageSection).not.toBeNull()

    const everyoneRadio = within(messageSection).getByRole('radio', { name: 'Everyone' })
    const connectionsOnlyRadio = within(messageSection).getByRole('radio', { name: 'Connections only' })

    expect(everyoneRadio).toBeChecked()
    expect(connectionsOnlyRadio).not.toBeChecked()

    await userEvent.click(connectionsOnlyRadio)

    expect(connectionsOnlyRadio).toBeChecked()
    expect(everyoneRadio).not.toBeChecked()
  })

  it('renders list state and empty state via renderUserList in Privacy & Safety tab', async () => {
    render(<Settings />)

    await userEvent.click(screen.getByRole('button', { name: /privacy & safety/i }))

    const blockedSection = screen.getByRole('heading', { name: /blocked users/i }).closest('section')
    expect(blockedSection).not.toBeNull()

    expect(within(blockedSection).getAllByRole('button', { name: /unblock/i })).toHaveLength(2)

    await userEvent.click(within(blockedSection).getAllByRole('button', { name: /unblock/i })[0])
    await userEvent.click(within(blockedSection).getAllByRole('button', { name: /unblock/i })[0])

    expect(within(blockedSection).queryByRole('button', { name: /unblock/i })).not.toBeInTheDocument()
    expect(within(blockedSection).getByText('No unblock users')).toBeInTheDocument()
  })

  it('requires DELETE input before enabling account deletion confirmation', async () => {
    render(<Settings />)

    await userEvent.click(screen.getByRole('button', { name: /danger zone/i }))
    await userEvent.click(screen.getByRole('button', { name: /delete account/i }))

    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toBeDisabled()

    await userEvent.type(screen.getByPlaceholderText('DELETE'), 'DELETE')
    expect(confirmButton).toBeEnabled()
  })
})

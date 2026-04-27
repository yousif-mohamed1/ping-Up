import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, userEvent, within } from '../test/test-utils'
import Massges from './massges'

const { mockNavigate, mockConnections } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockConnections: [],
}))

vi.mock('../assets/assets', () => ({
  dummyConnectionsData: mockConnections,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('massges page', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockConnections.splice(
      0,
      mockConnections.length,
      {
        _id: 'u1',
        full_name: 'Alice Doe',
        username: 'alice',
        bio: 'Hello from Alice',
        profile_picture: 'alice.png',
      },
      {
        _id: 'u2',
        full_name: 'Bob Lane',
        username: 'bob',
        bio: 'Hello from Bob',
        profile_picture: 'bob.png',
      },
    )
  })

  it('renders users and navigates to thread when clicking a user row', async () => {
    render(<Massges />)

    expect(screen.getByRole('heading', { name: 'Messages' })).toBeInTheDocument()
    const userName = screen.getByText('Alice Doe')
    const userRow = userName.closest('div.cursor-pointer')

    expect(userRow).toBeTruthy()
    await userEvent.click(userRow)

    expect(mockNavigate).toHaveBeenCalledWith('/messages/u1')
  })

  it('navigates to the clicked user id when selecting another user row', async () => {
    render(<Massges />)

    const secondUserName = screen.getByText('Bob Lane')
    const secondUserRow = secondUserName.closest('div.cursor-pointer')

    expect(secondUserRow).toBeTruthy()
    await userEvent.click(secondUserRow)

    expect(mockNavigate).toHaveBeenCalledWith('/messages/u2')
  })

  it('exposes message and profile quick actions with deterministic navigation calls', async () => {
    render(<Massges />)

    const userName = screen.getByText('Bob Lane')
    const userRow = userName.closest('div.cursor-pointer')
    const actionButtons = within(userRow).getAllByRole('button')

    await userEvent.click(actionButtons[0])
    expect(mockNavigate).toHaveBeenCalledWith('/messages/u2')

    await userEvent.click(actionButtons[1])
    expect(mockNavigate.mock.calls).toContainEqual(['/profile/u2'])
    expect(mockNavigate.mock.calls).toContainEqual(['/messages/u2'])
  })

  it('shows empty state and navigates to discover from action', async () => {
    mockConnections.splice(0, mockConnections.length)
    render(<Massges />)

    expect(screen.getByText('No conversations yet')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Find People' }))

    expect(mockNavigate).toHaveBeenCalledWith('/discover')
  })
})
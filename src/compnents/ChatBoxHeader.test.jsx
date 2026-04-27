import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, userEvent } from '../test/test-utils'
import ChatBoxHeader from './ChatBoxHeader'

describe('ChatBoxHeader', () => {
  it('renders selected user details and navigates back to messages', async () => {
    const navigate = vi.fn()

    const { container } = render(
      <ChatBoxHeader
        navigate={navigate}
        otherUser={{
          full_name: 'Bob Lane',
          profile_picture: 'bob.png',
        }}
      />,
    )

    expect(screen.getByText('Bob Lane')).toBeInTheDocument()
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('src', 'bob.png')

    await userEvent.click(screen.getByRole('button'))
    expect(navigate).toHaveBeenCalledWith('/messages')
  })
})
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, userEvent } from '../test/test-utils'
import ChatMessages from './ChatMessages'

describe('ChatMessages', () => {
  it('renders text and media messages and triggers media open callbacks', async () => {
    const formatTime = vi.fn(() => '10:10 AM')
    const onOpenMedia = vi.fn()

    const chatMessages = [
      {
        _id: 'm1',
        from_user_id: 'me',
        text: 'Plain text message',
        message_type: 'text',
        media_url: '',
        createdAt: '2025-07-01T10:10:00.000Z',
      },
      {
        _id: 'm2',
        from_user_id: 'other',
        text: '',
        message_type: 'image',
        media_url: 'image.png',
        createdAt: '2025-07-01T10:11:00.000Z',
      },
      {
        _id: 'm3',
        from_user_id: 'other',
        text: '',
        message_type: 'video',
        media_url: 'video.mp4',
        createdAt: '2025-07-01T10:12:00.000Z',
      },
    ]

    const { container } = render(
      <ChatMessages
        chatMessages={chatMessages}
        currentUserId='me'
        formatTime={formatTime}
        onOpenMedia={onOpenMedia}
      />,
    )

    expect(screen.getByText('Plain text message')).toBeInTheDocument()
    expect(screen.getByAltText('Chat media')).toHaveAttribute('src', 'image.png')
    expect(container.querySelector('video[src="video.mp4"]')).toBeInTheDocument()
    expect(formatTime).toHaveBeenCalledTimes(3)

    const mediaButtons = screen.getAllByRole('button')
    await userEvent.click(mediaButtons[0])
    await userEvent.click(mediaButtons[1])

    expect(onOpenMedia).toHaveBeenNthCalledWith(1, { url: 'image.png', type: 'image' })
    expect(onOpenMedia).toHaveBeenNthCalledWith(2, { url: 'video.mp4', type: 'video' })
  })
})
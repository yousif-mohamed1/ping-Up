import React, { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../test/test-utils'
import ChatBoxMessages from './ChatBoxMessages'

vi.mock('moment', () => ({
  default: (value) => {
    const time = new Date(value).getTime()
    return {
      _time: time,
      diff: (other, unit) => {
        if (unit === 'minutes') {
          return Math.floor((time - other._time) / 60000)
        }
        return time - other._time
      },
      calendar: () => `calendar-${time}`,
    }
  },
}))

describe('ChatBoxMessages', () => {
  it('renders text/media messages and timestamp groups', () => {
    const bottomRef = createRef()

    const messages = [
      {
        _id: 'm1',
        senderId: 'me',
        text: 'First text',
        media: null,
        mediaType: null,
        createdAt: '2025-01-01T10:00:00.000Z',
      },
      {
        _id: 'm2',
        senderId: 'me',
        text: 'Second text',
        media: null,
        mediaType: null,
        createdAt: '2025-01-01T10:05:00.000Z',
      },
      {
        _id: 'm3',
        senderId: 'other',
        text: '',
        media: 'image-preview.png',
        mediaType: 'image',
        createdAt: '2025-01-01T10:30:00.000Z',
      },
      {
        _id: 'm4',
        senderId: 'other',
        text: '',
        media: 'clip-preview.mp4',
        mediaType: 'video',
        createdAt: '2025-01-01T10:35:00.000Z',
      },
    ]

    const { container } = render(
      <ChatBoxMessages
        messages={messages}
        otherUser={{ profile_picture: 'other.png' }}
        currentUser={{ profile_picture: 'me.png' }}
        bottomRef={bottomRef}
      />,
    )

    expect(screen.getByText('First text')).toBeInTheDocument()
    expect(screen.getByText('Second text')).toBeInTheDocument()
    expect(screen.getAllByText(/calendar-/)).toHaveLength(2)
    expect(screen.getByAltText('message')).toHaveAttribute('src', 'image-preview.png')
    expect(container.querySelector('video[src="clip-preview.mp4"]')).toBeInTheDocument()
    expect(bottomRef.current).toBeInTheDocument()
  })
})
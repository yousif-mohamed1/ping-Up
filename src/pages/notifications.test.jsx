import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, userEvent, waitFor } from '../test/test-utils'
import Notifications from './notifications'

const mockNavigate = vi.fn()

vi.mock('../compnents/skeletons/NotificationSkeleton', () => ({
  default: () => <div data-testid='notification-skeleton'>loading</div>,
}))

vi.mock('../assets/assets', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    dummyNotificationsData: [
      {
        _id: 'n_like',
        type: 'like',
        user: {
          _id: 'user_like',
          full_name: 'Like User',
          profile_picture: 'https://example.com/like.jpg',
        },
        message: 'liked your post',
        seen: false,
        createdAt: '2025-07-01T00:00:00.000Z',
      },
      {
        _id: 'n_comment',
        type: 'comment',
        user: {
          _id: 'user_comment',
          full_name: 'Comment User',
          profile_picture: 'https://example.com/comment.jpg',
        },
        message: 'commented on your post',
        seen: false,
        createdAt: '2025-07-01T01:00:00.000Z',
      },
      {
        _id: 'n_follow',
        type: 'follow',
        user: {
          _id: 'user_2',
          full_name: 'Follow User',
          profile_picture: 'https://example.com/follow.jpg',
        },
        message: 'started following you',
        seen: false,
        createdAt: '2025-07-01T02:00:00.000Z',
      },
      {
        _id: 'n_mention',
        type: 'mention',
        user: {
          _id: 'user_mention',
          full_name: 'Mention User',
          profile_picture: 'https://example.com/mention.jpg',
        },
        message: 'mentioned you in a post',
        seen: true,
        createdAt: '2025-07-01T03:00:00.000Z',
      },
      {
        _id: 'n_system',
        type: 'system',
        user: {
          _id: 'user_system',
          full_name: 'System User',
          profile_picture: 'https://example.com/system.jpg',
        },
        message: 'sent you an update',
        seen: true,
        createdAt: '2025-07-01T04:00:00.000Z',
      },
    ],
  }
})

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal()
  const icon = (name) => ({ className }) => <svg data-testid={`icon-${name}`} className={className} />

  return {
    ...actual,
    Heart: icon('heart'),
    MessageCircle: icon('message-circle'),
    UserPlus: icon('user-plus'),
    AtSign: icon('at-sign'),
    Bell: icon('bell'),
    CheckCheck: icon('check-check'),
  }
})

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Notifications page', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('renders loading skeleton, then notifications and unread count', async () => {
    render(<Notifications />)

    expect(screen.getByTestId('notification-skeleton')).toBeInTheDocument()
    await screen.findByText('3 unread', {}, { timeout: 2500 })

    await waitFor(() => {
      expect(screen.queryByTestId('notification-skeleton')).not.toBeInTheDocument()
    })
    expect(screen.getByText('3 unread')).toBeInTheDocument()
  })

  it('maps notification types to icon wrapper branches including default', async () => {
    render(<Notifications />)
    await screen.findByText('3 unread', {}, { timeout: 2500 })
    await waitFor(() => {
      expect(screen.queryByTestId('notification-skeleton')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('icon-heart').parentElement).toHaveClass('bg-red-100')
    expect(screen.getByTestId('icon-message-circle').parentElement).toHaveClass('bg-blue-100')
    expect(screen.getByTestId('icon-user-plus').parentElement).toHaveClass('bg-green-100')
    expect(screen.getByTestId('icon-at-sign').parentElement).toHaveClass('bg-purple-100')
    expect(screen.getByTestId('icon-bell').parentElement).toHaveClass('bg-gray-100')
  })

  it('marks all notifications as read from header action', async () => {
    render(<Notifications />)
    await screen.findByRole('button', { name: /mark all as read/i }, { timeout: 2500 })

    await userEvent.click(screen.getByRole('button', { name: /mark all as read/i }))

    expect(screen.getByText('All caught up!')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /mark all as read/i })).not.toBeInTheDocument()
  })

  it('marks a single unread notification as read and only navigates for follow type', async () => {
    render(<Notifications />)
    await screen.findByText('3 unread', {}, { timeout: 2500 })
    await waitFor(() => {
      expect(screen.queryByTestId('notification-skeleton')).not.toBeInTheDocument()
    })

    await userEvent.click(screen.getByText(/commented on your post/i))

    expect(screen.getByText('2 unread')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()

    const followItems = await screen.findAllByText('started following you')
    await userEvent.click(followItems[0])

    expect(mockNavigate).toHaveBeenCalledWith('/profile/user_2')
    expect(screen.getByText('1 unread')).toBeInTheDocument()
  })
})

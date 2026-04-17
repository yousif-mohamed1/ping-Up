import { fireEvent, render, screen } from '../test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}))

vi.mock('../assets/assets', () => ({
  dummyRecentMessagesData: [
    {
      _id: 'm1',
      from_user_id: {
        _id: 'u1',
        full_name: 'Alice Stone',
        profile_picture: 'alice.png',
      },
      text: 'Hello from Alice',
      seen: true,
      createdAt: '2025-07-01T00:00:00.000Z',
    },
    {
      _id: 'm2',
      from_user_id: {
        _id: 'u2',
        full_name: 'Bob Lane',
        profile_picture: 'bob.png',
      },
      text: '',
      seen: false,
      createdAt: '2025-07-01T00:00:00.000Z',
    },
  ],
}))

vi.mock('moment', () => ({
  default: () => ({
    fromNow: () => '2h ago',
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import RecentMassges from './RecentMassges'

describe('RecentMassges', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('renders recent messages and fallback media text for empty message', () => {
    render(<RecentMassges />)

    expect(screen.getByText('Recent Messages')).toBeInTheDocument()
    expect(screen.getByText('Alice Stone')).toBeInTheDocument()
    expect(screen.getByText('Hello from Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob Lane')).toBeInTheDocument()
    expect(screen.getByText('Media')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(1)
  })

  it('navigates to message thread when a recent message is clicked', () => {
    render(<RecentMassges />)

    fireEvent.click(screen.getByText('Bob Lane'))
    expect(mockNavigate).toHaveBeenCalledWith('/messages/u2')
  })
})

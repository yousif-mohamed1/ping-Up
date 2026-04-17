import { act, fireEvent, render, screen, within } from '../test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mockNavigate, mockUsers } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUsers: [],
}))

vi.mock('../assets/assets', () => ({
  dummyConnectionsData: mockUsers,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../compnents/GlobalSearch', () => ({
  default: ({ onClose }) => (
    <div data-testid='global-search'>
      <button type='button' onClick={onClose}>
        Close Search
      </button>
    </div>
  ),
}))

vi.mock('../compnents/skeletons/UserCardSkeleton', () => ({
  default: () => <div data-testid='user-card-skeleton'>UserCardSkeleton</div>,
}))

vi.mock('../compnents/UserCard', () => ({
  default: ({ user, isFollowing, onToggleFollow, onOpenProfile }) => (
    <div data-testid='user-card'>
      <p>{user.full_name}</p>
      <p>{isFollowing ? 'following' : 'not-following'}</p>
      <button type='button' onClick={() => onToggleFollow(user._id)}>
        Toggle {user._id}
      </button>
      <button type='button' onClick={() => onOpenProfile(user._id)}>
        Open {user._id}
      </button>
    </div>
  ),
}))

import Discover from './discover'

describe('Discover page', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockUsers.splice(
      0,
      mockUsers.length,
      { _id: 'u1', full_name: 'Alice Stone' },
      { _id: 'u2', full_name: 'Bob Lane' },
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows skeletons during loading and renders user cards after timeout', async () => {
    vi.useFakeTimers()
    render(<Discover />)

    expect(screen.getAllByTestId('user-card-skeleton')).toHaveLength(6)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getAllByTestId('user-card')).toHaveLength(2)

    const cards = screen.getAllByTestId('user-card')
    expect(within(cards[0]).getByText('not-following')).toBeInTheDocument()
    expect(within(cards[1]).getByText('following')).toBeInTheDocument()
  })

  it('toggles follow state and navigates to profile from card interactions', async () => {
    vi.useFakeTimers()
    render(<Discover />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getAllByTestId('user-card')).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Toggle u1' }))
    expect(screen.getAllByText('following').length).toBeGreaterThanOrEqual(2)

    fireEvent.click(screen.getByRole('button', { name: 'Open u1' }))
    expect(mockNavigate).toHaveBeenCalledWith('/profile/u1')
  })

  it('opens and closes global search modal', async () => {
    vi.useFakeTimers()
    render(<Discover />)

    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByTestId('global-search')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close Search' }))
    expect(screen.queryByTestId('global-search')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
  })
})

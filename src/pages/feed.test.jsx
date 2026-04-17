import { act, fireEvent, render, screen } from '../test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mockNavigate, mockToastSuccess, mockPosts } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockPosts: [],
}))

vi.mock('../assets/assets', () => ({
  assets: { sponsored_img: 'sponsored.png' },
  dummyPostsData: mockPosts,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('react-hot-toast', () => ({
  toast: {
    success: mockToastSuccess,
  },
}))

vi.mock('../compnents/StoriesBar', () => ({
  default: () => <div data-testid='stories-bar'>StoriesBar</div>,
}))

vi.mock('../compnents/RecentMassges', () => ({
  default: () => <div data-testid='recent-messages'>RecentMassges</div>,
}))

vi.mock('../compnents/skeletons/PostCardSkeleton', () => ({
  default: () => <div data-testid='post-card-skeleton'>PostCardSkeleton</div>,
}))

vi.mock('../compnents/postCard', () => ({
  default: ({ post, onDeletePost }) => (
    <div data-testid='post-card'>
      <p>{post.content}</p>
      <button type='button' onClick={() => onDeletePost(post._id)}>
        Delete {post._id}
      </button>
    </div>
  ),
}))

vi.mock('../compnents/EmptyState', () => ({
  default: ({ title, actionLabel, onAction }) => (
    <div data-testid='empty-state'>
      <p>{title}</p>
      {actionLabel && (
        <button type='button' onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  ),
}))

import Feed from './feed'

describe('Feed page', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockToastSuccess.mockReset()
    mockPosts.splice(
      0,
      mockPosts.length,
      { _id: 'p1', content: 'First mocked post' },
      { _id: 'p2', content: 'Second mocked post' },
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows loading skeletons first and then renders fetched posts', async () => {
    vi.useFakeTimers()
    render(<Feed />)

    expect(screen.getAllByTestId('post-card-skeleton')).toHaveLength(3)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1200)
    })

    expect(screen.getAllByTestId('post-card')).toHaveLength(2)
  })

  it('deletes a post through onDeletePost handler interaction and shows a toast', async () => {
    vi.useFakeTimers()
    render(<Feed />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1200)
    })

    expect(screen.getAllByTestId('post-card')).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Delete p1' }))

    expect(screen.getAllByTestId('post-card')).toHaveLength(1)
    expect(screen.queryByText('First mocked post')).not.toBeInTheDocument()
    expect(mockPosts).toHaveLength(1)
    expect(mockToastSuccess).toHaveBeenCalledWith('Post deleted')
  })

  it('shows the empty state and navigates to create post from action button', async () => {
    vi.useFakeTimers()
    mockPosts.splice(0, mockPosts.length)

    render(<Feed />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1200)
    })

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Create Post' }))
    expect(mockNavigate).toHaveBeenCalledWith('/create-post')
  })
})

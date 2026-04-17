import { fireEvent, render, screen } from '../test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}))

const { users, posts } = vi.hoisted(() => {
  const localUsers = [
    {
      _id: 'u1',
      full_name: 'Alice Stone',
      username: 'alice',
      bio: 'Frontend engineer',
      location: 'Cairo',
      followers: ['u2'],
      is_verified: true,
      profile_picture: 'alice.png',
    },
    {
      _id: 'u2',
      full_name: 'Bob Lane',
      username: 'bob',
      bio: 'Backend engineer',
      location: 'Amman',
      followers: [],
      is_verified: false,
      profile_picture: 'bob.png',
    },
  ]

  const localPosts = [
    {
      _id: 'p1',
      content: 'React testing tips #react',
      user: localUsers[0],
      createdAt: '2025-07-01T00:00:00.000Z',
      image_urls: [],
      likes_count: [],
    },
    {
      _id: 'p2',
      content: 'Backend notes #backend',
      user: localUsers[1],
      createdAt: '2025-07-02T00:00:00.000Z',
      image_urls: ['cover.png'],
      likes_count: [],
    },
  ]

  return { users: localUsers, posts: localPosts }
})

vi.mock('../assets/assets', () => ({
  dummyConnectionsData: users,
  dummyPostsData: posts,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('moment', () => ({
  default: () => ({
    fromNow: () => 'just now',
  }),
}))

vi.mock('./PostDetailModal', () => ({
  default: ({ post, onClose }) => (
    <div data-testid='post-detail-modal'>
      <p>Modal: {post._id}</p>
      <button type='button' onClick={onClose}>
        Close Modal
      </button>
    </div>
  ),
}))

import GlobalSearch from './GlobalSearch'

const findUserDisplayName = (name) =>
  screen.findByText((_, element) => {
    if (!element || element.tagName !== 'P') return false
    return (
      element.className.includes('text-sm font-semibold') &&
      element.textContent?.includes(name)
    )
  })

const findPostPreview = (content) =>
  screen.findByText((_, element) => {
    if (!element || element.tagName !== 'P') return false
    return (
      element.className.includes('line-clamp-2') &&
      element.textContent?.includes(content)
    )
  })

describe('GlobalSearch', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('locks body scroll while open and restores it on unmount', () => {
    const { unmount } = render(<GlobalSearch onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes on Escape key and navigates on user click', async () => {
    const onClose = vi.fn()
    render(<GlobalSearch onClose={onClose} />)

    const input = screen.getByPlaceholderText('Search people, posts, hashtags...')
    fireEvent.change(input, { target: { value: 'alice' } })

    fireEvent.click(await findUserDisplayName('Alice Stone'))
    expect(mockNavigate).toHaveBeenCalledWith('/profile/u1')
    expect(onClose).toHaveBeenCalled()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('uses onPostClick callback when provided instead of opening post modal', async () => {
    const onPostClick = vi.fn()
    render(<GlobalSearch onClose={() => {}} onPostClick={onPostClick} />)

    const input = screen.getByPlaceholderText('Search people, posts, hashtags...')
    fireEvent.change(input, { target: { value: 'react' } })

    fireEvent.click(await findPostPreview('React testing tips #react'))

    expect(onPostClick).toHaveBeenCalledWith(expect.objectContaining({ _id: 'p1' }))
    expect(screen.queryByTestId('post-detail-modal')).not.toBeInTheDocument()
  })

  it('opens post detail modal when onPostClick is not provided and supports closing it', async () => {
    render(<GlobalSearch onClose={() => {}} />)

    const input = screen.getByPlaceholderText('Search people, posts, hashtags...')
    fireEvent.change(input, { target: { value: 'react' } })

    fireEvent.click(await findPostPreview('React testing tips #react'))
    expect(screen.getByTestId('post-detail-modal')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close Modal' }))
    expect(screen.queryByTestId('post-detail-modal')).not.toBeInTheDocument()
  })

  it('fills input from trending hashtag click before typing', () => {
    render(<GlobalSearch onClose={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '#react' }))
    expect(screen.getByPlaceholderText('Search people, posts, hashtags...')).toHaveValue('#react')
  })
})

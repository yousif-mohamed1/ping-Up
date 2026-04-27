import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, userEvent, within } from '../test/test-utils'
import { toast } from 'react-hot-toast'
import PostCard from './postCard'
import { dummyPostsData, dummyUserData } from '../assets/assets'

const mockNavigate = vi.fn()

vi.mock('./PostDetailModal', () => ({
  default: ({ onClose }) => (
    <div data-testid='post-detail-modal'>
      <button type='button' onClick={onClose}>Close detail modal</button>
    </div>
  ),
}))

vi.mock('react-hot-toast', () => ({
  toast: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const buildPost = (overrides = {}) => {
  const { user = dummyUserData, ...rest } = overrides
  return {
    ...dummyPostsData[0],
    likes_count: [],
    ...rest,
    user,
  }
}

describe('postCard', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    vi.mocked(toast).mockReset()
    vi.restoreAllMocks()
  })

  it('toggles like count when heart icon is clicked', async () => {
    const { container } = render(<PostCard post={buildPost()} onDeletePost={vi.fn()} />)
    const likeIcon = container.querySelector('svg.hover\\:text-red-400')

    expect(likeIcon).toBeTruthy()

    const likeContainer = likeIcon.closest('div')
    expect(within(likeContainer).getByText('0')).toBeInTheDocument()

    await userEvent.click(likeIcon)
    expect(within(likeContainer).getByText('1')).toBeInTheDocument()

    await userEvent.click(likeIcon)
    expect(within(likeContainer).getByText('0')).toBeInTheDocument()
  })

  it('navigates to edit flow from post options menu', async () => {
    render(<PostCard post={buildPost()} onDeletePost={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: /post options/i }))
    await userEvent.click(screen.getByRole('button', { name: /edit post/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/create-post', {
      state: { postId: buildPost()._id },
    })
  })

  it('calls delete callback when deletion is confirmed', async () => {
    const onDeletePost = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<PostCard post={buildPost()} onDeletePost={onDeletePost} />)

    await userEvent.click(screen.getByRole('button', { name: /post options/i }))
    await userEvent.click(screen.getByRole('button', { name: /delete post/i }))

    expect(onDeletePost).toHaveBeenCalledWith(buildPost()._id)
  })

  it('does not call delete callback when deletion is canceled', async () => {
    const onDeletePost = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<PostCard post={buildPost()} onDeletePost={onDeletePost} />)

    await userEvent.click(screen.getByRole('button', { name: /post options/i }))
    await userEvent.click(screen.getByRole('button', { name: /delete post/i }))

    expect(onDeletePost).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: /delete post/i })).not.toBeInTheDocument()
  })

  it('shows visibility toast from options menu', async () => {
    render(<PostCard post={buildPost()} onDeletePost={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: /post options/i }))
    await userEvent.click(screen.getByRole('button', { name: /check visibility/i }))

    expect(toast).toHaveBeenCalledWith('Visibility settings will be added later.')
  })

  it('renders hashtags as styled tokens in post content', () => {
    render(
      <PostCard
        post={buildPost({ content: 'Testing #alpha and #beta tags.' })}
        onDeletePost={vi.fn()}
      />,
    )

    const alphaTag = screen.getByText('#alpha')
    const betaTag = screen.getByText('#beta')

    expect(alphaTag.tagName).toBe('SPAN')
    expect(betaTag.tagName).toBe('SPAN')
    expect(alphaTag).toHaveClass('text-indigo-600')
    expect(betaTag).toHaveClass('text-indigo-600')
  })

  it('opens and closes post detail modal when post body is clicked', async () => {
    render(<PostCard post={buildPost()} onDeletePost={vi.fn()} />)

    await userEvent.click(screen.getByText(/we're a small/i))
    expect(screen.getByTestId('post-detail-modal')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /close detail modal/i }))
    expect(screen.queryByTestId('post-detail-modal')).not.toBeInTheDocument()
  })
})

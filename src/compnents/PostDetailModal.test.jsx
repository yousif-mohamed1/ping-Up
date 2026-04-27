import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, userEvent } from '../test/test-utils'
import PostDetailModal from './PostDetailModal'
import { dummyPostsData } from '../assets/assets'

const buildPost = (overrides = {}) => ({
  ...dummyPostsData[0],
  ...overrides,
})

describe('PostDetailModal', () => {
  it('calls like handler from like action', async () => {
    const onToggleLike = vi.fn()

    render(
      <PostDetailModal
        post={buildPost()}
        likes={['user_2zdFoZib5lNr614LgkONdD8WG32']}
        onToggleLike={onToggleLike}
        onClose={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /1 like/i }))

    expect(onToggleLike).toHaveBeenCalledTimes(1)
  })

  it('adds a trimmed comment from send button and clears the input', async () => {
    render(
      <PostDetailModal
        post={buildPost()}
        likes={[]}
        onToggleLike={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const initialCount = Number(screen.getByText(/^\d+ comments?$/i).textContent.split(' ')[0])
    const input = screen.getByPlaceholderText('Write a comment...')
    await userEvent.type(input, '   Nice update!   ')

    const sendButton = input.parentElement.querySelector('button')
    await userEvent.click(sendButton)

    expect(screen.getByText(`${initialCount + 1} comments`)).toBeInTheDocument()
    expect(input).toHaveValue('')
    expect(screen.getByText('Nice update!')).toBeInTheDocument()
  })

  it('submits comment on Enter key without shift', async () => {
    render(
      <PostDetailModal
        post={buildPost()}
        likes={[]}
        onToggleLike={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const initialCount = Number(screen.getByText(/^\d+ comments?$/i).textContent.split(' ')[0])
    const input = screen.getByPlaceholderText('Write a comment...')
    await userEvent.type(input, 'Keyboard submit')

    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
    expect(screen.getByText(`${initialCount} comments`)).toBeInTheDocument()

    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false })

    expect(screen.getByText(`${initialCount + 1} comments`)).toBeInTheDocument()
    expect(input).toHaveValue('')
    expect(screen.getByText('Keyboard submit')).toBeInTheDocument()
  })

  it('renders hashtags as styled tokens in post content and comments', async () => {
    render(
      <PostDetailModal
        post={buildPost({ content: 'Discussing #frontend and #testing now.' })}
        likes={[]}
        onToggleLike={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const postTagOne = screen.getByText('#frontend')
    const postTagTwo = screen.getByText('#testing')

    expect(postTagOne.tagName).toBe('SPAN')
    expect(postTagTwo.tagName).toBe('SPAN')
    expect(postTagOne).toHaveClass('text-indigo-500')
    expect(postTagTwo).toHaveClass('text-indigo-500')

    const input = screen.getByPlaceholderText('Write a comment...')
    await userEvent.type(input, 'Loved this #feature{enter}')

    const commentTag = screen.getByText('#feature')
    expect(commentTag.tagName).toBe('SPAN')
    expect(commentTag).toHaveClass('text-indigo-500')
  })

  it('locks body scroll while mounted and restores it on unmount', () => {
    const { unmount } = render(
      <PostDetailModal
        post={buildPost()}
        likes={[]}
        onToggleLike={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(
      <PostDetailModal
        post={buildPost()}
        likes={[]}
        onToggleLike={vi.fn()}
        onClose={onClose}
      />,
    )

    await userEvent.click(container.firstChild)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

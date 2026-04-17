import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, userEvent, waitFor } from '../test/test-utils'
import { toast } from 'react-hot-toast'
import CreatePost from './create_post'
import { dummyPostsData } from '../assets/assets'

const mockNavigate = vi.fn()
let mockLocationState = null

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    promise: vi.fn((promise, handlers) => {
      return Promise.resolve(promise)
        .then((value) => {
          handlers?.success?.(value)
          return value
        })
        .catch((error) => {
          handlers?.error?.(error)
          return undefined
        })
    }),
  },
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState }),
  }
})

const originalPostsSnapshot = JSON.parse(JSON.stringify(dummyPostsData))

const resetPosts = () => {
  dummyPostsData.splice(0, dummyPostsData.length, ...JSON.parse(JSON.stringify(originalPostsSnapshot)))
}

describe('CreatePost page', () => {
  beforeEach(() => {
    resetPosts()
    mockNavigate.mockReset()
    mockLocationState = null
  })

  it('redirects and shows an error when editing a missing post id', async () => {
    mockLocationState = { postId: 'missing-post-id' }

    render(<CreatePost />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Post not found')
    })
    expect(mockNavigate).toHaveBeenCalledWith('/feed')
  })

  it('does not create a post when both caption and media are empty', async () => {
    const initialLength = dummyPostsData.length

    render(<CreatePost />)
    await userEvent.click(screen.getByRole('button', { name: /create post/i }))

    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled()
    })
    expect(dummyPostsData).toHaveLength(initialLength)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('creates a new post and navigates to feed', async () => {
    const text = "  Shipping update from the team  "

    render(<CreatePost />)
    await userEvent.type(screen.getByPlaceholderText("What's happening?"), text)
    await userEvent.click(screen.getByRole('button', { name: /create post/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/feed')
    }, { timeout: 2500 })
    expect(dummyPostsData[0].content).toBe('Shipping update from the team')
  })

  it('ignores media upload when no file is selected', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL')

    render(<CreatePost />)

    const imageInput = document.querySelector("input[accept='image/*']")
    expect(imageInput).toBeTruthy()

    fireEvent.change(imageInput, { target: { files: [] } })

    expect(createObjectURLSpy).not.toHaveBeenCalled()
    expect(screen.queryByAltText('Selected media')).not.toBeInTheDocument()

    createObjectURLSpy.mockRestore()
  })

  it('uploads image media and shows image preview', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:image-preview')

    render(<CreatePost />)

    const imageInput = document.querySelector("input[accept='image/*']")
    const imageFile = new File(['image-bytes'], 'post-image.png', { type: 'image/png' })

    expect(imageInput).toBeTruthy()
    fireEvent.change(imageInput, { target: { files: [imageFile] } })

    expect(createObjectURLSpy).toHaveBeenCalledWith(imageFile)
    expect(screen.getByAltText('Selected media')).toBeInTheDocument()

    createObjectURLSpy.mockRestore()
  })

  it('uploads video media and shows video preview', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:video-preview')

    const { container } = render(<CreatePost />)

    const videoInput = document.querySelector("input[accept='video/*']")
    const videoFile = new File(['video-bytes'], 'post-video.mp4', { type: 'video/mp4' })

    expect(videoInput).toBeTruthy()
    fireEvent.change(videoInput, { target: { files: [videoFile] } })

    expect(createObjectURLSpy).toHaveBeenCalledWith(videoFile)
    expect(container.querySelector('video[src="blob:video-preview"]')).toBeInTheDocument()
    expect(screen.queryByAltText('Selected media')).not.toBeInTheDocument()

    createObjectURLSpy.mockRestore()
  })

  it('revokes previous blob URL when replacing uploaded media', () => {
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValueOnce('blob:first-preview')
      .mockReturnValueOnce('blob:second-preview')
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL')

    const { container } = render(<CreatePost />)

    const imageInput = document.querySelector("input[accept='image/*']")
    const firstImage = new File(['first-image'], 'first.png', { type: 'image/png' })
    const secondImage = new File(['second-image'], 'second.png', { type: 'image/png' })

    expect(imageInput).toBeTruthy()
    fireEvent.change(imageInput, { target: { files: [firstImage] } })
    fireEvent.change(imageInput, { target: { files: [secondImage] } })

    expect(createObjectURLSpy).toHaveBeenNthCalledWith(1, firstImage)
    expect(createObjectURLSpy).toHaveBeenNthCalledWith(2, secondImage)
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:first-preview')
    expect(container.querySelector('img[src="blob:second-preview"]')).toBeInTheDocument()

    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
  })

  it('loads edit mode from route state and updates the existing post', async () => {
    const existingPost = dummyPostsData[0]
    mockLocationState = { postId: existingPost._id }

    render(<CreatePost />)

    expect(screen.getByRole('heading', { name: /edit post/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update post/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText("What's happening?")).toHaveValue(existingPost.content)

    await userEvent.clear(screen.getByPlaceholderText("What's happening?"))
    await userEvent.type(screen.getByPlaceholderText("What's happening?"), 'Updated content from edit flow')
    await userEvent.click(screen.getByRole('button', { name: /update post/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/feed')
    }, { timeout: 2500 })
    expect(dummyPostsData.find((item) => item._id === existingPost._id)?.content).toBe('Updated content from edit flow')
  })
})

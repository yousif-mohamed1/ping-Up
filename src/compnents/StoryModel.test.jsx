import { act, fireEvent, render, screen } from '../test/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mockToastPromise } = vi.hoisted(() => ({
  mockToastPromise: vi.fn((promise) => promise),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    promise: mockToastPromise,
  },
}))

import StoryModel from './StoryModel'

const originalCreateObjectURL = URL.createObjectURL

describe('StoryModel', () => {
  beforeEach(() => {
    mockToastPromise.mockClear()
    URL.createObjectURL = vi.fn((file) => `blob:${file.name}`)
  })

  afterEach(() => {
    vi.useRealTimers()
    URL.createObjectURL = originalCreateObjectURL
  })

  it('closes when back button is clicked', () => {
    const setshowModel = vi.fn()
    render(<StoryModel setshowModel={setshowModel} />)

    fireEvent.click(screen.getAllByRole('button')[0])
    expect(setshowModel).toHaveBeenCalledWith(false)
  })

  it('rejects creating a text story when text is empty', async () => {
    const setshowModel = vi.fn()
    render(<StoryModel setshowModel={setshowModel} />)

    fireEvent.click(screen.getByRole('button', { name: /create story/i }))

    expect(mockToastPromise).toHaveBeenCalledTimes(1)
    const createPromise = mockToastPromise.mock.calls[0][0]
    await expect(createPromise).rejects.toThrow('Please write something for your story.')
    expect(setshowModel).not.toHaveBeenCalledWith(false)
  })

  it('creates text story successfully and closes modal', async () => {
    vi.useFakeTimers()
    const setshowModel = vi.fn()
    render(<StoryModel setshowModel={setshowModel} />)

    fireEvent.change(screen.getByPlaceholderText('what is in your mind...'), {
      target: { value: 'A new text story' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create story/i }))

    const createPromise = mockToastPromise.mock.calls[0][0]
    act(() => {
      vi.advanceTimersByTime(600)
    })

    await expect(createPromise).resolves.toBeUndefined()
    expect(setshowModel).toHaveBeenCalledWith(false)
  })

  it('uploads media, previews it, and creates media story successfully', async () => {
    vi.useFakeTimers()
    const setshowModel = vi.fn()
    const { container } = render(<StoryModel setshowModel={setshowModel} />)

    const file = new File(['image-content'], 'photo.png', { type: 'image/png' })
    const fileInput = container.querySelector('input[type="file"]')
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    expect(container.querySelector('img[alt="Preview"]')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /create story/i }))
    const createPromise = mockToastPromise.mock.calls[0][0]

    act(() => {
      vi.advanceTimersByTime(600)
    })

    await expect(createPromise).resolves.toBeUndefined()
    expect(setshowModel).toHaveBeenCalledWith(false)
  })

  it('keeps media empty when upload event has no selected file', () => {
    const setshowModel = vi.fn()
    const { container } = render(<StoryModel setshowModel={setshowModel} />)

    const fileInput = container.querySelector('input[type="file"]')
    fireEvent.change(fileInput, { target: { files: [] } })

    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(container.querySelector('img[alt="Preview"]')).not.toBeInTheDocument()
    expect(container.querySelector('video')).not.toBeInTheDocument()
  })

  it('renders video preview when a video file is selected', () => {
    const setshowModel = vi.fn()
    const { container } = render(<StoryModel setshowModel={setshowModel} />)

    const videoFile = new File(['video-content'], 'clip.mp4', { type: 'video/mp4' })
    const fileInput = container.querySelector('input[type="file"]')
    fireEvent.change(fileInput, { target: { files: [videoFile] } })

    expect(URL.createObjectURL).toHaveBeenCalledWith(videoFile)
    expect(container.querySelector('video')).toBeInTheDocument()
    expect(container.querySelector('img[alt="Preview"]')).not.toBeInTheDocument()
  })

  it('rejects creating media story when media mode is selected without a file', async () => {
    const setshowModel = vi.fn()
    const { container } = render(<StoryModel setshowModel={setshowModel} />)

    const fileInput = container.querySelector('input[type="file"]')
    fireEvent.change(fileInput, { target: { files: [] } })
    fireEvent.click(screen.getByRole('button', { name: /create story/i }))

    expect(mockToastPromise).toHaveBeenCalledTimes(1)
    const createPromise = mockToastPromise.mock.calls[0][0]
    await expect(createPromise).rejects.toThrow('Please upload a photo or video.')
    expect(setshowModel).not.toHaveBeenCalledWith(false)
  })
})

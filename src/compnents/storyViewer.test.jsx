import { act, fireEvent, render, screen } from '../test/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import StoryViewer from './storyViewer'

const baseUser = {
  full_name: 'Alice Stone',
  profile_picture: 'alice.png',
}

describe('StoryViewer', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null when there is no story to view', () => {
    const { container } = render(<StoryViewer viewStory={null} setViewStory={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it('auto closes text stories after timed progress completes', () => {
    vi.useFakeTimers()
    const setViewStory = vi.fn()

    const { container } = render(
      <StoryViewer
        viewStory={{
          _id: 's1',
          media_type: 'text',
          content: 'This is a text story',
          background_color: '#123456',
          user: baseUser,
        }}
        setViewStory={setViewStory}
      />,
    )

    expect(screen.getByText('This is a text story')).toBeInTheDocument()
    expect(container.querySelector('.h-1.bg-gray-700')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(setViewStory).toHaveBeenCalledWith(null)
  })

  it('closes immediately when close button is clicked', () => {
    const setViewStory = vi.fn()

    render(
      <StoryViewer
        viewStory={{
          _id: 's2',
          media_type: 'text',
          content: 'Close me',
          user: baseUser,
        }}
        setViewStory={setViewStory}
      />,
    )

    fireEvent.click(screen.getByRole('button'))
    expect(setViewStory).toHaveBeenCalledWith(null)
  })

  it('renders image stories in the content area', () => {
    const setViewStory = vi.fn()

    render(
      <StoryViewer
        viewStory={{
          _id: 's-image',
          media_type: 'image',
          media_url: 'story-image.png',
          user: baseUser,
        }}
        setViewStory={setViewStory}
      />,
    )

    const image = screen.getByAltText('Story Media')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'story-image.png')
  })

  it('renders no content for unsupported story media types', () => {
    const setViewStory = vi.fn()
    const { container } = render(
      <StoryViewer
        viewStory={{
          _id: 's-unknown',
          media_type: 'audio',
          media_url: 'clip.mp3',
          user: baseUser,
        }}
        setViewStory={setViewStory}
      />,
    )

    expect(container.querySelector('img[alt="Story Media"]')).not.toBeInTheDocument()
    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(screen.queryByText('clip.mp3')).not.toBeInTheDocument()
  })

  it('ignores video time updates when duration is invalid', () => {
    const setViewStory = vi.fn()
    const { container } = render(
      <StoryViewer
        viewStory={{
          _id: 's-video-invalid',
          media_type: 'video',
          media_url: 'invalid.mp4',
          user: baseUser,
        }}
        setViewStory={setViewStory}
      />,
    )

    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()

    Object.defineProperty(video, 'duration', { value: Number.NaN, configurable: true })
    Object.defineProperty(video, 'currentTime', { value: 2, configurable: true })

    fireEvent.loadedMetadata(video)
    fireEvent.timeUpdate(video)

    expect(setViewStory).not.toHaveBeenCalled()
  })

  it('handles valid video time updates and closes on ended event', () => {
    const setViewStory = vi.fn()
    const { container } = render(
      <StoryViewer
        viewStory={{
          _id: 's3',
          media_type: 'video',
          media_url: 'story.mp4',
          user: baseUser,
        }}
        setViewStory={setViewStory}
      />,
    )

    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(container.querySelector('.h-1.bg-gray-700')).not.toBeInTheDocument()

    Object.defineProperty(video, 'duration', { value: 10, configurable: true })
    Object.defineProperty(video, 'currentTime', { value: 4, configurable: true })

    fireEvent.loadedMetadata(video)
    fireEvent.timeUpdate(video)

    expect(setViewStory).not.toHaveBeenCalled()

    fireEvent.ended(video)

    expect(setViewStory).toHaveBeenCalledWith(null)
  })
})

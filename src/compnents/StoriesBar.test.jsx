import { fireEvent, render, screen } from '../test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { stories } = vi.hoisted(() => ({
  stories: [
    {
      _id: 's1',
      media_type: 'text',
      content: 'Morning story',
      createdAt: '2025-07-01T00:00:00.000Z',
      user: {
        full_name: 'Alice Stone',
        profile_picture: 'alice.png',
      },
    },
    {
      _id: 's2',
      media_type: 'image',
      media_url: 'story.png',
      content: '',
      createdAt: '2025-07-01T00:00:00.000Z',
      user: {
        full_name: 'Bob Lane',
        profile_picture: 'bob.png',
      },
    },
  ],
}))

vi.mock('../assets/assets', () => ({
  dummyStoriesData: stories,
}))

vi.mock('moment', () => ({
  default: () => ({
    fromNow: () => 'just now',
  }),
}))

vi.mock('./StoryModel', () => ({
  default: ({ setshowModel }) => (
    <div data-testid='story-model'>
      <button type='button' onClick={() => setshowModel(false)}>
        Close Story Model
      </button>
    </div>
  ),
}))

vi.mock('./storyViewer', () => ({
  default: ({ viewStory, setViewStory }) => (
    <div data-testid='story-viewer'>
      <p>{viewStory._id}</p>
      <button type='button' onClick={() => setViewStory(null)}>
        Close Story Viewer
      </button>
    </div>
  ),
}))

import StoriesBar from './StoriesBar'

describe('StoriesBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders create story card and fetched stories', () => {
    render(<StoriesBar />)

    expect(screen.getByText('Create Story')).toBeInTheDocument()
    expect(screen.getByText('Morning story')).toBeInTheDocument()
    expect(screen.getAllByText('just now')).toHaveLength(2)
  })

  it('opens and closes story creation modal', () => {
    render(<StoriesBar />)

    fireEvent.click(screen.getByText('Create Story'))
    expect(screen.getByTestId('story-model')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close Story Model' }))
    expect(screen.queryByTestId('story-model')).not.toBeInTheDocument()
  })

  it('opens story viewer and closes it through setViewStory interaction', () => {
    render(<StoriesBar />)

    fireEvent.click(screen.getByText('Morning story'))
    expect(screen.getByTestId('story-viewer')).toBeInTheDocument()
    expect(screen.getByText('s1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close Story Viewer' }))
    expect(screen.queryByTestId('story-viewer')).not.toBeInTheDocument()
  })
})

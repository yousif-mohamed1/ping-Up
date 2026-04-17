import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, userEvent } from '../test/test-utils'
import MediaViewerModal from './MediaViewerModal'

describe('MediaViewerModal', () => {
  it('returns null when there is no open media', () => {
    const { container } = render(<MediaViewerModal openMedia={null} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders image preview and closes from close button', async () => {
    const onClose = vi.fn()

    render(
      <MediaViewerModal
        openMedia={{
          type: 'image',
          url: 'photo.png',
        }}
        onClose={onClose}
      />,
    )

    expect(screen.getByAltText('Opened media')).toHaveAttribute('src', 'photo.png')

    await userEvent.click(screen.getByRole('button', { name: 'Close media preview' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders video preview when media type is video', () => {
    const { container } = render(
      <MediaViewerModal
        openMedia={{
          type: 'video',
          url: 'clip.mp4',
        }}
        onClose={vi.fn()}
      />,
    )

    expect(container.querySelector('video[src="clip.mp4"]')).toBeInTheDocument()
  })
})
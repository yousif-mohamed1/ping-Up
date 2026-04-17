import React, { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, userEvent } from '../test/test-utils'
import ChatBoxCameraModal from './ChatBoxCameraModal'

describe('ChatBoxCameraModal', () => {
  it('returns null when closed', () => {
    const { container } = render(
      <ChatBoxCameraModal
        isCamOpen={false}
        handleCloseCamera={vi.fn()}
        videoRef={createRef()}
        canvasRef={createRef()}
        handleCapturePhoto={vi.fn()}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders camera UI and handles close/capture actions', async () => {
    const handleCloseCamera = vi.fn()
    const handleCapturePhoto = vi.fn()

    render(
      <ChatBoxCameraModal
        isCamOpen
        handleCloseCamera={handleCloseCamera}
        videoRef={createRef()}
        canvasRef={createRef()}
        handleCapturePhoto={handleCapturePhoto}
      />,
    )

    expect(screen.getByText('Camera')).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    await userEvent.click(screen.getByRole('button', { name: 'Capture' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(handleCloseCamera).toHaveBeenCalledTimes(2)
    expect(handleCapturePhoto).toHaveBeenCalledTimes(1)
  })
})
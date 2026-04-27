import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, userEvent, waitFor } from '../test/test-utils'
import ChatBox from './chat_box'

const { mockNavigate, mockUseParams } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseParams: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  }
})

const createMockStream = () => {
  const stop = vi.fn()
  return {
    getTracks: () => [{ stop }],
    stop,
  }
}

describe('chat_box page', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockUseParams.mockReset()
    mockUseParams.mockReturnValue({ userId: 'user_2' })

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue(createMockStream()),
      },
    })

    Object.defineProperty(window, 'alert', {
      configurable: true,
      value: vi.fn(),
    })
  })

  it('shows not found state when route user is missing', () => {
    mockUseParams.mockReturnValue({ userId: 'missing_user' })
    render(<ChatBox />)

    expect(screen.getByText('User not found.')).toBeInTheDocument()
  })

  it('sends a text message with enter key and clears input', async () => {
    render(<ChatBox />)

    const input = screen.getByPlaceholderText('Type a message...')
    await userEvent.type(input, 'Hello from test{enter}')

    expect(screen.getByText('Hello from test')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('does not send a message for shift+enter keydown', async () => {
    render(<ChatBox />)

    const input = screen.getByPlaceholderText('Type a message...')
    await userEvent.type(input, 'Draft message')
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })

    expect(screen.queryByText('Draft message')).not.toBeInTheDocument()
    expect(input).toHaveValue('Draft message')
  })

  it('does not send whitespace-only message on enter without media', async () => {
    render(<ChatBox />)

    const input = screen.getByPlaceholderText('Type a message...')
    await userEvent.type(input, '   ')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.queryByAltText('message')).not.toBeInTheDocument()
    expect(input).toHaveValue('   ')
  })

  it('handles image file selection and remove-media action', async () => {
    render(<ChatBox />)

    const imageInput = document.querySelector("input[accept='image/*']")
    const imageFile = new File(['image-bytes'], 'photo.png', { type: 'image/png' })

    expect(imageInput).toBeTruthy()
    await userEvent.upload(imageInput, imageFile)

    await waitFor(() => {
      expect(screen.getByText('Photo ready to send')).toBeInTheDocument()
    })

    const previewContainer = screen.getByText('Photo ready to send').closest('div')
    const removeButton = previewContainer.querySelector('button')
    expect(removeButton).toBeTruthy()

    await userEvent.click(removeButton)
    expect(screen.queryByText('Photo ready to send')).not.toBeInTheDocument()
  })

  it('ignores file selection when no file is chosen', () => {
    render(<ChatBox />)

    const imageInput = document.querySelector("input[accept='image/*']")
    expect(imageInput).toBeTruthy()

    fireEvent.change(imageInput, { target: { files: [] } })

    expect(screen.queryByText(/ready to send/i)).not.toBeInTheDocument()
  })

  it('handles video file selection and sends media-only message', async () => {
    render(<ChatBox />)

    const videoInput = document.querySelector("input[accept='video/*']")
    const videoFile = new File(['video-bytes'], 'clip.mp4', { type: 'video/mp4' })

    expect(videoInput).toBeTruthy()
    await userEvent.upload(videoInput, videoFile)

    await waitFor(() => {
      expect(screen.getByText('Video ready to send')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Type a message...')
    const composer = input.closest('div')
    const sendButton = composer.querySelector("button[type='button']")
    expect(sendButton).toBeTruthy()

    await userEvent.click(sendButton)

    expect(document.querySelectorAll("video[src^='data:video/mp4']").length).toBe(1)
    expect(screen.queryByText('Video ready to send')).not.toBeInTheDocument()
  })

  it('opens camera and captures a photo into media preview', async () => {
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({ drawImage: vi.fn() })
    const toDataURLSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/jpeg;base64,mocked-photo')

    render(<ChatBox />)

    await userEvent.click(screen.getByTitle('Open camera'))

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'user' },
      audio: false,
    })
    expect(screen.getByText('Camera')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Capture' }))

    expect(toDataURLSpy).toHaveBeenCalledWith('image/jpeg')
    expect(screen.getByText('Photo ready to send')).toBeInTheDocument()
    expect(screen.queryByText('Camera')).not.toBeInTheDocument()

    getContextSpy.mockRestore()
    toDataURLSpy.mockRestore()
  })

  it('closes camera with cancel action and stops active stream tracks', async () => {
    const stream = createMockStream()
    navigator.mediaDevices.getUserMedia.mockResolvedValueOnce(stream)

    render(<ChatBox />)

    await userEvent.click(screen.getByTitle('Open camera'))
    expect(screen.getByText('Camera')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(stream.stop).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Camera')).not.toBeInTheDocument()
  })

  it('handles denied camera access and closes camera modal state', async () => {
    navigator.mediaDevices.getUserMedia.mockRejectedValueOnce(new Error('Denied'))
    render(<ChatBox />)

    await userEvent.click(screen.getByTitle('Open camera'))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Camera access denied')
    })
    expect(screen.queryByText('Camera')).not.toBeInTheDocument()
  })
})
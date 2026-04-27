import React, { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, userEvent } from '../test/test-utils'
import ChatBoxInputBar from './ChatBoxInputBar'

const baseProps = () => ({
  mediaPreview: null,
  mediaType: null,
  handleRemoveMedia: vi.fn(),
  handleFileSelect: vi.fn(),
  handleOpenCamera: vi.fn(),
  inputRef: createRef(),
  input: '',
  setInput: vi.fn(),
  handleKeyDown: vi.fn(),
  handleSend: vi.fn(),
})

describe('ChatBoxInputBar', () => {
  it('disables send button when input is empty and no media is attached', () => {
    const props = baseProps()
    const { container } = render(<ChatBoxInputBar {...props} />)
    const buttons = container.querySelectorAll('button')
    const sendButton = buttons[buttons.length - 1]

    expect(sendButton).toBeDisabled()
  })

  it('handles input change, Enter keydown and send click', async () => {
    const props = baseProps()
    props.input = 'Draft message'
    const { container } = render(<ChatBoxInputBar {...props} />)
    const input = screen.getByPlaceholderText('Type a message...')
    const buttons = container.querySelectorAll('button')
    const sendButton = buttons[buttons.length - 1]

    fireEvent.change(input, { target: { value: 'Updated draft' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await userEvent.click(sendButton)

    expect(props.setInput).toHaveBeenCalledWith('Updated draft')
    expect(props.handleKeyDown).toHaveBeenCalledTimes(1)
    expect(props.handleSend).toHaveBeenCalledTimes(1)
  })

  it('calls file select handler from image/video upload controls', async () => {
    const props = baseProps()
    const { container } = render(<ChatBoxInputBar {...props} />)
    const imageInput = container.querySelector("input[type='file'][accept='image/*']")
    const videoInput = container.querySelector("input[type='file'][accept='video/*']")

    const imageFile = new File(['image-bytes'], 'photo.png', { type: 'image/png' })
    const videoFile = new File(['video-bytes'], 'clip.mp4', { type: 'video/mp4' })

    await userEvent.upload(imageInput, imageFile)
    await userEvent.upload(videoInput, videoFile)

    expect(props.handleFileSelect).toHaveBeenCalledTimes(2)
  })

  it('renders media preview and supports remove/camera/send interactions', async () => {
    const props = baseProps()
    props.mediaPreview = 'data:image/png;base64,mocked'
    props.mediaType = 'image'

    const { container } = render(<ChatBoxInputBar {...props} />)
    const buttons = container.querySelectorAll('button')
    const removeButton = buttons[0]
    const cameraButton = buttons[1]
    const sendButton = buttons[2]

    expect(screen.getByText('Photo ready to send')).toBeInTheDocument()
    expect(sendButton).not.toBeDisabled()

    await userEvent.click(removeButton)
    await userEvent.click(cameraButton)
    await userEvent.click(sendButton)

    expect(props.handleRemoveMedia).toHaveBeenCalledTimes(1)
    expect(props.handleOpenCamera).toHaveBeenCalledTimes(1)
    expect(props.handleSend).toHaveBeenCalledTimes(1)
  })
})
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, userEvent } from '../test/test-utils'
import ChatComposer from './ChatComposer'

describe('ChatComposer', () => {
  it('calls onInputChange when input value changes', () => {
    const onInputChange = vi.fn()

    render(
      <ChatComposer inputValue='' onInputChange={onInputChange} onSendMessage={vi.fn()} />,
    )

    fireEvent.change(screen.getByPlaceholderText('Type a message...'), {
      target: { value: 'Hello world' },
    })

    expect(onInputChange).toHaveBeenCalledWith('Hello world')
  })

  it('calls onSendMessage on enter key', () => {
    const onSendMessage = vi.fn()
    render(
      <ChatComposer inputValue='Message' onInputChange={vi.fn()} onSendMessage={onSendMessage} />,
    )

    fireEvent.keyDown(screen.getByPlaceholderText('Type a message...'), {
      key: 'Enter',
    })

    expect(onSendMessage).toHaveBeenCalledTimes(1)
  })

  it('calls onSendMessage on send button click', async () => {
    const onSendMessage = vi.fn()
    render(
      <ChatComposer inputValue='Message' onInputChange={vi.fn()} onSendMessage={onSendMessage} />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Send message' }))
    expect(onSendMessage).toHaveBeenCalledTimes(1)
  })
})
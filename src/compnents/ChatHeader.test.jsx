import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../test/test-utils'
import ChatHeader from './ChatHeader'

describe('ChatHeader', () => {
  it('renders active user details', () => {
    render(
      <ChatHeader
        activeUser={{
          full_name: 'Alice Doe',
          username: 'alice_doe',
          profile_picture: 'alice.png',
        }}
      />,
    )

    expect(screen.getByText('Alice Doe')).toBeInTheDocument()
    expect(screen.getByText('@alice_doe')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Alice Doe' })).toHaveAttribute('src', 'alice.png')
  })
})
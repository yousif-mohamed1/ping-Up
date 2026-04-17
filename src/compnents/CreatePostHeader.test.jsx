import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../test/test-utils'
import CreatePostHeader from './CreatePostHeader'

describe('CreatePostHeader', () => {
  it('renders create mode content', () => {
    render(<CreatePostHeader isEditing={false} />)

    expect(screen.getByRole('heading', { name: /create post/i })).toBeInTheDocument()
    expect(screen.getByText(/share your thoughts with the world/i)).toBeInTheDocument()
  })

  it('renders edit mode content', () => {
    render(<CreatePostHeader isEditing />)

    expect(screen.getByRole('heading', { name: /edit post/i })).toBeInTheDocument()
    expect(screen.getByText(/update your post before sharing it again/i)).toBeInTheDocument()
  })
})

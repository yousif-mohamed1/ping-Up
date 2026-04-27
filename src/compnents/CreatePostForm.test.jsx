import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, userEvent, within } from '../test/test-utils'
import CreatePostForm from './CreatePostForm'
import { dummyUserData } from '../assets/assets'

const buildProps = (overrides = {}) => {
  return {
    user: dummyUserData,
    content: '',
    onContentChange: vi.fn(),
    previewUrl: '',
    previewType: '',
    onMediaUpload: vi.fn(),
    onSubmit: vi.fn(),
    isEditing: false,
    ...overrides,
  }
}

const renderControlledForm = (initialContent = '') => {
  const onContentChange = vi.fn()
  const onMediaUpload = vi.fn()
  const onSubmit = vi.fn()

  const Wrapper = () => {
    const [content, setContent] = React.useState(initialContent)

    return (
      <CreatePostForm
        user={dummyUserData}
        content={content}
        onContentChange={(next) => {
          onContentChange(next)
          setContent(next)
        }}
        previewUrl=''
        previewType=''
        onMediaUpload={onMediaUpload}
        onSubmit={onSubmit}
        isEditing={false}
      />
    )
  }

  render(<Wrapper />)
  return { onContentChange, onMediaUpload, onSubmit }
}

describe('CreatePostForm', () => {
  it('closes the audience menu when clicking outside', async () => {
    const props = buildProps()
    render(<CreatePostForm {...props} />)

    await userEvent.click(screen.getByRole('button', { name: /public/i }))
    expect(screen.getByRole('button', { name: 'Only me' })).toBeInTheDocument()

    fireEvent.mouseDown(document.body)

    expect(screen.queryByRole('button', { name: 'Only me' })).not.toBeInTheDocument()
  })

  it('closes the emoji picker when clicking outside', async () => {
    const props = buildProps()
    render(<CreatePostForm {...props} />)

    await userEvent.click(screen.getByTitle('Add emoji'))
    expect(screen.getByText('Pick an emoji')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)

    expect(screen.queryByText('Pick an emoji')).not.toBeInTheDocument()
  })

  it('renders hashtags with highlight styling in overlay content', () => {
    const props = buildProps({ content: 'Ship #launch today' })
    render(<CreatePostForm {...props} />)

    const hashtagNode = screen.getByText('#launch')
    expect(hashtagNode).toHaveClass('text-indigo-500')
  })

  it('inserts hashtag marker at the current cursor position', async () => {
    const { onContentChange } = renderControlledForm('HelloWorld')
    const textarea = screen.getByPlaceholderText("What's happening?")

    await userEvent.click(textarea)
    textarea.setSelectionRange(5, 5)

    await userEvent.click(screen.getByTitle('Add hashtag'))

    expect(textarea).toHaveValue('Hello #World')
    expect(onContentChange).toHaveBeenLastCalledWith('Hello #World')
  })

  it('adds a picked emoji at cursor and closes emoji picker', async () => {
    const { onContentChange } = renderControlledForm('Hi')
    const textarea = screen.getByPlaceholderText("What's happening?")

    await userEvent.click(textarea)
    textarea.setSelectionRange(2, 2)

    await userEvent.click(screen.getByTitle('Add emoji'))
    await userEvent.click(screen.getByRole('button', { name: '😀' }))

    expect(textarea).toHaveValue('Hi 😀 ')
    expect(onContentChange).toHaveBeenLastCalledWith('Hi 😀 ')
    expect(screen.queryByText('Pick an emoji')).not.toBeInTheDocument()
  })

  it('adds a trimmed custom emoji value and closes emoji picker', async () => {
    const { onContentChange } = renderControlledForm('')
    const textarea = screen.getByPlaceholderText("What's happening?")

    await userEvent.click(textarea)
    textarea.setSelectionRange(0, 0)

    await userEvent.click(screen.getByTitle('Add emoji'))

    const picker = screen.getByText('Pick an emoji').closest('div')
    const customInput = within(picker).getByPlaceholderText('Type emoji')
    await userEvent.type(customInput, '  :party:  ')
    await userEvent.click(within(picker).getByRole('button', { name: 'Add' }))

    expect(textarea).toHaveValue(' :party: ')
    expect(onContentChange).toHaveBeenLastCalledWith(' :party: ')
    expect(screen.queryByText('Pick an emoji')).not.toBeInTheDocument()
  })

  it('does not add custom emoji when value is only whitespace', async () => {
    const { onContentChange } = renderControlledForm('Ping')

    await userEvent.click(screen.getByTitle('Add emoji'))

    const picker = screen.getByText('Pick an emoji').closest('div')
    const customInput = within(picker).getByPlaceholderText('Type emoji')
    await userEvent.type(customInput, '   ')
    await userEvent.click(within(picker).getByRole('button', { name: 'Add' }))

    expect(onContentChange).not.toHaveBeenCalled()
    expect(screen.getByText('Pick an emoji')).toBeInTheDocument()
  })

  it('forwards uploaded file through onMediaUpload', async () => {
    const props = buildProps()
    render(<CreatePostForm {...props} />)

    const photoLabel = screen.getByTitle('Add photo')
    const photoInput = photoLabel.querySelector('input[type="file"]')
    const file = new File(['image-bytes'], 'preview.png', { type: 'image/png' })

    await userEvent.upload(photoInput, file)

    expect(props.onMediaUpload).toHaveBeenCalled()
  })

  it('disables submit when content exceeds max characters', () => {
    const props = buildProps({ content: 'a'.repeat(281) })
    render(<CreatePostForm {...props} />)

    expect(screen.getByRole('button', { name: /create post/i })).toBeDisabled()
  })
})

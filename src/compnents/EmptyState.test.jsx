import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../test/test-utils'
import EmptyState from './EmptyState'

const TestIcon = (props) => <svg data-testid='empty-state-icon' {...props} />

describe('EmptyState component', () => {
  it('renders icon, title, description, and handles action clicks', () => {
    const onAction = vi.fn()

    render(
      <EmptyState
        icon={TestIcon}
        title='No posts yet'
        description='Create your first post to get started.'
        actionLabel='Create Post'
        onAction={onAction}
      />,
    )

    expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument()
    expect(screen.getByText('No posts yet')).toBeInTheDocument()
    expect(screen.getByText('Create your first post to get started.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /create post/i }))
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('does not render the action button when action props are missing', () => {
    render(<EmptyState icon={TestIcon} title='Nothing here' description='No content available.' />)

    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

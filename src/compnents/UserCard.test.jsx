import { fireEvent, render, screen } from '../test/test-utils'
import { describe, expect, it, vi } from 'vitest'
import UserCard from './UserCard'

const user = {
  _id: 'u1',
  profile_picture: 'avatar.png',
  full_name: 'Jane Doe',
  username: 'jane_doe',
  bio: 'Line one\n\nLine two',
  location: 'Cairo',
  followers: ['u2', 'u3'],
}

describe('UserCard', () => {
  it('opens profile from avatar and name interactions', () => {
    const onOpenProfile = vi.fn()
    const onToggleFollow = vi.fn()

    render(
      <UserCard
        user={user}
        isFollowing={false}
        onToggleFollow={onToggleFollow}
        onOpenProfile={onOpenProfile}
      />,
    )

    fireEvent.click(screen.getByAltText('Jane Doe'))
    fireEvent.click(screen.getByText('Jane Doe'))

    expect(onOpenProfile).toHaveBeenCalledTimes(2)
    expect(onOpenProfile).toHaveBeenNthCalledWith(1, 'u1')
    expect(onOpenProfile).toHaveBeenNthCalledWith(2, 'u1')
  })

  it('toggles follow and only allows secondary profile action when following', () => {
    const onOpenProfile = vi.fn()
    const onToggleFollow = vi.fn()

    const { rerender } = render(
      <UserCard
        user={user}
        isFollowing={false}
        onToggleFollow={onToggleFollow}
        onOpenProfile={onOpenProfile}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Follow' }))
    expect(onToggleFollow).toHaveBeenCalledWith('u1')

    fireEvent.click(screen.getByRole('button', { name: '+' }))
    expect(onOpenProfile).not.toHaveBeenCalled()

    rerender(
      <UserCard
        user={user}
        isFollowing={true}
        onToggleFollow={onToggleFollow}
        onOpenProfile={onOpenProfile}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /profile/i }))
    expect(onOpenProfile).toHaveBeenCalledWith('u1')
  })

  it('normalizes bio whitespace for display', () => {
    render(
      <UserCard
        user={user}
        isFollowing={false}
        onToggleFollow={() => {}}
        onOpenProfile={() => {}}
      />,
    )

    expect(screen.getByText('Line one Line two')).toBeInTheDocument()
    expect(screen.getByText('2 Followers')).toBeInTheDocument()
    expect(screen.getByText('Cairo')).toBeInTheDocument()
  })
})

import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { render, screen, userEvent, waitFor } from '../test/test-utils'
import Profile from './profile'
import { dummyPostsData } from '../assets/assets'
import { dummyUserData } from '../assets/assets'

vi.mock('../compnents/postCard', () => ({
  default: ({ post }) => <div data-testid='post-card'>{post._id}</div>,
}))

vi.mock('../compnents/EmptyState', () => ({
  default: ({ title }) => <div data-testid='empty-state'>{title}</div>,
}))

vi.mock('../compnents/EditProfileDrawer', () => ({
  default: ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null
    return (
      <div data-testid='edit-profile-drawer'>
        <button
          type='button'
          onClick={() => {
            onSave({ full_name: 'Renamed In Test' })
            onClose()
          }}
        >
          Save mocked profile
        </button>
      </div>
    )
  },
}))

const renderProfileRoute = (initialEntries) => {
  return render(
    <Routes>
      <Route path='/profile' element={<Profile />} />
      <Route path='/profile/:profileId' element={<Profile />} />
    </Routes>,
    { initialEntries },
  )
}

const originalDummyUserData = JSON.parse(JSON.stringify(dummyUserData))

const resetDummyUserData = () => {
  Object.keys(dummyUserData).forEach((key) => {
    delete dummyUserData[key]
  })

  Object.assign(dummyUserData, JSON.parse(JSON.stringify(originalDummyUserData)))
}

describe('Profile page', () => {
  beforeEach(() => {
    resetDummyUserData()
  })

  afterEach(() => {
    resetDummyUserData()
  })

  it('resolves a profile from route params', () => {
    renderProfileRoute(['/profile/user_2'])

    expect(screen.getByRole('heading', { name: 'Richard Hendricks' })).toBeInTheDocument()
  })

  it('applies tabButtonClass active and inactive states while switching tabs', async () => {
    renderProfileRoute(['/profile'])

    const postsButton = screen.getByRole('button', { name: /posts/i })
    const mediaButton = screen.getByRole('button', { name: /media/i })
    const likesButton = screen.getByRole('button', { name: /likes/i })

    expect(postsButton.className).toContain('bg-gradient-to-r')
    expect(mediaButton.className).toContain('text-slate-500')
    expect(likesButton.className).toContain('text-slate-500')

    await userEvent.click(mediaButton)
    expect(mediaButton.className).toContain('bg-gradient-to-r')
    expect(postsButton.className).toContain('text-slate-500')

    await userEvent.click(likesButton)
    expect(likesButton.className).toContain('bg-gradient-to-r')
    expect(mediaButton.className).toContain('text-slate-500')
  })

  it('filters posts when switching tabs', async () => {
    renderProfileRoute(['/profile'])

    expect(screen.getAllByTestId('post-card')).toHaveLength(dummyPostsData.length)

    await userEvent.click(screen.getByRole('button', { name: /media/i }))
    expect(screen.getAllByTestId('post-card')).toHaveLength(
      dummyPostsData.filter((post) => post.image_urls?.length > 0).length,
    )

    await userEvent.click(screen.getByRole('button', { name: /likes/i }))
    expect(screen.getAllByTestId('post-card')).toHaveLength(
      dummyPostsData.filter((post) => post.likes_count?.length > 0).length,
    )
  })

  it('handleProfileSave updates local profile and shared dummy user on own profile route', async () => {
    renderProfileRoute(['/profile'])

    expect(dummyUserData.full_name).toBe(originalDummyUserData.full_name)
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    await userEvent.click(screen.getByRole('button', { name: /save mocked profile/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /renamed in test/i })).toBeInTheDocument()
    })

    expect(dummyUserData.full_name).toBe('Renamed In Test')
    expect(dummyUserData.updatedAt).not.toBe(originalDummyUserData.updatedAt)
  })

  it('handleProfileSave does not mutate shared dummy user when viewing another profile', async () => {
    renderProfileRoute(['/profile/user_2'])

    expect(screen.getByRole('heading', { name: /richard hendricks/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    await userEvent.click(screen.getByRole('button', { name: /save mocked profile/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /renamed in test/i })).toBeInTheDocument()
    })

    expect(dummyUserData.full_name).toBe(originalDummyUserData.full_name)
  })
})

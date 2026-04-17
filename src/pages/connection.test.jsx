import { fireEvent, render, screen } from '../test/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockNavigate, followersData, followingData, pendingData, connectionsData } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  followersData: [],
  followingData: [],
  pendingData: [],
  connectionsData: [],
}))

vi.mock('../assets/assets', () => ({
  dummyFollowersData: followersData,
  dummyFollowingData: followingData,
  dummyPendingConnectionsData: pendingData,
  dummyConnectionsData: connectionsData,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import Connections from './connection'

const baseUser = {
  profile_picture: 'profile.png',
  bio: 'A short profile bio for tests',
}

describe('Connections page', () => {
  beforeEach(() => {
    mockNavigate.mockReset()

    followersData.splice(0, followersData.length, {
      ...baseUser,
      _id: 'f1',
      full_name: 'Follower One',
      username: 'follower_one',
    })

    followingData.splice(0, followingData.length)

    pendingData.splice(0, pendingData.length, {
      ...baseUser,
      _id: 'p1',
      full_name: 'Pending User',
      username: 'pending_user',
    })

    connectionsData.splice(0, connectionsData.length)
  })

  it('renders default followers tab and handles profile navigation interaction', () => {
    render(<Connections />)

    expect(screen.getByRole('heading', { name: 'Connections' })).toBeInTheDocument()
    expect(screen.getByText('Follower One')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Message' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'View Profile' }))
    expect(mockNavigate).toHaveBeenCalledWith('/profile/f1')
  })

  it('switches to pending tab and exposes Accept secondary action', () => {
    render(<Connections />)

    fireEvent.click(screen.getByRole('button', { name: /pending/i }))
    expect(screen.getByText('Pending User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument()
  })

  it('switches to following tab and renders Message secondary action for non-empty data', () => {
    followingData.splice(0, followingData.length, {
      ...baseUser,
      _id: 'g1',
      full_name: 'Following User',
      username: 'following_user',
    })

    render(<Connections />)

    fireEvent.click(screen.getByRole('button', { name: /following/i }))
    expect(screen.getByText('Following User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Message' })).toBeInTheDocument()
  })

  it('switches to all connections tab and renders Message secondary action for non-empty data', () => {
    connectionsData.splice(0, connectionsData.length, {
      ...baseUser,
      _id: 'c1',
      full_name: 'Connection User',
      username: 'connection_user',
    })

    render(<Connections />)

    fireEvent.click(screen.getByRole('button', { name: /all connections/i }))
    expect(screen.getByText('Connection User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Message' })).toBeInTheDocument()
  })

  it('shows empty state for following tab and triggers discover navigation action', () => {
    render(<Connections />)

    fireEvent.click(screen.getByRole('button', { name: /following/i }))
    expect(screen.getByText('No following yet')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Discover People' }))
    expect(mockNavigate).toHaveBeenCalledWith('/discover')
  })
})
